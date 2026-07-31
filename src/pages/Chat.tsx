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
          let match = data.find((c) => c._id === initialConvId);
          
          // If conversation not found immediately (e.g., just unhidden), try once more after a brief delay
          if (!match) {
            setTimeout(async () => {
              try {
                const retryData = await fetchConversations();
                setConversations(retryData);
                const retryMatch = retryData.find((c) => c._id === initialConvId);
                if (retryMatch) {
                  setActiveConv(retryMatch);
                }
              } catch (retryErr) {
                console.error("[Chat] Retry fetch failed:", retryErr);
              }
            }, 500);
          } else {
            setActiveConv(match);
          }
          
          window.history.replaceState({}, "");
        }
      } catch (err) {
        console.error("[Chat] Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Define handlers for this component
    const handleReceiveMessage = (msg: Message) => {
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
    };

    const handleMessagesSeen = ({ conversationId, seenBy }: { conversationId: string; seenBy: string }) => {
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
    };

    const handleUserTyping = ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      const conv = conversationsRef.current.find((c) => c._id === conversationId);
      const other = conv?.participants.find((p) => p._id === userId);
      if (other) {
        setTypingUsers((prev) => ({
          ...prev,
          [conversationId]: `${other.name} is typing...`,
        }));
      }
    };

    const handleUserStoppedTyping = ({ conversationId }: { conversationId: string }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    };

    const handleMessageDeleted = ({ messageId, conversationId, type }: { messageId: string; conversationId: string; type: "forMe" | "forEveryone" }) => {
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
    };

    // Register all event listeners
    onReceiveMessage(handleReceiveMessage);
    onMessagesSeen(handleMessagesSeen);
    onUserTyping(handleUserTyping);
    onUserStoppedTyping(handleUserStoppedTyping);
    onMessageDeleted(handleMessageDeleted);

    return () => {
      disconnectSocket();
      offReceiveMessage(handleReceiveMessage);
      offMessagesSeen(handleMessagesSeen);
      offUserTyping(handleUserTyping);
      offUserStoppedTyping(handleUserStoppedTyping);
      offMessageDeleted(handleMessageDeleted);
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
      <div className="chat-page">
        <div className="chat-container">
          {/* Sidebar */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <span>Messages</span>
              <button
                onClick={() => navigate("/browse")}
                className="chat-browse-link"
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
          <div className="chat-main">
            {activeConv ? (
              <ChatWindow
                key={activeConv._id}
                conversation={activeConv}
              />
            ) : (
              <div className="chat-empty-state">
                <div className="chat-empty-content">
                  <div className="chat-empty-icon">💬</div>
                  <h3 className="chat-empty-title">Select a conversation</h3>
                  <p className="chat-empty-description">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
