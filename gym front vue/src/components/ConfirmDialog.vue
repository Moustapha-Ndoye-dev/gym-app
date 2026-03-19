<template>
  <transition name="fade">
    <div v-if="confirmStore.isOpen && confirmStore.options" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        @click="confirmStore.handleCancel"
      />
      
      <transition name="zoom">
        <div
          v-if="confirmStore.isOpen"
          class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100"
        >
          <button 
            @click="confirmStore.handleCancel"
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X class="h-5 w-5" />
          </button>

          <div class="flex flex-col items-center text-center">
            <div :class="cn('w-12 h-12 rounded-full flex items-center justify-center mb-4', 
              confirmStore.options.variant === 'danger' ? 'bg-red-50 text-red-500' :
              confirmStore.options.variant === 'warning' ? 'bg-amber-50 text-amber-500' :
              'bg-indigo-50 text-indigo-500'
            )">
              <AlertTriangle class="h-6 w-6" />
            </div>
            
            <h3 class="text-lg font-extrabold text-slate-900 mb-2">{{ confirmStore.options.title }}</h3>
            <p class="text-[13px] font-medium text-slate-500 mb-6">{{ confirmStore.options.message }}</p>
            
            <div class="flex gap-3 w-full">
              <button 
                @click="confirmStore.handleCancel" 
                :disabled="confirmStore.isProcessing"
                class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {{ confirmStore.options.cancelText }}
              </button>
              <button 
                @click="confirmStore.handleConfirm"
                :disabled="confirmStore.isProcessing"
                :class="cn('flex-1 font-bold text-[13px] py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center',
                  confirmStore.options.variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' :
                  confirmStore.options.variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200' :
                  'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                )"
              >
                {{ confirmStore.isProcessing ? 'En cours...' : confirmStore.options.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next';
import { useConfirmStore } from '../stores/confirm';
import { cn } from '../lib/utils';

const confirmStore = useConfirmStore();
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.zoom-enter-active, .zoom-leave-active {
  transition: all 0.3s ease;
}
.zoom-enter-from, .zoom-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
