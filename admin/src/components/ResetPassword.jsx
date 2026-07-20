import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // This grabs the specific token from the URL automatically
  const { token } = useParams(); 
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match!' });
    }

    setStatus({ type: 'loading', message: 'Resetting password...' });

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Password reset successful! Redirecting to login...' });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus({ type: 'error', message: data.message || 'Reset failed.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Server error.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141a33]/80 border border-[rgba(241,234,224,0.1)] p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-[#38bdf8] mb-2">Reset Password</h1>
          <p className="text-[#5c6288] text-sm">Enter your new master password.</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-3 rounded text-sm text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6"
              className="w-full bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6288] hover:text-[#38bdf8]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.5 12c1.573 3.5 4.9 6 10.5 6 1.74 0 3.37-.42 4.77-1.15M6.228 6.228A10.45 10.45 0 0112 5c5.6 0 9.027 2.5 10.5 6a10.47 10.47 0 01-4.302 5.184M9.878 9.878a3 3 0 104.243 4.243M9.878 9.878L14.122 14.122" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 9.027 3.007 9.963 7.178.07.2.07.43 0 .63C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="relative">
            <input 
              type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6"
              className="w-full bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6288] hover:text-[#38bdf8]"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.5 12c1.573 3.5 4.9 6 10.5 6 1.74 0 3.37-.42 4.77-1.15M6.228 6.228A10.45 10.45 0 0112 5c5.6 0 9.027 2.5 10.5 6a10.47 10.47 0 01-4.302 5.184M9.878 9.878a3 3 0 104.243 4.243M9.878 9.878L14.122 14.122" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 9.027 3.007 9.963 7.178.07.2.07.43 0 .63C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <button type="submit" className="mt-2 bg-[#38bdf8] text-[#0a0d1a] font-bold py-3 rounded hover:bg-[#7dd3fc] transition-colors">
            Confirm Reset
          </button>
        </form>

      </div>
    </div>
  );
}