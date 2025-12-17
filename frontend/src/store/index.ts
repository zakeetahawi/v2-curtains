import { create } from 'zustand';
import type { User, Notification } from '../types';

interface AppState {
    user: User | null;
    notifications: Notification[];
    unreadCount: number;
    setUser: (user: User | null) => void;
    setNotifications: (notifications: Notification[]) => void;
    markAsRead: (id: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
    user: null,
    notifications: [],
    unreadCount: 0,

    setUser: (user) => set({ user }),

    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.IsRead).length,
        }),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) => (n.ID === id ? { ...n, IsRead: true } : n)),
            unreadCount: state.unreadCount - 1,
        })),
}));
