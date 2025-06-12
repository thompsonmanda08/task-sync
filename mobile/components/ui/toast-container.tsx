import React from 'react';
import { View, StyleSheet } from 'react-native';
import { create } from 'zustand';

import Toast, { ToastType } from './toast';

type ToastProps = {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastState = {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
};

type NotifyOptions = {
  title: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).substring(2, 9) },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const notify = ({
  title,
  message,
  type = 'info',
  duration = 5000,
}: NotifyOptions) => {
  useToastStore.getState().addToast({ title, message, type, duration });
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={removeToast} />
      ))}
    </View>
  );
}
