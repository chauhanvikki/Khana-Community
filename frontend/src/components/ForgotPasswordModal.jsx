import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, KeyRound, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        otp: otpString,
        newPassword
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
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
                {step === 3 ? <CheckCircle2 size={28} /> : <KeyRound size={28} />}
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <X size={24} />
              </button>
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                <p className="text-gray-600 mb-8">Enter your email and we'll send you a 6-digit code to reset your password.</p>
                <form onSubmit={handleSendCode}>
                  <div className="relative mb-6">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Code'}
                    {!loading && <ArrowRight size={20} />}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">We've sent a code to <span className="font-semibold text-gray-900">{email}</span></p>
                
                <div className="flex justify-between gap-2 mb-6">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-14 border-2 border-gray-100 rounded-xl text-center text-2xl font-bold text-gray-800 focus:border-orange-500 focus:outline-none"
                      value={data}
                      onChange={e => handleOTPChange(e.target, index)}
                    />
                  ))}
                </div>

                <div className="relative mb-6">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="New Password (min 6 chars)"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
                </button>

                <p className="text-center mt-6 text-gray-500 text-sm">
                  {canResend ? (
                    <button onClick={handleSendCode} className="text-orange-600 font-bold hover:underline">Resend Code</button>
                  ) : (
                    <>Resend in <span className="font-bold text-orange-600">{timer}s</span></>
                  )}
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                <p className="text-gray-600 mb-8">Your password has been reset successfully. You can now login with your new password.</p>
                <button
                  onClick={onClose}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition"
                >
                  Back to Login
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
