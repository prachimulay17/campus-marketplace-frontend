import { useState, useRef, useEffect } from "react";
import type { Message } from "@/types";

type GroupPosition = "single" | "first" | "middle" | "last";

interface Props {
  message: Message;
  isOwn: boolean;
  groupPosition: GroupPosition;
  showSender: boolean;
  currentUserId: string;
  onDelete: (messageId: string, type: "forMe" | "forEveryone") => void;
}

const ownRadius: Record<GroupPosition, string> = {
  single: "rounded-[18px_18px_4px_18px]",
  first: "rounded-[18px_18px_4px_18px]",
  middle: "rounded-[4px_18px_4px_18px]",
  last: "rounded-[4px_18px_18px_18px]",
};

const otherRadius: Record<GroupPosition, string> = {
  single: "rounded-[18px_18px_18px_4px]",
  first: "rounded-[18px_18px_18px_4px]",
  middle: "rounded-[18px_4px_18px_4px]",
  last: "rounded-[18px_4px_4px_18px]",
};

function StatusIcon({ status }: { status: Message["status"] }) {
  if (status === "sent") {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M11.5 1L4.5 8.5L1 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (status === "delivered") {
    return (
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
        <path d="M14.5 1L7.5 8.5L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 1L4.5 8.5L1 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // seen — double check in blue/purple
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="inline-block ml-1">
      <path d="M14.5 1L7.5 8.5L5 6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 1L4.5 8.5L1 5.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function MessageBubble({
  message,
  isOwn,
  groupPosition,
  showSender,
  currentUserId,
  onDelete,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const radius = isOwn ? ownRadius[groupPosition] : otherRadius[groupPosition];

  // Check if message is deleted for current user
  const isDeletedForMe = message.deletedBy?.includes(currentUserId) || false;
  const isDeletedForAll = message.deletedForAll || false;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  // Don't render if deleted for current user
  if (isDeletedForMe) return null;

  // Check if unsend is available (within 15 minutes and sender)
  const isWithinUnsendWindow = () => {
    if (!isOwn) return false;
    const elapsed = Date.now() - new Date(message.createdAt).getTime();
    return elapsed <= 15 * 60 * 1000;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleMenuClick = (type: "forMe" | "forEveryone") => {
    onDelete(message._id, type);
    setShowMenu(false);
  };

  // Deleted message placeholder
  if (isDeletedForAll) {
    return (
      <div
        className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
          groupPosition === "first" || groupPosition === "single" ? "mt-2.5" : "mt-0.5"
        }`}
      >
        <div className={`flex items-end gap-2 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
          {!isOwn && showSender ? (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 mb-0.5">
              {message.sender.name?.charAt(0).toUpperCase() || "?"}
            </div>
          ) : !isOwn ? (
            <div className="w-7 shrink-0" />
          ) : null}

          <div>
            {!isOwn && showSender && (
              <div className="text-[11px] text-gray-500 mb-0.5 ml-1">
                {message.sender.name}
              </div>
            )}
            <div
              className={`px-3 py-1.5 text-[14px] leading-[1.4] break-words italic ${
                isOwn
                  ? `bg-purple-600/50 text-white/70 ${radius}`
                  : `bg-[#1a1625]/50 text-gray-500 ${radius}`
              }`}
            >
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>{message.content}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
        groupPosition === "first" || groupPosition === "single" ? "mt-2.5" : "mt-0.5"
      }`}
    >
      <div className={`flex items-end gap-2 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar — only for other's group start */}
        {!isOwn && showSender ? (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 mb-0.5">
            {message.sender.name?.charAt(0).toUpperCase() || "?"}
          </div>
        ) : !isOwn ? (
          <div className="w-7 shrink-0" />
        ) : null}

        <div className="relative">
          {/* Sender name — only at group start for other messages */}
          {!isOwn && showSender && (
            <div className="text-[11px] text-gray-500 mb-0.5 ml-1">
              {message.sender.name}
            </div>
          )}

          {/* Bubble */}
          <div
            className={`px-3 py-1.5 text-[14px] leading-[1.4] break-words cursor-pointer group ${
              isOwn
                ? `bg-purple-600 text-white ${radius}`
                : `bg-[#1a1625] text-gray-100 ${radius}`
            }`}
            onContextMenu={handleContextMenu}
          >
            <div className="flex items-center gap-1">
              <span>{message.content}</span>
              {/* Menu trigger for own messages */}
              {isOwn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuPos({ x: e.clientX, y: e.clientY });
                    setShowMenu(!showMenu);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-[#1a1625] border border-white/10 rounded-lg shadow-xl py-1 min-w-[160px]"
          style={{ left: menuPos.x, top: menuPos.y }}
        >
          <button
            onClick={() => handleMenuClick("forMe")}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
          >
            Delete for me
          </button>
          {isWithinUnsendWindow() && (
            <button
              onClick={() => handleMenuClick("forEveryone")}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
            >
              Unsend for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function MessageTimestamp({
  message,
  isOwn,
  groupPosition,
}: {
  message: Message;
  isOwn: boolean;
  groupPosition: GroupPosition;
}) {
  if (groupPosition !== "last" && groupPosition !== "single") return null;
  if (message.deletedForAll) return null;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mt-0.5`}>
      <div className="ml-9 flex items-center gap-0.5">
        <span className="text-[10px] text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isOwn && <StatusIcon status={message.status} />}
      </div>
    </div>
  );
}
