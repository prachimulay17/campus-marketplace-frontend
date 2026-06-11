import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import {
  connectSocket,
  disconnectSocket,
  fetchConversations,
  onReceiveMessage,
  offReceiveMessage,
  onMessagesSeen,
  offMessagesSeen,
  onUserTyping,
  offUserTyping,
  onUserStoppedTyping,
  offUserStoppedTyping,
  onMessageDeleted,
  offMessageDeleted,
  hideConversation,
} from "@/services/chat.service";
import type { Conversation, Message } from "@/types";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialConvId = (location.state as any)?.activeConversationId;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  useEffect(() => {
    connectSocket();

    const load = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data);
        if (initialConvId) {
          const match = data.find((c) => c._id === initialConvId);
          if (match) setActiveConv(match);
          window.history.replaceState({}, "");
        }
      } catch (err) {
        console.error("[Chat] Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Sync incoming messages to conversation list
    onReceiveMessage((msg: Message) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === msg.conversationId);
        if (idx === -1) return prev;
        const updated = [...prev];
        const conv = { ...updated[idx] };
        conv.lastMessage = msg;
        // Increment unread for receiver (not sender)
        const myId = JSON.parse(
          localStorage.getItem("user") || "{}"
        )._id;
        if (msg.sender._id !== myId) {
          conv.unreadCounts = {
            ...conv.unreadCounts,
            [myId]: (conv.unreadCounts?.[myId] || 0) + 1,
          };
        }
        updated.splice(idx, 1);
        updated.unshift(conv);
        return updated;
      });
    });

    // Sync seen status to conversation list (clear unread)
    onMessagesSeen(({ conversationId, seenBy }) => {
      const myId = JSON.parse(localStorage.getItem("user") || "{}")._id;
      if (seenBy === myId) return; // Don't clear our own unread on our own seen events
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === conversationId);
        if (idx === -1) return prev;
        const updated = [...prev];
        const conv = { ...updated[idx] };
        conv.unreadCounts = { ...conv.unreadCounts, [seenBy]: 0 };
        updated[idx] = conv;
        return updated;
      });
    });

    // Typing indicators for conversation list
    onUserTyping(({ conversationId, userId }) => {
      const conv = conversationsRef.current.find((c) => c._id === conversationId);
      const other = conv?.participants.find((p) => p._id === userId);
      if (other) {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: `${other.name} is typing...`,
        }));
      }
    });

    onUserStoppedTyping(({ conversationId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    });

    // Handle message deleted events
    onMessageDeleted(({ messageId, conversationId, type }) => {
      if (type === "forEveryone") {
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c._id === conversationId);
          if (idx === -1) return prev;
          const updated = [...prev];
          const conv = { ...updated[idx] };
          if (conv.lastMessage?._id === messageId) {
            conv.lastMessage = {
              ...conv.lastMessage,
              deletedForAll: true,
              content: "This message was deleted",
            };
          }
          updated[idx] = conv;
          return updated;
        });
      }
    });

    return () => {
      disconnectSocket();
      offReceiveMessage();
      offMessagesSeen();
      offUserTyping();
      offUserStoppedTyping();
      offMessageDeleted();
    };
  }, [initialConvId]);

  const handleSelect = useCallback((conv: Conversation) => {
    setActiveConv(conv);
  }, []);

  const handleHide = useCallback(async (conv: Conversation) => {
    const myId = JSON.parse(localStorage.getItem("user") || "{}")._id;
    try {
      await hideConversation(conv._id);
      // Remove from local state
      setConversations((prev) => prev.filter((c) => c._id !== conv._id));
      // If this was the active conversation, clear it
      setActiveConv((prev) => (prev?._id === conv._id ? null : prev));
    } catch (err) {
      console.error("[Chat] Hide failed:", err);
    }
  }, []);

  return (
    <Layout showFooter={false}>
      <div className="flex h-[calc(100vh-64px)] max-w-[1200px] mx-auto w-full">
        {/* Sidebar */}
        <div className="w-[360px] min-w-[300px] border-r border-white/10 overflow-y-auto bg-black/15">
          <div className="px-4 py-4 border-b border-white/10 font-bold text-lg text-white flex items-center justify-between">
            <span>Messages</span>
            <button
              onClick={() => navigate("/browse")}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Browse items
            </button>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={activeConv?._id || null}
            onSelect={handleSelect}
            onHide={handleHide}
            loading={loading}
            typingUsers={typingUsers}
          />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <ChatWindow
              key={activeConv._id}
              conversation={activeConv}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-base">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
