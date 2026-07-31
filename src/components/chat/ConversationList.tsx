import { useEffect, useState, useRef } from "react";
import type { Conversation } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { onUserStatus, offUserStatus } from "@/services/chat.service";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (conv: Conversation) => void;
  onHide: (conv: Conversation) => void;
  loading: boolean;
  typingUsers: Record<string, string>; // convId -> "Someone is typing..."
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onHide,
  loading,
  typingUsers,
}: Props) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    conv: Conversation;
    x: number;
    y: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onUserStatus(({ userId, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === "online") next.add(userId);
        else next.delete(userId);
        return next;
      });
    });
    return () => offUserStatus();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu]);

  const getOtherParticipant = (conv: Conversation) =>
    conv.participants.find((p) => p._id !== user?._id) || conv.participants[0];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (diffDays === 1) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="chat-loading-conversations">
        <div className="chat-loading-spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="chat-no-conversations">
        <div className="chat-no-conversations-content">
          <div className="chat-no-conversations-icon">💬</div>
          <h3>No conversations yet</h3>
          <p>Browse items and message a seller to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map((conv) => {
        const other = getOtherParticipant(conv);
        const isActive = conv._id === activeId;
        const unread = conv.unreadCounts?.[user?._id || ""] || 0;
        const isOnline = onlineUsers.has(other._id);
        const typingText = typingUsers[conv._id];

        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ conv, x: e.clientX, y: e.clientY });
            }}
            className={`conversation-list-item ${isActive ? 'active' : ''}`}
          >
            <div className="conversation-avatar">
              <div className="conversation-avatar-circle">
                {other.name.charAt(0).toUpperCase()}
              </div>
              <span className={`conversation-status-dot ${isOnline ? 'online' : 'offline'}`} />
            </div>

            <div className="conversation-content">
              <div className="conversation-header">
                <span className="conversation-name">{other.name}</span>
                <span className="conversation-time">
                  {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ""}
                </span>
              </div>
              <div className="conversation-preview">
                <span className={`conversation-message ${
                  typingText ? 'typing' : ''
                } ${conv.lastMessage?.deletedForAll ? 'deleted' : ''}`}>
                  {typingText || 
                   (conv.lastMessage?.deletedForAll
                     ? "This message was deleted"
                     : conv.lastMessage?.content || conv.item?.title || "Item no longer available")}
                </span>
                {unread > 0 && (
                  <span className="conversation-unread">
                    {unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="chat-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              onHide(contextMenu.conv);
              setContextMenu(null);
            }}
            className="chat-context-menu-item"
          >
            Delete chat
          </button>
        </div>
      )}
    </div>
  );
}
