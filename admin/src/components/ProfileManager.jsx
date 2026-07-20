import { useState, useEffect } from 'react';

export default function ProfileManager() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Form states including our new heroText
  const [heroText, setHeroText] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio1, setBio1] = useState('');
  const [bio2, setBio2] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [stats, setStats] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/profile`);
        const data = await res.json();
        setProfile(data);
        
        // Populate the form with existing data
        setHeroText(data.heroText || '');
        setHeadline(data.headline || '');
        setBio1(data.bio1 || '');
        setBio2(data.bio2 || '');
        setSoftSkills(data.softSkills ? data.softSkills.join(', ') : '');
        setHobbies(data.hobbies ? data.hobbies.join(', ') : '');
        setStats(data.stats || []);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const addStat = () => setStats([...stats, { num: '', label: '' }]);
  const removeStat = (index) => setStats(stats.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Saving profile...' });

    // Include heroText in the payload sent to the server
    const payload = {
      heroText,
      headline,
      bio1,
      bio2,
      softSkills: softSkills.split(',').map(s => s.trim()).filter(Boolean),
      hobbies: hobbies.split(',').map(s => s.trim()).filter(Boolean),
      stats
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/profile/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) setStatus({ type: 'success', message: 'Profile updated successfully!' });
      else setStatus({ type: 'error', message: 'Failed to update profile.' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error.' });
    }
  };

  if (!profile) return <div className="text-[#e8a33d] font-mono animate-pulse">Loading Profile...</div>;

  return (
    <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
      <h2 className="text-2xl font-serif text-[#38bdf8] mb-6">Manage Identity & Profile</h2>
      
      {status.message && <div className={`mb-6 p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{status.message}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* NEW: Hero Text */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">Hero Description (Home Page)</label>
          <textarea value={heroText} onChange={e => setHeroText(e.target.value)} rows="3" className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
        </div>

        {/* Existing Text Fields */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">Headline (HTML allowed for styling)</label>
          <input value={headline} onChange={e => setHeadline(e.target.value)} className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">Bio Paragraph 1</label>
          <textarea value={bio1} onChange={e => setBio1(e.target.value)} rows="2" className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase text-[#5c6288]">Bio Paragraph 2</label>
          <textarea value={bio2} onChange={e => setBio2(e.target.value)} rows="2" className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
        </div>

        {/* Arrays (Comma separated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-[#5c6288]">Soft Skills (Comma separated)</label>
            <textarea value={softSkills} onChange={e => setSoftSkills(e.target.value)} rows="3" className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-[#5c6288]">Hobbies (Comma separated)</label>
            <textarea value={hobbies} onChange={e => setHobbies(e.target.value)} rows="3" className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="p-4 bg-[#0a0d1a] border border-[#1e293b] rounded-lg mt-4">
          <div className="flex justify-between items-center mb-4">
            <label className="font-mono text-xs uppercase text-[#5c6288]">Dynamic Stats Grid</label>
            <button type="button" onClick={addStat} className="text-xs text-[#38bdf8] border border-[#38bdf8]/30 px-3 py-1 rounded hover:bg-[#38bdf8]/10 transition-colors">+ Add Stat</button>
          </div>
          
          <div className="flex flex-col gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input value={stat.num} onChange={e => handleStatChange(index, 'num', e.target.value)} placeholder="Number" className="bg-[#141a33] border border-[#1e293b] p-2 rounded text-[#f1eae0] w-32 outline-none" />
                <input value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} placeholder="Label" className="bg-[#141a33] border border-[#1e293b] p-2 rounded text-[#f1eae0] flex-1 outline-none" />
                <button type="button" onClick={() => removeStat(index)} className="text-red-400 text-xs px-2 hover:underline">Delete</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="mt-4 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 font-bold py-3 px-4 rounded hover:bg-[#38bdf8] hover:text-[#0a0d1a] transition-colors">
          Update Profile
        </button>
      </form>
    </div>
  );
}