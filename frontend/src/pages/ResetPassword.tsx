import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api'; 
import logo from '@/assets/logo.png'; // Ensure you have a logo or remove this line

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match" });
      return;
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          {/* <img src={logo} alt="logo" className="h-16 w-16 rounded-full shadow-sm" /> */}
          <h1 className="text-xl font-extrabold text-teal-700 mt-3">Reset Password</h1>
        </div>

        {message && (
          <div className={`p-3 mb-4 text-sm rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-3 py-2 rounded-md border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-3 py-2 rounded-md border"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;