/**
 * Chat Service
 * Handles real-time messaging between users
 * Manages chat rooms, messages, and file sharing
 */

import { create } from 'zustand';
import useWebSocketStore from './websocketService';
import authService from './authService';

const MESSAGE_LIMIT = parseInt(import.meta.env.VITE_CHAT_MESSAGE_LIMIT) || 50;
const FILE_SIZE_LIMIT = parseInt(import.meta.env.VITE_CHAT_FILE_SIZE_LIMIT) || 5242880; // 5MB
const ALLOWED_FILE_TYPES = (import.meta.env.VITE_CHAT_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,application/pdf').split(',');

// Chat store for managing chat state
const useChatStore = create((set, get) => ({
  activeChat: null,
  chats: [],
  messages: new Map(), // Map of chatId to messages
  onlineUsers: new Set(),
  typingUsers: new Map(), // Map of chatId to Set of typing users

  // Initialize chat service
  initialize: () => {
    const ws = useWebSocketStore.getState();
    
    // Subscribe to chat-related WebSocket events
    ws.subscribe('chat_message', get().handleNewMessage);
    ws.subscribe('user_online', get().handleUserOnline);
    ws.subscribe('user_offline', get().handleUserOffline);
    ws.subscribe('typing', get().handleTyping);
    ws.subscribe('read_receipt', get().handleReadReceipt);

    // Fetch initial chat list
    get().fetchChats();
  },

  // Fetch user's chat list
  fetchChats: async () => {
    try {
      const response = await fetch('/api/chats');
      const data = await response.json();
      set({ chats: data });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },

  // Set active chat
  setActiveChat: async (chatId) => {
    set({ activeChat: chatId });
    if (!get().messages.has(chatId)) {
      await get().fetchMessages(chatId);
    }
  },

  // Fetch messages for a chat
  fetchMessages: async (chatId) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const data = await response.json();
      set(state => ({
        messages: new Map(state.messages).set(chatId, data)
      }));
    } catch (error) {
      console.error(`Error fetching messages for chat ${chatId}:`, error);
    }
  },

  // Send a text message
  sendMessage: async (chatId, content) => {
    const ws = useWebSocketStore.getState();
    const message = {
      type: 'chat_message',
      data: {
        chatId,
        content,
        timestamp: new Date().toISOString(),
        sender: authService.getCurrentUser().id
      }
    };

    ws.sendMessage(message);
  },

  // Handle new message from WebSocket
  handleNewMessage: (message) => {
    const { chatId, content, timestamp, sender } = message;
    set(state => {
      const currentMessages = state.messages.get(chatId) || [];
      const newMessages = [...currentMessages, { content, timestamp, sender }]
        .slice(-MESSAGE_LIMIT);
      
      return {
        messages: new Map(state.messages).set(chatId, newMessages)
      };
    });
  },

  // Send file message
  sendFile: async (chatId, file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('File type not allowed');
    }

    if (file.size > FILE_SIZE_LIMIT) {
      throw new Error('File size exceeds limit');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);

    try {
      const response = await fetch('/api/chats/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      const ws = useWebSocketStore.getState();
      ws.sendMessage({
        type: 'chat_message',
        data: {
          chatId,
          content: data.fileUrl,
          type: 'file',
          fileName: file.name,
          timestamp: new Date().toISOString(),
          sender: authService.getCurrentUser().id
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Handle user online status
  handleUserOnline: (userId) => {
    set(state => ({
      onlineUsers: new Set([...state.onlineUsers, userId])
    }));
  },

  // Handle user offline status
  handleUserOffline: (userId) => {
    set(state => {
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.delete(userId);
      return { onlineUsers: newOnlineUsers };
    });
  },

  // Send typing indicator
  sendTyping: (chatId) => {
    const ws = useWebSocketStore.getState();
    ws.sendMessage({
      type: 'typing',
      data: { chatId, userId: authService.getCurrentUser().id }
    });
  },

  // Handle typing indicator
  handleTyping: (data) => {
    const { chatId, userId } = data;
    set(state => {
      const typingUsers = new Map(state.typingUsers);
      const chatTypingUsers = new Set(typingUsers.get(chatId) || []);
      chatTypingUsers.add(userId);
      typingUsers.set(chatId, chatTypingUsers);
      return { typingUsers };
    });

    // Clear typing indicator after 3 seconds
    setTimeout(() => {
      set(state => {
        const typingUsers = new Map(state.typingUsers);
        const chatTypingUsers = new Set(typingUsers.get(chatId) || []);
        chatTypingUsers.delete(userId);
        typingUsers.set(chatId, chatTypingUsers);
        return { typingUsers };
      });
    }, 3000);
  },

  // Send read receipt
  sendReadReceipt: (chatId, messageId) => {
    const ws = useWebSocketStore.getState();
    ws.sendMessage({
      type: 'read_receipt',
      data: {
        chatId,
        messageId,
        userId: authService.getCurrentUser().id
      }
    });
  },

  // Handle read receipt
  handleReadReceipt: (data) => {
    const { chatId, messageId, userId } = data;
    set(state => {
      const messages = new Map(state.messages);
      const chatMessages = messages.get(chatId) || [];
      const updatedMessages = chatMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, readBy: [...(msg.readBy || []), userId] }
          : msg
      );
      messages.set(chatId, updatedMessages);
      return { messages };
    });
  },

  // Create new chat
  createChat: async (participants) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participants })
      });
      const data = await response.json();
      set(state => ({
        chats: [...state.chats, data]
      }));
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  // Leave chat
  leaveChat: async (chatId) => {
    try {
      await fetch(`/api/chats/${chatId}/leave`, { method: 'POST' });
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        messages: new Map([...state.messages].filter(([id]) => id !== chatId))
      }));
    } catch (error) {
      console.error(`Error leaving chat ${chatId}:`, error);
      throw error;
    }
  }
}));

export default useChatStore; 