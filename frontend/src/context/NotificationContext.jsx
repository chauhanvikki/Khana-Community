import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, RefreshCw, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [toastNotifications, setToastNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isConnected, setIsConnected] = useState(false);
  
  // Persistent activity history
  const [activityHistory, setActivityHistory] = useState(() => {
    const saved = localStorage.getItem('activity_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('activity_history', JSON.stringify(activityHistory));
  }, [activityHistory]);

  // Sync token from localStorage
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };
    const interval = setInterval(checkToken, 1500);
    window.addEventListener('storage', checkToken);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkToken);
    };
  }, [token]);

  const addActivity = useCallback((data) => {
    const newActivity = {
      id: Date.now(),
      type: data.type || 'info',
      title: data.title || 'New Notification',
      message: data.message,
      time: new Date().toISOString(),
      read: false,
      senderName: data.senderName,
      senderRole: data.senderRole
    };
    setActivityHistory(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50
    return newActivity;
  }, []);

  const markActivityAsRead = useCallback(() => {
    setActivityHistory(prev => prev.map(a => ({ ...a, read: true })));
  }, []);

  const clearHistory = useCallback(() => {
    setActivityHistory([]);
  }, []);

  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
      o.start();
      setTimeout(() => { 
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2); 
        o.stop(audioCtx.currentTime + 0.22); 
        audioCtx.close();
      }, 180);
    } catch (err) {
      console.warn('Audio play failed:', err);
    }
  }, []);

  const markAsRead = useCallback((senderId) => {
    setUnreadCounts(prev => {
      const next = { ...prev };
      delete next[senderId];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setIsConnected(false);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(API_BASE_URL, {
      path: "/socket.io/",
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ["polling", "websocket"],
      timeout: 20000,
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection Error:', err.message);
      
      // If token is expired or invalid, clear it and stop retrying
      if (err.message.includes('jwt expired') || err.message.includes('invalid signature') || err.message.includes('jwt malformed')) {
        console.warn('[Socket] Token is invalid/expired. Clearing session — please log in again.');
        localStorage.removeItem('token');
        setToken(null);
        newSocket.disconnect();
        return;
      }
      
      if (err.message === "xhr poll error") {
        console.warn('[Socket] Server might be down or unreachable');
      }
    });

    const handleNotification = (data) => {
      // 1. Update Unread Chat Counts (Always do this for messages)
      if (data.type === 'message') {
        setUnreadCounts(prev => ({ ...prev, [data.from]: (prev[data.from] || 0) + 1 }));
      }

      // 2. Decide if this should go into the Activity Feed (Bell) and show a Toast
      // We ONLY show Activity for: Info/Success/Warning/Admin Messages
      // We IGNORE: Personal chat messages (unless from Admin)
      const isPersonalMessage = data.type === 'message' && data.senderRole !== 'admin';
      
      if (isPersonalMessage) {
        // Do nothing for personal messages (they are handled by the Chat component)
        return;
      }

      // Play sound for relevant activity
      playBeep();
      
      // Add to persistent activity feed
      const activity = addActivity({
        type: data.type || 'info',
        title: data.title || (data.type === 'message' ? `Admin Message` : 'Update'),
        message: data.message,
        senderName: data.senderName,
        senderRole: data.senderRole
      });

      // Show temporary toast
      const toastId = activity.id;
      setToastNotifications((prev) => [...prev, {
        ...activity,
        id: toastId,
        title: activity.title,
        subtitle: data.senderRole ? `(${data.senderRole})` : ''
      }]);
      setTimeout(() => setToastNotifications((prev) => prev.filter((n) => n.id !== toastId)), 6000);
    };

    newSocket.on('connect', () => {
      setIsConnected(true);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('notification', handleNotification);

    return () => {
      newSocket.off('notification', handleNotification);
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, playBeep, addActivity]);

  return (
    <NotificationContext.Provider value={{ 
      unreadCounts, 
      markAsRead, 
      socket, 
      isConnected, 
      activityHistory, 
      markActivityAsRead,
      clearHistory 
    }}>
      {children}
      
      {/* Global Toast & Connection Alert */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {token && !isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium"
            >
              <RefreshCw size={16} className="animate-spin" />
              Connection lost. Reconnecting...
            </motion.div>
          )}

          {toastNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto bg-white rounded-2xl shadow-2xl border-l-4 border-blue-500 p-4 min-w-[300px] max-w-[400px] flex gap-4 items-start relative overflow-hidden group cursor-pointer"
              onClick={() => setToastNotifications(prev => prev.filter(n => n.id !== notif.id))}
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                {notif.type === 'message' ? <MessageCircle size={20} /> : <Bell size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900 text-sm">
                    {notif.title} <span className="text-blue-500 font-medium text-xs ml-1">{notif.subtitle}</span>
                  </h4>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setToastNotifications(prev => prev.filter(n => n.id !== notif.id)); }} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
