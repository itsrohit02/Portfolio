import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/skills`);
        if (!response.ok) throw new Error('Failed to fetch skills');
        
        const data = await response.json();
        
        // Transform flat database array into the grouped format your UI expects
        // From: [{ name: 'React', category: 'Frontend' }]
        // To:   [{ title: 'Frontend', skills: ['React'] }]
        const grouped = data.reduce((acc, skill) => {
          let group = acc.find(c => c.title === skill.category);
          if (!group) {
            group = { title: skill.category, skills: [] };
            acc.push(group);
          }
          group.skills.push(skill.name);
          return acc;
        }, []);

        setSkillCategories(grouped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Could not load skills at this time.');
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-32 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full px-4 md:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
              02 — Skills
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0]">
              Technical Arsenal
            </h2>
          </div>
        </div>

        {loading && (
          <div className="text-[#e8a33d] font-mono animate-pulse mb-8">
            Loading arsenal configuration...
          </div>
        )}

        {error && (
          <div className="text-red-400 font-mono mb-8">
            {error}
          </div>
        )}

        {!loading && skillCategories.length === 0 && !error && (
          <div className="text-[#5c6288] font-mono mb-8">
            No skills detected in database. Awaiting admin input.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, index) => (
            <Tilt
              key={index}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              perspective={1000}
              transitionSpeed={1000}
              scale={1.02}
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#e8a33d"
              glarePosition="all"
            >
              <div className="group h-full relative border border-[rgba(241,234,224,0.1)] bg-[#141a33] p-8 flex flex-col overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]">
                {/* Top Hover Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e8a33d] to-[#b8456b] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>

                <h3 className="text-lg font-bold text-[#f1eae0] mb-6 flex items-center gap-3">
                  <span className="font-mono text-xs text-[#6fe7dd]">0{index + 1}</span>
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {cat.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-[rgba(241,234,224,0.1)] bg-[#0a0d1a]/50 text-[#9aa0c0] hover:text-[#e8a33d] hover:border-[#e8a33d] transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Tilt>
          ))}
        </div>

      </div>
    </section>
  );
}