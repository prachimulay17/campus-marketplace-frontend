import { io, Socket } from "socket.io-client";
import api, { endpoints } from "@/lib/api";
import type { Conversation, Message, MessagesResponse } from "@/types";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";

let socket: Socket | null = null;
const typingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const TYPING_TIMEOUT_MS = 2000;

//
// Socket lifecycle
//

export function connectSocket() {
  if (socket?.connected) return socket;
  const token = localStorage.getItem("token");
  socket = io(SOCKET_URL, {
    withCredentials: true,
    auth: { token },
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

//
// Conversation rooms
//

export function joinConversation(conversationId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!socket) return reject(new Error("Socket not connected"));
    socket.emit("joinConversation", conversationId, (res: any) => {
      if (res?.success) resolve();
      else reject(new Error(res?.error || "Failed to join conversation"));
    });
  });
}

export function leaveConversation(conversationId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!socket) return reject(new Error("Socket not connected"));
    socket.emit("leaveConversation", conversationId, (res: any) => {
      if (res?.success) resolve();
      else reject(new Error(res?.error || "Failed to leave conversation"));
    });
  });
}

// Multiple listeners support for various events
const messageListeners = new Set<(message: Message) => void>();
const messagesSeenListeners = new Set<(data: { conversationId: string; seenBy: string }) => void>();
const userStatusListeners = new Set<(data: { userId: string; status: "online" | "offline"; lastSeen?: string }) => void>();
const userTypingListeners = new Set<(data: { conversationId: string; userId: string }) => void>();
const userStoppedTypingListeners = new Set<(data: { conversationId: string; userId: string }) => void>();
const messageDeletedListeners = new Set<(data: { messageId: string; conversationId: string; type: "forMe" | "forEveryone"; content?: string }) => void>();

//
// Send / receive messages
//

export function sendMessage(
  conversationId: string,
  content: string,
  receiverId: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!socket) return reject(new Error("Socket not connected"));
    socket.emit(
      "sendMessage",
      { conversationId, content, receiverId },
      (res: any) => {
        if (res?.success) resolve(res.data);
        else reject(new Error(res?.error || "Failed to send message"));
      }
    );
  });
}

export function onReceiveMessage(callback: (message: Message) => void) {
  if (!socket) return;
  
  messageListeners.add(callback);
  
  // Only set up socket listener if this is the first callback
  if (messageListeners.size === 1) {
    socket.off("receiveMessage").on("receiveMessage", (data: any) => {
      // Notify all registered listeners
      messageListeners.forEach(listener => listener(data.message));
    });
  }
}

export function offReceiveMessage(callback?: (message: Message) => void) {
  if (callback) {
    messageListeners.delete(callback);
  } else {
    messageListeners.clear();
  }
  
  // Only remove socket listener if no callbacks remain
  if (messageListeners.size === 0) {
    socket?.off("receiveMessage");
  }
}

//
// Read receipts
//

export function markMessagesSeen(conversationId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!socket) return reject(new Error("Socket not connected"));
    socket.emit(
      "markMessagesSeen",
      { conversationId },
      (res: any) => {
        if (res?.success) resolve();
        else reject(new Error(res?.error || "Failed to mark seen"));
      }
    );
  });
}

export function onMessagesSeen(
  callback: (data: {
    conversationId: string;
    seenBy: string;
  }) => void
) {
  if (!socket) return;
  
  messagesSeenListeners.add(callback);
  
  // Only set up socket listener if this is the first callback
  if (messagesSeenListeners.size === 1) {
    socket.off("messagesSeen").on("messagesSeen", (data) => {
      // Notify all registered listeners
      messagesSeenListeners.forEach(listener => listener(data));
    });
  }
}

export function offMessagesSeen(callback?: (data: { conversationId: string; seenBy: string }) => void) {
  if (callback) {
    messagesSeenListeners.delete(callback);
  } else {
    messagesSeenListeners.clear();
  }
  
  // Only remove socket listener if no callbacks remain
  if (messagesSeenListeners.size === 0) {
    socket?.off("messagesSeen");
  }
}

//
// Online / offline status + lastSeen
//

type StatusCallback = (data: {
  userId: string;
  status: "online" | "offline";
  lastSeen?: string;
}) => void;

export function onUserStatus(callback: StatusCallback) {
  if (!socket) return;
  
  userStatusListeners.add(callback);
  
  // Only set up socket listener if this is the first callback
  if (userStatusListeners.size === 1) {
    socket.off("userStatusUpdate").on("userStatusUpdate", (data) => {
      userStatusListeners.forEach(listener => listener(data));
    });
  }
}

export function offUserStatus(callback?: StatusCallback) {
  if (callback) {
    userStatusListeners.delete(callback);
  } else {
    userStatusListeners.clear();
  }
  
  // Only remove socket listener if no callbacks remain
  if (userStatusListeners.size === 0) {
    socket?.off("userStatusUpdate");
  }
}

