import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

function NotificationItem({ notification, onMarkRead }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '📍';
      case 'share':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-blue-50 border-blue-200';
      case 'follow':
        return 'bg-green-50 border-green-200';
      case 'mention':
        return 'bg-purple-50 border-purple-200';
      case 'share':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${
      notification.read 
        ? 'bg-white border-gray-200' 
        : `${getNotificationColor(notification.type)} border-l-4 border-l-blue-500`
    } hover:shadow-md`}>
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
          notification.read ? 'bg-gray-100' : 'bg-blue-100'
        }`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-900 font-medium">{notification.text}</p>
              {notification.context && (
                <p className="text-sm text-gray-600 mt-1">{notification.context}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(notification.created_at)}
              </span>
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-200"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
          
          {notification.actionUrl && (
            <div className="mt-3">
              <button className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200">
                View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("notifications/").catch(() => null);
      if (res && res.data) {
        setNotifications(res.data.results ?? res.data);
      } else {
        // Mock data
        setNotifications([
          {
            id: 1,
            type: 'like',
            text: 'Alice liked your post',
            context: '"Great content! Keep it up!"',
            created_at: new Date(Date.now() - 5 * 60000).toISOString(),
            read: false,
            actionUrl: '/post/123'
          },
          {
            id: 2,
            type: 'comment',
            text: 'Bob commented on your photo',
            context: '"This looks amazing! Where was this taken?"',
            created_at: new Date(Date.now() - 30 * 60000).toISOString(),
            read: false,
            actionUrl: '/post/456'
          },
          {
            id: 3,
            type: 'follow',
            text: 'Charlie started following you',
            context: '',
            created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
            read: true,
            actionUrl: '/profile/charlie'
          },
          {
            id: 4,
            type: 'mention',
            text: 'You were mentioned in a post',
            context: 'David mentioned you in "Team lunch today!"',
            created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
            read: true,
            actionUrl: '/post/789'
          },
          {
            id: 5,
            type: 'share',
            text: 'Eva shared your post',
            context: 'Your post has been shared 15 times',
            created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
            read: true,
            actionUrl: '/post/101'
          }
        ]);
      }
    } catch (err) {
      console.error("notifications fetch", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.post(`notifications/${id}/mark-read/`).catch(() => null);
      setNotifications(prev => prev.map(x => x.id === id ? { ...x, read: true } : x));
    } catch (err) {
      console.error("mark read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post("notifications/mark-all-read/").catch(() => null);
      setNotifications(prev => prev.map(x => ({ ...x, read: true })));
    } catch (err) {
      console.error("mark all read", err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'
              }
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading notifications...</p>
          </div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔔</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            {filter === 'unread' 
              ? "You're all caught up! New notifications will appear here."
              : "When you get notifications, they'll show up here."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}