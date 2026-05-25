import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function GoogleLoginButton({ onAuthInitiated, role, disabled }) {
  const handleSuccess = async (credentialResponse) => {
    if (disabled) return;
    console.log('Attempting login with API:', API_BASE_URL);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
        token: credentialResponse.credential,
        role: role
      });

      if (response.data.email) {
        onAuthInitiated(response.data.email, response.data.tempData);
      }
    } catch (err) {
      console.error('Google Auth Failed:', err);
      alert(err.response?.data?.message || 'Google Login failed');
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      className="w-full flex justify-center"
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
        useOneTap
        auto_select={false}
        theme="filled_blue"
        shape="pill"
        text="continue_with"
      />
    </motion.div>
  );
}
