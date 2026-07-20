// client/src/components/TechArsenal.jsx
import { useState, useEffect } from 'react';

export default function TechArsenal() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/skills`);
        const data = await response.json();
        setSkills(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch skills", err);
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // Group skills by category for easier display
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="arsenal" className="py-32 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full px-4 md:px-8">
        
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
            04 — Skills
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0]">
            Technical Arsenal
          </h2>
        </div>

        {loading ? (
          <div className="text-[#e8a33d] font-mono animate-pulse">Loading arsenal...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.keys(groupedSkills).map((category, index) => (
              <div key={index} className="bg-[#141a33] p-6 border border-[rgba(241,234,224,0.1)] rounded-lg">
                <h3 className="text-xl font-bold text-[#38bdf8] mb-4 border-b border-[#1e293b] pb-2">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category].map((skill) => (
                    <span 
                      key={skill._id} 
                      className="text-sm font-mono text-[#f1eae0] bg-[#0a0d1a] px-3 py-1 border border-[#1e293b] rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}