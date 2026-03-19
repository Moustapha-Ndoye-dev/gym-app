<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0">
    <transition-group 
      name="notification"
      tag="div"
      class="flex flex-col gap-2"
    >
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="pointer-events-auto"
      >
        <NotificationItem 
          :notification="notification" 
          @close="notificationStore.removeNotification(notification.id)" 
        />
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../stores/notification';
import NotificationItem from './NotificationItem.vue';

const notificationStore = useNotificationStore();
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.notification-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
