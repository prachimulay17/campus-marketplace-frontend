import { useState, useRef, useCallback } from "react";
import { emitTyping, clearTyping } from "@/services/chat.service";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
  conversationId: string;
}

export default function MessageInput({ onSend, disabled, conversationId }: Props) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      if (conversationId) emitTyping(conversationId);
    },
    [conversationId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (conversationId) clearTyping(conversationId);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 px-4 py-3 border-t border-white/10 bg-[#0f0b1a]/60"
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-white text-sm outline-none placeholder-gray-500 disabled:opacity-50 focus:border-purple-500/40 transition-colors"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="px-5 py-2.5 rounded-full border-none text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-default"
        style={{
          background:
            text.trim() && !disabled ? "#7c3aed" : "rgba(255,255,255,0.08)",
        }}
      >
        Send
      </button>
    </form>
  );
}
