// frontend/src/hooks/useNotifications.js
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axiosClient";

/**
 * useNotifications
 * - polls /api/notifications/ periodically (default 10s)
 * - exposes notifications array, unreadCount, refresh(), markRead(id)
 */
export default function useNotifications({ intervalMs = 10000 } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("notifications/");
      // API returns array or paginated {results: []}
      const data = res.data.results ?? res.data;
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err);
      // keep existing notifications on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // set up polling
    timerRef.current = setInterval(() => {
      fetchNotifications();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNotifications, intervalMs]);

  const refresh = useCallback(() => fetchNotifications(), [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback(
    async (id) => {
      try {
        await api.post(`notifications/${id}/mark_read/`);
        // Optimistically update local state
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    },
    [setNotifications]
  );

  const markAllRead = useCallback(async () => {
    // mark unread ones locally and attempt backend calls (fire-and-forget)
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(
        unread.map((n) => api.post(`notifications/${n.id}/mark_read/`).catch((e) => console.error(e)))
      );
    } catch (e) {
      // already handled per-item
    }
  }, [notifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    refresh,
    markRead,
    markAllRead,
  };
}
