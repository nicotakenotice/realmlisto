import type { Toast } from '$lib/models/Toast';
import { writable } from 'svelte/store';

export const toasts = writable<Toast[]>([]);

export const addToast = (toast: Toast) => {
  // Push the toast to the top of the list
  toasts.update((all) => [toast, ...all]);

  // If toast is dismissible, dismiss it after "timeout" amount of time
  if (toast.timeout) 
    setTimeout(() => dismissToast(toast.id), toast.timeout);
};

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
