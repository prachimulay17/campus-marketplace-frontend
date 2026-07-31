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
      <div className={`editorial-message-bubble ${isOwn ? 'own' : 'other'}`}>
        <div className={`editorial-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
          <div className={`editorial-bubble-content ${isOwn ? 'own' : 'other'} opacity-60`}>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              <span className="italic">{message.content}</span>
            </div>
          </div>
          {(groupPosition === "last" || groupPosition === "single") && (
            <MessageTimestamp
              message={message}
              isOwn={isOwn}
              groupPosition={groupPosition}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`editorial-message-bubble ${isOwn ? 'own' : 'other'}`}>
      <div className={`editorial-bubble-wrapper ${isOwn ? 'own' : 'other'}`}>
        {/* Sender name for other messages at group start */}
        {!isOwn && showSender && (
          <div className="text-xs text-gray-500 mb-1 px-2">
            {message.sender.name}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`editorial-bubble-content ${isOwn ? 'own' : 'other'} group cursor-pointer relative`}
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
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded-full ml-2"
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

        {/* Timestamp */}
        {(groupPosition === "last" || groupPosition === "single") && (
          <MessageTimestamp
            message={message}
            isOwn={isOwn}
            groupPosition={groupPosition}
          />
        )}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="chat-context-menu"
          style={{ left: menuPos.x, top: menuPos.y }}
        >
          <button
            onClick={() => handleMenuClick("forMe")}
            className="chat-context-menu-item"
          >
            Delete for me
          </button>
          {isWithinUnsendWindow() && (
            <button
              onClick={() => handleMenuClick("forEveryone")}
              className="chat-context-menu-item text-red-600"
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
    <div className={`message-timestamp ${isOwn ? 'own' : 'other'}`}>
      <span>
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      {isOwn && <StatusIcon status={message.status} />}
    </div>
  );
}
