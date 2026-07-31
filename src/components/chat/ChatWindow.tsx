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

const quickReplyChips = [
  "Is this available?",
  "Can we meet today?",
  "Price negotiable?",
  "Where should we meet?",
];

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
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const otherParticipant =
    conversation.participants.find((p) => p._id !== user?._id) ||
    conversation.participants[0];

  // Check if we should show meetup suggestion (after 5+ messages)
  const shouldShowMeetupSuggestion = messages.length >= 5 && messages.length <= 7;

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    setTypingUsers(new Set());

    const load = async () => {
      try {
        const data: MessagesResponse = await fetchMessages(conversation._id);
        const msgs = data.messages.reverse();
        setMessages(msgs);
        // Show quick replies if this is the first conversation with no messages
        setShowQuickReplies(msgs.length === 0);
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

    // Define handlers for this conversation
    const handleReceiveMessage = (msg: Message) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => [...prev, msg]);
        setShowQuickReplies(false); // Hide quick replies once conversation starts
        // Auto-mark as seen if the chat is open
        markMessagesSeen(conversation._id).catch(() => {});
      }
    };

    const handleMessagesSeen = ({ conversationId, seenBy }: { conversationId: string; seenBy: string }) => {
      if (conversationId === conversation._id && seenBy !== user?._id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender._id === user?._id && m.status !== "seen"
              ? { ...m, status: "seen" as const }
              : m
          )
        );
      }
    };

    const handleUserStatus = ({ userId, status, lastSeen }: { userId: string; status: "online" | "offline"; lastSeen?: string }) => {
      if (userId === otherParticipant._id) {
        setOtherOnline(status === "online");
        if (status === "offline" && lastSeen) {
          setOtherLastSeen(lastSeen);
        } else if (status === "online") {
          setOtherLastSeen(undefined);
        }
      }
    };

    const handleUserTyping = ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === conversation._id && userId !== user?._id) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    };

    const handleUserStoppedTyping = ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === conversation._id && userId !== user?._id) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    const handleMessageDeleted = ({ messageId, conversationId, type, content }: { messageId: string; conversationId: string; type: "forMe" | "forEveryone"; content?: string }) => {
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
    };

    // Register event listeners
    onReceiveMessage(handleReceiveMessage);
    onMessagesSeen(handleMessagesSeen);
    onUserStatus(handleUserStatus);
    onUserTyping(handleUserTyping);
    onUserStoppedTyping(handleUserStoppedTyping);
    onMessageDeleted(handleMessageDeleted);

    return () => {
      leaveConversation(conversation._id).catch(() => {});
      offReceiveMessage(handleReceiveMessage);
      offMessagesSeen(handleMessagesSeen);
      offUserStatus(handleUserStatus);
      offUserTyping(handleUserTyping);
      offUserStoppedTyping(handleUserStoppedTyping);
      offMessageDeleted(handleMessageDeleted);
    };
  }, [conversation._id, user?._id, otherParticipant._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = useCallback(
    async (content: string) => {
      if (sending) return;
      setSending(true);
      setShowQuickReplies(false);
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

  const handleQuickReply = (text: string) => {
    handleSend(text);
  };

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
      <div className="chat-window-loading">
        <div className="chat-loading-content">
          <div className="chat-loading-spinner"></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  const isTyping = typingUsers.size > 0;

  return (
    <div className="chat-window">
      {/* Product Preview Card */}
      <div className="chat-product-card">
        {conversation.item ? (
          <div className="chat-product-content">
            <div className="chat-product-polaroid">
              <img
                src={conversation.item.images?.[0] || '/placeholder-item.jpg'}
                alt={conversation.item.title}
                className="chat-product-image"
              />
              <div className="chat-product-caption">
                {conversation.item.title}
              </div>
            </div>
            <div className="chat-product-details">
              <h3 className="chat-product-title">{conversation.item.title}</h3>
              <div className="chat-product-price">₹{conversation.item.price.toLocaleString()}</div>
              <div className="chat-product-seller">
                <span className="chat-product-seller-avatar">
                  {otherParticipant.name.charAt(0).toUpperCase()}
                </span>
                <span className="chat-product-seller-name">{otherParticipant.name}</span>
                <span className={`chat-product-status ${otherOnline ? 'online' : 'offline'}`}>
                  {otherOnline ? 'Online' : formatLastSeen(otherLastSeen || otherParticipant.lastSeen)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-product-unavailable">
            <div className="chat-product-unavailable-content">
              <div className="chat-product-unavailable-icon">📦</div>
              <div>
                <h3 className="chat-product-unavailable-title">Item no longer available</h3>
                <p className="chat-product-unavailable-desc">This item has been removed or sold</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="chat-messages-area">
        {messages.length === 0 && !showQuickReplies && (
          <div className="chat-empty-messages">
            <div className="chat-empty-messages-content">
              <div className="chat-empty-messages-icon">👋</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        )}

        {/* Quick Reply Chips */}
        {showQuickReplies && (
          <div className="chat-quick-replies">
            <p className="chat-quick-replies-title">Quick replies to get started:</p>
            <div className="chat-quick-replies-grid">
              {quickReplyChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleQuickReply(chip)}
                  className="chat-quick-reply-chip"
                  disabled={sending}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages-list">
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
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={isOwn}
                groupPosition={groupPosition}
                showSender={groupPosition === "first" || groupPosition === "single"}
                currentUserId={user?._id || ""}
                onDelete={handleDelete}
              />
            );
          })}

          {/* Meetup Suggestion Card */}
          {shouldShowMeetupSuggestion && conversation.item && (
            <div className="editorial-message-bubble">
              <div className="chat-meetup-suggestion">
                <div className="chat-meetup-content">
                  <div className="chat-meetup-icon">🤝</div>
                  <div className="chat-meetup-text">
                    <h4>Ready to meet up?</h4>
                    <p>Looks like you're both interested! Consider meeting in a safe, public place.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="editorial-message-bubble other">
              <div className="editorial-bubble-wrapper other">
                <div className="editorial-bubble-content other">
                  <div className="chat-typing-dots">
                    <span className="chat-typing-dot"></span>
                    <span className="chat-typing-dot"></span>
                    <span className="chat-typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <MessageInput
        onSend={handleSend}
        disabled={sending}
        conversationId={conversation._id}
      />
    </div>
  );
}
