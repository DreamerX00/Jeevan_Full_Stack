/**
 * WebSocket Service
 * Handles real-time communication between client and server
 * Manages connection, reconnection, and message handling
 */

import { create } from 'zustand';
import authService from './authService';

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
const MAX_RECONNECT_ATTEMPTS = parseInt(import.meta.env.VITE_WEBSOCKET_RECONNECT_ATTEMPTS) || 5;
const RECONNECT_INTERVAL = parseInt(import.meta.env.VITE_WEBSOCKET_RECONNECT_INTERVAL) || 3000;

// WebSocket store for managing connection state
const useWebSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  reconnectAttempts: 0,
  messageQueue: [],
  listeners: new Map(),

  // Initialize WebSocket connection
  initialize: () => {
    const { socket, isConnected } = get();
    if (socket && isConnected) return;

    const token = authService.getToken();
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      set({ 
        socket: ws, 
        isConnected: true, 
        reconnectAttempts: 0 
      });
      // Process any queued messages
      get().processMessageQueue();
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      set({ isConnected: false });
      get().handleReconnect();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        get().handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  },

  // Handle reconnection attempts
  handleReconnect: () => {
    const { reconnectAttempts } = get();
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        set({ reconnectAttempts: reconnectAttempts + 1 });
        get().initialize();
      }, RECONNECT_INTERVAL);
    }
  },

  // Send message through WebSocket
  sendMessage: (message) => {
    const { socket, isConnected } = get();
    if (!isConnected) {
      // Queue message if not connected
      set(state => ({
        messageQueue: [...state.messageQueue, message]
      }));
      return;
    }

    try {
      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  },

  // Process queued messages
  processMessageQueue: () => {
    const { messageQueue, socket } = get();
    if (!socket || messageQueue.length === 0) return;

    messageQueue.forEach(message => {
      try {
        socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error processing queued message:', error);
      }
    });

    set({ messageQueue: [] });
  },

  // Handle incoming messages
  handleMessage: (message) => {
    const { listeners } = get();
    const { type, data } = message;

    // Notify all listeners for this message type
    if (listeners.has(type)) {
      listeners.get(type).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in message listener for type ${type}:`, error);
        }
      });
    }
  },

  // Subscribe to specific message types
  subscribe: (type, callback) => {
    const { listeners } = get();
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    listeners.get(type).add(callback);

    // Return unsubscribe function
    return () => {
      const typeListeners = listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    };
  },

  // Close WebSocket connection
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ 
        socket: null, 
        isConnected: false, 
        messageQueue: [] 
      });
    }
  }
}));

export default useWebSocketStore; 