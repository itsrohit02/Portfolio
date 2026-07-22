import { useState, useEffect } from 'react';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/profile`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="about" className="relative py-20 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)] flex justify-center">
        <div className="text-[#e8a33d] font-mono animate-pulse">Loading Identity Data...</div>
      </section>
    );
  }

  return (
    <section id="about" className="relative py-20 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Text & Skills/Hobbies */}
        <div>
          <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
            01 — About
          </div>
          
          {/* Dynamically inject HTML headline */}
          <h2 
            className="text-4xl md:text-5xl font-serif font-bold mb-8 text-[#f1eae0]"
            dangerouslySetInnerHTML={{ __html: profile.headline }}
          />
          
          <div className="text-[#9aa0c0] space-y-5 text-lg mb-10">
            <p>{profile.bio1}</p>
            {profile.bio2 && <p>{profile.bio2}</p>}
          </div>

          {/* Dynamic Soft Skills & Hobbies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-[#f1eae0] mb-4">Soft Skills</h4>
              <ul className="space-y-2">
                {profile.softSkills.map((skill, i) => (
                  <li key={i} className="text-[#9aa0c0] text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#e8a33d]"></span> {skill}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#f1eae0] mb-4">Hobbies</h4>
              <ul className="space-y-2">
                {profile.hobbies.map((hobby, i) => (
                  <li key={i} className="text-[#9aa0c0] text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#b8456b]"></span> {hobby}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-[1px] bg-[rgba(241,234,224,0.1)] border border-[rgba(241,234,224,0.1)]">
          {profile.stats.map((stat, index) => (
            <div key={index} className="bg-[#0a0d1a] p-8 hover:bg-[#0e1226] transition-colors duration-300">
              <div className="font-serif text-4xl font-bold text-[#e8a33d] leading-none mb-3">
                {stat.num}
              </div>
              <div className="font-mono text-xs tracking-widest uppercase text-[#5c6288]">
                {stat.label}
              </div>
            </div>
          ))}
          
          {/* Smart fix: Fill the empty grid cell if there's an odd number of stats! */}
          {profile.stats.length % 2 !== 0 && (
            <div className="bg-[#0a0d1a] h-full w-full"></div>
          )}
        </div>

      </div>
    </section>
  );
}