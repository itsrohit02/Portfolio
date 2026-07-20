import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Server Error');
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage('Sending email...');
    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Reset link sent to your email!');
        setError('');
      } else {
        setError(data.message);
        setMessage('');
      }
    } catch {
      setError('Server Error');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141a33]/80 border border-[rgba(241,234,224,0.1)] p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#f1eae0] mb-2">Command<span className="text-[#38bdf8]">Center</span></h1>
          <p className="text-[#5c6288] font-mono text-sm uppercase tracking-widest">
            {isForgotMode ? 'Password Recovery' : 'Restricted Access'}
          </p>
        </div>

        {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm text-center">{error}</div>}
        {message && <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-sm text-center">{message}</div>}

        {!isForgotMode ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input 
              type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required
              className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]"
            />
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.2.07.43 0 .63C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" className="mt-2 bg-[#38bdf8] text-[#0a0d1a] font-bold py-3 rounded hover:bg-[#7dd3fc] transition-colors">
              Access Dashboard
            </button>
            <button type="button" onClick={() => {setIsForgotMode(true); setError(''); setMessage('');}} className="text-[#5c6288] text-sm hover:text-[#38bdf8] transition-colors mt-2">
              Forgot Password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="flex flex-col gap-5">
            <p className="text-[#9aa0c0] text-sm text-center mb-2">Enter your username and the email address where the reset link should be sent.</p>
            <input 
              type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required
              className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]"
            />
            <input 
              type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required
              className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]"
            />
            <button type="submit" className="mt-2 bg-[#e8a33d] text-[#0a0d1a] font-bold py-3 rounded hover:bg-[#fcd34d] transition-colors">
              Send Reset Link
            </button>
            <button type="button" onClick={() => {setIsForgotMode(false); setError(''); setMessage('');}} className="text-[#5c6288] text-sm hover:text-[#38bdf8] transition-colors mt-2">
              Back to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
}