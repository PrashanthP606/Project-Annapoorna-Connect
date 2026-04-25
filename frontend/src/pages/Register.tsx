import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api'; 
import logo from '@/assets/logo.png';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<{ type: 'success'|'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setMessage({ type: 'error', text: "Passwords don't match" });

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting...' });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="h-16 w-16 rounded-full" />
          <h1 className="text-xl font-bold text-teal-700 mt-3">Reset Password</h1>
        </div>
        {message && <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full p-2 border rounded" required />
          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded font-bold hover:bg-teal-700">Set New Password</button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;