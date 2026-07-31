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
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Type a message..."
          disabled={disabled}
          className="chat-input-field"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className={`chat-input-send ${text.trim() && !disabled ? 'active' : ''}`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
