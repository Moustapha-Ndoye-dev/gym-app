import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = { id, type, message, duration };
    
    notifications.value.push(newNotification);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  };

  return { notifications, showNotification, removeNotification };
})