//
// Typing indicators
//

type TypingCallback = (data: { conversationId: string; userId: string }) => void;

export function sendTypingStart(conversationId: string) {
  socket?.emit("typing_start", { conversationId });
}

export function sendTypingEnd(conversationId: string) {
  socket?.emit("typing_end", { conversationId });
}

export function onUserTyping(callback: TypingCallback) {
  if (!socket) return;
  
  userTypingListeners.add(callback);
  
  // Only set up socket listener if this is the first callback
  if (userTypingListeners.size === 1) {
    socket.off("user_typing").on("user_typing", (data) => {
      userTypingListeners.forEach(listener => listener(data));
    });
  }
}

export function offUserTyping(callback?: TypingCallback) {
  if (callback) {
    userTypingListeners.delete(callback);
  } else {
    userTypingListeners.clear();
  }
  
  // Only remove socket listener if no callbacks remain
  if (userTypingListeners.size === 0) {
    socket?.off("user_typing");
  }
}

export function onUserStoppedTyping(callback: TypingCallback) {
  if (!socket) return;
  
  userStoppedTypingListeners.add(callback);
  
  // Only set up socket listener if this is the first callback
  if (userStoppedTypingListeners.size === 1) {
    socket.off("user_stopped_typing").on("user_stopped_typing", (data) => {
      userStoppedTypingListeners.forEach(listener => listener(data));
    });
  }
}

export function offUserStoppedTyping(callback?: TypingCallback) {
  if (callback) {
    userStoppedTypingListeners.delete(callback);
  } else {
    userStoppedTypingListeners.clear();
  }
  
  // Only remove socket listener if no callbacks remain
  if (userStoppedTypingListeners.size === 0) {
    socket?.off("user_stopped_typing");
  }
}

// Throttled typing sender — emits typing_start on first call,
// extends a debounce timer, and emits typing_end when timer expires.
export function emitTyping(conversationId: string) {
  const key = `typing_${conversationId}`;
  const existing = typingTimeouts.get(key);
  if (!existing) {
    sendTypingStart(conversationId);
  }
  clearTimeout(existing);
  typingTimeouts.set(
    key,
    setTimeout(() => {
      sendTypingEnd(conversationId);
      typingTimeouts.delete(key);
    }, TYPING_TIMEOUT_MS)
  );
}

export function clearTyping(conversationId: string) {
  const key = `typing_${conversationId}`;
  const existing = typingTimeouts.get(key);
  if (existing) {
    clearTimeout(existing);
    typingTimeouts.delete(key);
    sendTypingEnd(conversationId);
  }
}

//
// REST helpers
//

export async function createConversation(
  itemId: string,
  sellerId: string
): Promise<{ _id: string }> {
  const res = await api.post(endpoints.chat.createConversation, {
    itemId,
    sellerId,
  });
  return res.data.data;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await api.get(endpoints.chat.conversations);
  return res.data.data;
}

export async function fetchMessages(
  conversationId: string,
  page = 1,
  limit = 50
): Promise<MessagesResponse> {
  const res = await api.get(
    endpoints.chat.conversationMessages(conversationId),
    { params: { page, limit } }
  );
  return res.data.data;
}

export async function markConversationRead(conversationId: string) {
  await api.patch(endpoints.chat.markRead(conversationId));
}

export async function deleteMessage(
  messageId: string,
  type: "forMe" | "forEveryone"
): Promise<any> {
  const res = await api.delete(endpoints.chat.deleteMessage(messageId), {
    data: { type },
  });
  return res.data.data;
}

export async function hideConversation(conversationId: string): Promise<any> {
  const res = await api.patch(endpoints.chat.hide(conversationId));
  return res.data.data;
}

export async function unhideConversation(conversationId: string): Promise<any> {
  const res = await api.patch(endpoints.chat.unhide(conversationId));
  return res.data.data;
}

export function onMessageDeleted(
  callback: (data: {
    messageId: string;
    conversationId: string;
    type: "forMe" | "forEveryone";
    content?: string;
  }) => void
) {
  if (!socket) return;
  
  messageDeletedListeners.add(callback);
  
  // Only set up socket listener if this is the first callback
  if (messageDeletedListeners.size === 1) {
    socket.off("messageDeleted").on("messageDeleted", (data) => {
      messageDeletedListeners.forEach(listener => listener(data));
    });
  }
}

export function offMessageDeleted(callback?: (data: { messageId: string; conversationId: string; type: "forMe" | "forEveryone"; content?: string }) => void) {
  if (callback) {
    messageDeletedListeners.delete(callback);
  } else {
    messageDeletedListeners.clear();
  }
  
  // Only remove socket listener if no callbacks remain
  if (messageDeletedListeners.size === 0) {
    socket?.off("messageDeleted");
  }
}
