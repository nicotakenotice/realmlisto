import type { Toast } from '$lib/models/Toast';
import { writable } from 'svelte/store';

export const toasts = writable<Toast[]>([]);

export const addToast = (toast: Toast) => {
  toasts.update((all) => [toast, ...all]);
  setTimeout(() => dismissToast(toast.id), toast.duration);
};

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
