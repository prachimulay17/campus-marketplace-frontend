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
    return <div className="p-6 text-gray-500">Loading conversations...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No conversations yet. Browse items and message a seller to get started.
      </div>
    );
  }

  return (
    <div>
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
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
              isActive
                ? "bg-purple-500/15 border-l-[3px] border-purple-500"
                : "border-l-[3px] border-transparent hover:bg-white/5"
            }`}
          >
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base">
                {other.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0f0b1a] ${
                  isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-white truncate flex items-center gap-1.5">
                  {other.name}
                </span>
                <span className="text-[11px] text-gray-500 shrink-0 ml-2">
                  {conv.lastMessage
                    ? formatTime(conv.lastMessage.createdAt)
                    : ""}
                </span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                {typingText ? (
                  <span className="text-xs text-purple-400 italic truncate max-w-[80%]">
                    {typingText}
                  </span>
                ) : (
                  <span className={`text-xs truncate max-w-[80%] ${conv.lastMessage?.deletedForAll ? 'italic text-gray-600' : 'text-gray-500'}`}>
                    {conv.lastMessage?.deletedForAll
                      ? "This message was deleted"
                      : conv.lastMessage?.content || conv.item?.title || "Item no longer available"}
                  </span>
                )}
                {unread > 0 && (
                  <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold shrink-0">
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
          className="fixed z-50 bg-[#1a1625] border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              onHide(contextMenu.conv);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
          >
            Delete chat
          </button>
        </div>
      )}
    </div>
  );
}
