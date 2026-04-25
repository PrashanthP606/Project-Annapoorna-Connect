// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import logo from '@/assets/logo.png';

// Define types locally
type User = {
  id: string;
  name?: string;
  email?: string;
  role?: 'donor' | 'receiver' | 'admin' | string;
};

type LoginResponse = {
  token: string;
  user: User;
};

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // New State for Forgot Password view
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    phone: '',
    address: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      // 1. HANDLE FORGOT PASSWORD
      if (isForgotPassword) {
        // Assuming your backend has this endpoint
        await api.post('/auth/forgot-password', { email: formData.email });
        
        setMessage({
          type: 'success',
          text: 'If an account exists with this email, a password reset link has been sent.'
        });
        return; // Stop execution here
      }

      // 2. HANDLE LOGIN
      if (isLogin) {
        const res = await api.post<LoginResponse>('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/');
      } 
      // 3. HANDLE REGISTER
      else {
        await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone,
          address: formData.address
        });
        
        setMessage({
          type: 'success',
          text: 'Registration successful! We have sent a verification link to your email.'
        });
        
        setIsLogin(true); 
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err: any) {
      let msg = 'Something went wrong';
      if (err?.response?.data?.message) msg = err.response.data.message;
      setMessage({ type: 'error', text: msg });
    }
  };

  // Helper to determine the title
  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    return isLogin ? 'Login' : 'Sign Up';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="h-16 w-16 rounded-full shadow-sm" />
          <h1 className="text-xl font-extrabold text-teal-700 mt-3">Annapoorna Connect</h1>
        </div>

        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">
          {getTitle()}
        </h2>

        {message && (
          <div className={`p-3 mb-4 text-sm rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* REGISTRATION FIELDS (Only show if NOT login AND NOT forgot password) */}
          {!isLogin && !isForgotPassword && (
            <>
              <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 rounded-md border" required />
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 rounded-md border" required>
                <option value="donor">Donor</option>
                <option value="receiver">Receiver</option>
              </select>
              <input 
                name="phone" 
                type="tel" 
                placeholder="----- -----" 
                value={formData.phone} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-md border" 
                maxLength={10} 
              />
              <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 rounded-md border" />
            </>
          )}

          {/* EMAIL FIELD (Always visible) */}
          <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 rounded-md border" required />

          {/* PASSWORD FIELD (Visible for Login and Signup, hidden for Forgot Password) */}
          {!isForgotPassword && (
            <div className="relative">
              <input 
                name="password" 
                placeholder="Password" 
                type={showPassword ? "text" : "password"} 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded-md border pr-10" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD LINK (Only visible in Login mode) */}
          {isLogin && !isForgotPassword && (
            <div className="text-right">
              <button 
                type="button"
                onClick={() => { setIsForgotPassword(true); setMessage(null); }}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700 transition">
            {isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {/* FOOTER LOGIC */}
          {isForgotPassword ? (
            <>
              Remembered your password?{' '}
              <button 
                onClick={() => { setIsForgotPassword(false); setIsLogin(true); setMessage(null); }} 
                className="text-teal-600 font-medium"
              >
                Back to Login
              </button>
            </>
          ) : isLogin ? (
            <>
              Don't have an account?{' '}
              <button 
                onClick={() => { setIsLogin(false); setMessage(null); }} 
                className="text-teal-600 font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => { setIsLogin(true); setMessage(null); }} 
                className="text-teal-600 font-medium"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;