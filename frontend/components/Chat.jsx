import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, User, Clock, Check, CheckCheck } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000';

const Chat = ({ isOpen, onClose, recipientId, recipientName, recipientRole, currentUserId, currentUserRole, recipientImage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize socket connection when chat opens
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    // Incoming real-time message
    socket.on('message', (msg) => {
      // Only append if it's between current pair
      const s = msg.senderId?._id || msg.senderId;
      const r = msg.recipientId?._id || msg.recipientId;
      if ((s === currentUserId && r === recipientId) || (s === recipientId && r === currentUserId)) {
        setMessages((prev) => [...prev, msg]);
        playBeep();
      }
    });

    // Typing events
    socket.on('typing', ({ from }) => {
      if (from === recipientId) setIsTyping(true);
    });
    socket.on('stop_typing', ({ from }) => {
      if (from === recipientId) setIsTyping(false);
    });

    // Optional global notifications
    socket.on('notification', () => {
      // playBeep();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, currentUserId, recipientId]);

  // Fetch history when chat opens or recipient changes
  useEffect(() => {
    if (isOpen && recipientId) {
      fetchMessages();
    }
  }, [isOpen, recipientId]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_BASE_URL}/api/messages/${recipientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const emitTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing', { to: recipientId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { to: recipientId });
    }, 1200);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      if (!recipientId) {
        throw new Error('Recipient ID is missing');
      }

      // Use REST to persist, socket will broadcast from server
      await axios.post(
        `${API_BASE_URL}/api/messages`,
        { recipientId, message: newMessage.trim() },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      setNewMessage('');
      // No need to refetch; real-time event will append
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send message';
      alert(`Failed to send message: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Simple notification beep using Web Audio (no asset needed)
  const audioCtx = useMemo(() => (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null), []);
  const playBeep = () => {
    try {
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.01);
      o.start();
      setTimeout(() => { g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2); o.stop(audioCtx.currentTime + 0.22); }, 180);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full overflow-hidden flex items-center justify-center">
                {recipientImage ? (
                  <img src={recipientImage} alt={recipientName} className="w-12 h-12 object-cover" />
                ) : (
                  <User size={24} className="text-[#4CAF50]" />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{recipientName}</h3>
                <p className="text-white/80 text-sm capitalize">{recipientRole}</p>
                {isTyping && (
                  <p className="text-xs text-white/90 animate-pulse">typing...</p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle size={64} className="mb-4 opacity-20" />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.senderId === currentUserId || msg.senderId?._id === currentUserId;
                return (
                  <motion.div
                    key={msg._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMe
                          ? 'bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white rounded-br-none'
                          : 'bg-white border-2 border-gray-200 text-gray-800 rounded-bl-none'
                      } shadow-md`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                        <Clock size={12} />
                        <span>
                          {msg.createdAt 
                            ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                        {isMe && (
                          <span className="ml-1">
                            {msg.read ? <CheckCheck size={14} /> : <Check size={14} />}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t-2 border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); emitTyping(); }}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={loading || !newMessage.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Send size={20} />
                {loading ? 'Sending...' : 'Send'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chat;
