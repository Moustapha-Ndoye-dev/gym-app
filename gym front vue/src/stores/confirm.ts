import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false);
  const options = ref<ConfirmOptions | null>(null);
  const isProcessing = ref(false);

  const confirm = (opts: ConfirmOptions) => {
    options.value = {
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      variant: 'danger',
      ...opts
    };
    isOpen.value = true;
  };

  const handleConfirm = async () => {
    if (!options.value) return;
    isProcessing.value = true;
    try {
      await options.value.onConfirm();
    } finally {
      isProcessing.value = false;
      isOpen.value = false;
      setTimeout(() => {
        options.value = null;
      }, 200);
    }
  };

  const handleCancel = () => {
    if (options.value?.onCancel) {
      options.value.onCancel();
    }
    isOpen.value = false;
    setTimeout(() => {
      options.value = null;
    }, 200);
  };

  return { isOpen, options, isProcessing, confirm, handleConfirm, handleCancel };
})
