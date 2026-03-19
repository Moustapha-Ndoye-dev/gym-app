<template>
  <div
    :class="cn(
      'pointer-events-auto flex items-start gap-3 p-3 rounded-xl shadow-lg border',
      backgrounds[notification.type]
    )"
  >
    <div class="shrink-0 mt-0.5">
      <component :is="icons[notification.type]" class="h-5 w-5" :class="iconColors[notification.type]" />
    </div>
    <div class="flex-1 text-[13px] font-bold text-slate-800 leading-snug">
      {{ notification.message }}
    </div>
    <button 
      @click="$emit('close')"
      class="shrink-0 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1 hover:bg-slate-200/50"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-vue-next';
import { cn } from '../lib/utils';
import type { Notification } from '../stores/notification';

defineProps<{
  notification: Notification;
}>();

defineEmits(['close']);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const iconColors = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500'
};

const backgrounds = {
  success: 'bg-emerald-50 border-emerald-100',
  error: 'bg-red-50 border-red-100',
  warning: 'bg-amber-50 border-amber-100',
  info: 'bg-blue-50 border-blue-100'
};
</script>
