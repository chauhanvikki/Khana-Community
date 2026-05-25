import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, MessageCircle, CheckCircle, Info, Trash2, Clock } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activityHistory, markActivityAsRead, clearHistory } = useNotifications();
  
  const unreadCount = activityHistory.filter(a => !a.read).length;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) markActivityAsRead();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={18} className="text-blue-500" /> Activity Feed
                </h3>
                <button 
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Clear all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {activityHistory.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <Bell size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  activityHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors ${!item.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === 'message' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {item.type === 'message' ? <MessageCircle size={20} /> : <CheckCircle size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                            <Clock size={10} /> {formatTime(item.time)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-3 text-center border-t border-gray-100">
                <button className="text-xs text-blue-600 font-bold hover:underline">View All Notifications</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
