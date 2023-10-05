import type { Toast } from '$lib/models/Toast';
import { writable } from 'svelte/store';

const TOASTS_DISPLAYED: number = 3;

export const toasts = writable<Toast[]>([]);

export const addToast = (toast: Toast) => {
  toasts.update((all) => all.length > TOASTS_DISPLAYED 
    ? [toast, ...all.slice(0, TOASTS_DISPLAYED)]
    : [toast, ...all]);

  setTimeout(() => dismissToast(toast.id), toast.duration);
};

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
