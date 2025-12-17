import { useEffect } from 'react';
import { notificationService } from '../services/notification.service';
import { useAppStore } from '../store';

export function useNotifications() {
    const setNotifications = useAppStore((state) => state.setNotifications);

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await notificationService.getUnread();
            if (response.success && response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    return { fetchNotifications };
}
