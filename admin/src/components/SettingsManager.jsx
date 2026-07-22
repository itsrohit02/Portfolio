import { useState } from 'react';

export default function SettingsManager() {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match!' });
    }

    setStatus({ type: 'loading', message: 'Updating password...' });
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          oldPassword: formData.oldPassword, 
          newPassword: formData.newPassword 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Password updated successfully!' });
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Action failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error.' });
    }
  };

  return (
    <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6 max-w-xl">
      <h2 className="text-2xl font-serif text-[#38bdf8] mb-6">Security Settings</h2>
      
      {status.message && (
        <div className={`mb-6 p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">Current Password</label>
          <div className="relative">
            <input 
              type={showCurrentPassword ? 'text' : 'password'} name="oldPassword" value={formData.oldPassword} onChange={handleChange} required 
              className="w-full bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" 
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6288] hover:text-[#38bdf8]"
              aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
            >
              {showCurrentPassword ? (
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
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">New Password</label>
          <div className="relative">
            <input 
              type={showNewPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange} required minLength="6"
              className="w-full bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" 
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6288] hover:text-[#38bdf8]"
              aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
            >
              {showNewPassword ? (
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
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">Confirm New Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6"
              className="w-full bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6288] hover:text-[#38bdf8]"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? (
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
        </div>

        <button type="submit" className="mt-4 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 py-3 px-6 rounded hover:bg-[#38bdf8] hover:text-[#0a0d1a] transition-colors font-bold tracking-wide">
          Change Password
        </button>
      </form>
    </div>
  );
}