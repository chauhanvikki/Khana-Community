import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function OTPModal({ isOpen, onClose, email, googleData, onVerifySuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email,
        otp: otpString,
        googleData
      });

      if (response.data.token) {
        onVerifySuccess(response.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setResending(true);
    setError('');
    
    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, {
        email
      });
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      alert('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <ShieldCheck size={28} />
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <X size={24} />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h2>
            <p className="text-gray-600 mb-8">
              We've sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. 
              Please enter it below to continue.
            </p>

            <div className="flex justify-between gap-2 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-800 focus:border-orange-500 focus:outline-none transition-all"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mb-4 text-center font-medium"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-orange-300 transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verify & Continue'}
              {!loading && <ArrowRight size={20} />}
            </button>

            <p className="text-center mt-6 text-gray-500 text-sm">
              {canResend ? (
                <>
                  Didn't receive the code?{" "}
                  <button 
                    onClick={handleResend}
                    disabled={resending}
                    className="text-orange-600 font-bold hover:underline disabled:opacity-50"
                  >
                    {resending ? "Resending..." : "Resend OTP"}
                  </button>
                </>
              ) : (
                <>
                  Resend code in <span className="font-bold text-orange-600">{timer}s</span>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
