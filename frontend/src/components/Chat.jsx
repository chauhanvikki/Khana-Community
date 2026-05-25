import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, User, Clock, Check, CheckCheck, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';
import { API_BASE_URL } from '../config';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const Chat = ({ isOpen, onClose, recipientId, recipientName, recipientRole, currentUserId, currentUserRole, recipientImage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { markAsRead, socket, isConnected } = useNotifications();
  
  // Robustly determine current user ID (prop or fallback to token)
  const cId = useMemo(() => {
    if (currentUserId) return currentUserId.toString();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.id?.toString();
      } catch (e) { return null; }
    }
    return null;
  }, [currentUserId]);

  const rId = recipientId?.toString();

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen || !socket) return;

    const handleMessage = (msg) => {
      const s = (msg.senderId?._id || msg.senderId)?.toString();
      const r = (msg.recipientId?._id || msg.recipientId)?.toString();
      
      if ((s === cId && r === rId) || (s === rId && r === cId)) {
        setMessages((prev) => {
          if (msg._id && prev.some(m => m._id === msg._id)) return prev;
          
          const optimisticIndex = prev.findIndex(m => !m._id && m.message === msg.message && m.senderId === s);
          if (optimisticIndex !== -1 && msg._id) {
            const next = [...prev];
            next[optimisticIndex] = msg;
            return next;
          }

          return [...prev, msg];
        });

        if (s === rId) {
          const token = localStorage.getItem('token');
          axios.patch(`${API_BASE_URL}/api/messages/read/${rId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(err => console.error("Auto-read failed:", err));
        }
      }
    };

    const handleTyping = ({ from }) => {
      if (from?.toString() === rId) setIsTyping(true);
    };

    const handleStopTyping = ({ from }) => {
      if (from?.toString() === rId) setIsTyping(false);
    };

    const handleRead = ({ by }) => {
      if (by?.toString() === rId) {
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
      }
    };

    socket.on('message', handleMessage);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);
    socket.on('messages_read', handleRead);

    return () => {
      socket.off('message', handleMessage);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
      socket.off('messages_read', handleRead);
    };
  }, [isOpen, socket, cId, rId]);


  useEffect(() => {
    if (isOpen && rId) {
      fetchMessages();
      markAsRead(rId);
    } else {
      setMessages([]); // Clear local state when chat closes
    }
  }, [isOpen, rId]);

  const fetchMessages = async () => {
    if (!rId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_BASE_URL}/api/messages/${rId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data || []);
      
      axios.patch(`${API_BASE_URL}/api/messages/read/${rId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Mark read error:", err));
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const emitTyping = () => {
    if (!socket || !rId) return;
    socket.emit('typing', { to: rId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { to: rId });
    }, 1500);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !rId) return;

    const msgContent = newMessage.trim();
    setNewMessage(''); 

    const optimisticMsg = {
      message: msgContent,
      senderId: cId,
      recipientId: rId,
      createdAt: new Date().toISOString(),
      sending: true
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/messages`,
        { recipientId: rId, message: msgContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => prev.filter(m => m !== optimisticMsg));
      setNewMessage(msgContent); 
      alert('Failed to send message');
    }
  };


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[650px] flex flex-col overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] p-5 flex items-center justify-between shadow-lg relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-white rounded-2xl overflow-hidden flex items-center justify-center border-2 border-white/20 shadow-lg">
                  {recipientImage ? (
                    <img src={recipientImage.startsWith('/uploads') ? `${API_BASE_URL}${recipientImage}` : recipientImage} alt={recipientName} className="w-14 h-14 object-cover" />
                  ) : (
                    <User size={28} className="text-[#4CAF50]" />
                  )}
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-white font-black text-xl tracking-tight leading-none mb-1">
                  {recipientName}
                </h3>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-wider">
                  <span className="px-2 py-0.5 rounded-full bg-black/10">{recipientRole}</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-white/40'}`} />
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={fetchMessages}
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all"
                title="Refresh history"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-xl transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC] custom-scrollbar">
            {loading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-12 h-12 border-4 border-[#4CAF50]/20 border-t-[#4CAF50] rounded-full animate-spin" />
                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">Restoring History...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-40">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle size={40} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-black uppercase tracking-widest">No messages yet</p>
                  <p className="text-sm font-medium">Be the first to say hello!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const sId = (msg.senderId?._id || msg.senderId)?.toString();
                const isMe = sId === cId;
                return (
                  <motion.div
                    key={msg._id || index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm relative ${
                        isMe
                          ? 'bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] text-white rounded-br-none'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                      <div className={`flex items-center gap-1.5 mt-1.5 text-[10px] font-bold ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                        <Clock size={10} />
                        <span>{formatTimeAgo(msg.createdAt)}</span>
                        {isMe && (
                          <span className="ml-1">
                            {msg.read ? (
                              <CheckCheck size={14} className="text-blue-200" />
                            ) : msg.sending ? (
                              <RefreshCw size={12} className="animate-spin opacity-50" />
                            ) : (
                              <Check size={14} className="opacity-70" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-wider ml-2"
              >
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                {recipientName} is typing...
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <form onSubmit={sendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); emitTyping(); }}
                  placeholder="Type your message here..."
                  disabled={loading && messages.length === 0}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-[#4CAF50]/30 focus:ring-4 focus:ring-[#4CAF50]/5 transition-all text-sm font-medium"
                />
              </div>
              <motion.button
                type="submit"
                disabled={!newMessage.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-3"
              >
                Send <Send size={18} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chat;
