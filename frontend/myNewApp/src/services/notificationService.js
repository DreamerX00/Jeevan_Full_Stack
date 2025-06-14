/**
 * Notification Service
 * Handles both push notifications and in-app notifications
 * Manages notification permissions, display, and storage
 */

import { create } from 'zustand';
import useWebSocketStore from './websocketService';

const POLL_INTERVAL = parseInt(import.meta.env.VITE_NOTIFICATION_POLL_INTERVAL) || 30000;
const MAX_DISPLAY = parseInt(import.meta.env.VITE_NOTIFICATION_MAX_DISPLAY) || 5;
const AUTO_HIDE_DELAY = parseInt(import.meta.env.VITE_NOTIFICATION_AUTO_HIDE_DELAY) || 5000;

// Notification store for managing notification state
const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  permission: 'default',
  isSubscribed: false,
  subscription: null,

  // Initialize notification service
  initialize: async () => {
    const { checkPermission, initializePushNotifications } = get();
    await checkPermission();
    if (import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true') {
      await initializePushNotifications();
    }
    get().startPolling();
  },

  // Check notification permission
  checkPermission: async () => {
    if (!('Notification' in window)) {
      set({ permission: 'unsupported' });
      return;
    }

    const permission = await Notification.permission;
    set({ permission });

    if (permission === 'default') {
      const newPermission = await Notification.requestPermission();
      set({ permission: newPermission });
    }
  },

  // Initialize push notifications
  initializePushNotifications: async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        set({ subscription, isSubscribed: true });
      } else {
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_PUSH_NOTIFICATION_PUBLIC_KEY
        });
        set({ subscription: newSubscription, isSubscribed: true });
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  },

  // Start polling for new notifications
  startPolling: () => {
    const pollInterval = setInterval(() => {
      get().fetchNotifications();
    }, POLL_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(pollInterval);
  },

  // Fetch notifications from server
  fetchNotifications: async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      set({ 
        notifications: data.notifications,
        unreadCount: data.unreadCount
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  // Add new notification
  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications].slice(0, MAX_DISPLAY),
      unreadCount: state.unreadCount + 1
    }));

    // Auto-hide notification after delay
    setTimeout(() => {
      get().removeNotification(notification.id);
    }, AUTO_HIDE_DELAY);
  },

  // Remove notification
  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  // Clear all notifications
  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));

// Subscribe to WebSocket notifications
if (import.meta.env.VITE_ENABLE_REALTIME_CHAT === 'true') {
  const ws = useWebSocketStore.getState();
  ws.subscribe('notification', (data) => {
    useNotificationStore.getState().addNotification(data);
  });
}

export default useNotificationStore; 