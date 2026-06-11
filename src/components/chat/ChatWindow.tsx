import { useState, useEffect, useRef, useCallback } from "react";
import type { Conversation, Message, MessagesResponse } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchMessages,
  sendMessage,
  joinConversation,
  leaveConversation,
  onReceiveMessage,
  offReceiveMessage,
  onUserStatus,
  offUserStatus,
  onUserTyping,
  offUserTyping,
  onUserStoppedTyping,
  offUserStoppedTyping,
  onMessagesSeen,
  offMessagesSeen,
  markMessagesSeen,
  markConversationRead,
  onMessageDeleted,
  offMessageDeleted,
  deleteMessage,
} from "@/services/chat.service";
import MessageBubble, { MessageTimestamp } from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Props {
  conversation: Conversation;
}

function formatLastSeen(dateStr?: string): string {
  if (!dateStr) return "Offline";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Last seen just now";
  if (diffMin < 60) return `Last seen ${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Last seen ${diffHrs}h ago`;
  return `Last seen ${d.toLocaleDateString([], { month: "short", day: "numeric" })}`;
}

export default function ChatWindow({ conversation }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);
  const [otherLastSeen, setOtherLastSeen] = useState<string | undefined>();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherParticipant =
    conversation.participants.find((p) => p._id !== user?._id) ||
    conversation.participants[0];

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    setTypingUsers(new Set());

    const load = async () => {
      try {
        const data: MessagesResponse = await fetchMessages(conversation._id);
        setMessages(data.messages.reverse());
        markConversationRead(conversation._id).catch(() => {});
        // Mark messages from the other participant as seen
        markMessagesSeen(conversation._id).catch(() => {});
      } catch (err) {
        console.error("[ChatWindow] Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    joinConversation(conversation._id).catch((err) =>
      console.error("[ChatWindow] join failed:", err)
    );

    // Receive new messages
    onReceiveMessage((msg: Message) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => [...prev, msg]);
        // Auto-mark as seen if the chat is open
        markMessagesSeen(conversation._id).catch(() => {});
      }
    });

    // Online status updates
    onUserStatus(({ userId, status, lastSeen }) => {
      if (userId === otherParticipant._id) {
        setOtherOnline(status === "online");
        if (status === "offline" && lastSeen) {
          setOtherLastSeen(lastSeen);
        } else if (status === "online") {
          setOtherLastSeen(undefined);
        }
      }
    });

    // Typing indicators
    onUserTyping(({ conversationId, userId }) => {
      if (conversationId === conversation._id && userId !== user?._id) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    });

    onUserStoppedTyping(({ conversationId, userId }) => {
      if (conversationId === conversation._id && userId !== user?._id) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    });

    // Messages seen by other participant — update status of own messages
    onMessagesSeen(({ conversationId, seenBy }) => {
      if (conversationId === conversation._id && seenBy !== user?._id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender._id === user?._id && m.status !== "seen"
              ? { ...m, status: "seen" as const }
              : m
          )
        );
      }
    });

    // Message deleted events
    onMessageDeleted(({ messageId, conversationId, type, content }) => {
      if (conversationId === conversation._id) {
        if (type === "forEveryone") {
          // Replace message content with deleted placeholder
          setMessages((prev) =>
            prev.map((m) =>
              m._id === messageId
                ? { ...m, deletedForAll: true, content: content || "This message was deleted" }
                : m
            )
          );
        } else {
          // Delete for me - remove from local state
          setMessages((prev) => prev.filter((m) => m._id !== messageId));
        }
      }
    });

    return () => {
      leaveConversation(conversation._id).catch(() => {});
      offReceiveMessage();
      offUserStatus();
      offUserTyping();
      offUserStoppedTyping();
      offMessagesSeen();
      offMessageDeleted();
    };
  }, [conversation._id, user?._id, otherParticipant._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = useCallback(
    async (content: string) => {
      if (sending) return;
      setSending(true);
      try {
        await sendMessage(conversation._id, content, otherParticipant._id);
      } catch (err) {
        console.error("[ChatWindow] send failed:", err);
      } finally {
        setSending(false);
      }
    },
    [conversation._id, otherParticipant._id, sending]
  );

  const handleDelete = useCallback(
    async (messageId: string, type: "forMe" | "forEveryone") => {
      try {
        await deleteMessage(messageId, type);
        // For "forMe", the socket event will handle removal from state
        // For "forEveryone", the socket event will update the message content
      } catch (err) {
        console.error("[ChatWindow] delete failed:", err);
      }
    },
    []
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading messages...
      </div>
    );
  }

  const isTyping = typingUsers.size > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#0f0b1a]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {otherParticipant.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sm text-white">
                {otherParticipant.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className={`w-2 h-2 rounded-full ${
                    otherOnline ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
                {otherOnline ? "Online" : formatLastSeen(otherLastSeen || otherParticipant.lastSeen)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {conversation.item
              ? `${conversation.item.title} — $${conversation.item.price}`
              : "Item no longer available"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            No messages yet. Say hello!
          </div>
        )}
        {messages.map((msg, idx) => {
          const isOwn = msg.sender._id === user?._id;
          const prev = messages[idx - 1];
          const next = messages[idx + 1];
          const sameAsPrev = prev && prev.sender._id === msg.sender._id;
          const sameAsNext = next && next.sender._id === msg.sender._id;

          let groupPosition: "single" | "first" | "middle" | "last";
          if (!sameAsPrev && !sameAsNext) groupPosition = "single";
          else if (!sameAsPrev && sameAsNext) groupPosition = "first";
          else if (sameAsPrev && sameAsNext) groupPosition = "middle";
          else groupPosition = "last";

          return (
            <div key={msg._id}>
              <MessageBubble
                message={msg}
                isOwn={isOwn}
                groupPosition={groupPosition}
                showSender={groupPosition === "first" || groupPosition === "single"}
                currentUserId={user?._id || ""}
                onDelete={handleDelete}
              />
              <MessageTimestamp
                message={msg}
                isOwn={isOwn}
                groupPosition={groupPosition}
              />
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mt-2.5">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 mb-0.5">
                {otherParticipant.name.charAt(0).toUpperCase()}
              </div>
              <div className="px-4 py-2.5 rounded-[18px_18px_18px_4px] bg-[#1a1625] flex items-center gap-1">
                <span className="typing-dot" />
                <span className="typing-dot animation-delay-200" />
                <span className="typing-dot animation-delay-400" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        disabled={sending}
        conversationId={conversation._id}
      />
    </div>
  );
}
