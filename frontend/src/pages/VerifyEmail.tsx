import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        // Call your backend endpoint to verify the token
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        // Optional: Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Verifying...</h2>
            <p className="text-gray-500 mt-2">Please wait while we verify your email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Email Verified!</h2>
            <p className="text-gray-500 mt-2">Your account is now active.</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-red-500 mt-2">{message}</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-6 border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50 transition"
            >
              Back to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;