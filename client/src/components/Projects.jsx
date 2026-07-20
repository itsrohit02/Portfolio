import { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';

export default function Projects() {
  // 1. Setup State for our live database data
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 2. Fetch data from Backend when the component loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Could not load projects at this time.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-32 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full px-4 md:px-8">
        
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
            03 — Work
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0]">
            Selected Projects
          </h2>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="text-[#e8a33d] font-mono animate-pulse mb-8">
            Establishing secure connection to database...
          </div>
        )}
        {error && (
          <div className="text-red-400 font-mono mb-8">
            {error}
          </div>
        )}
        {!loading && projects.length === 0 && !error && (
          <div className="text-[#5c6288] font-mono mb-8">
            No projects deployed yet. Waiting for Admin upload.
          </div>
        )}

        {/* YOUR AWESOME 3D GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            // Making the first project span 2 columns just like your old 'featured' logic
            const isFeatured = index === 0;

            return (
              <Tilt
                key={project._id || index}
                className={isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}
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
                <div 
                  className={`group h-full relative border border-[rgba(241,234,224,0.1)] bg-[#141a33] p-8 flex flex-col overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] ${
                    isFeatured ? 'bg-gradient-to-br from-[#1a2140] to-[#141a33]' : ''
                  }`}
                >
                  {/* Top Hover Gradient Line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e8a33d] to-[#b8456b] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
                  
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-[#f1eae0] mb-4">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {/* Using project.techStack from your backend model */}
                      {project.techStack && project.techStack.map((tech, i) => (
                        <span key={i} className="font-mono text-[10px] text-[#5c6288] border border-[rgba(241,234,224,0.1)] px-2 py-1">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 mt-auto border-t border-[rgba(241,234,224,0.1)] pt-4 font-mono text-xs">
                    {/* Using project.liveLink and githubLink from your backend model */}
                    {project.liveLink ? (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-[#e8a33d] hover:text-[#b8456b] transition-colors relative z-10">
                        Live Demo →
                      </a>
                    ) : null}
                    
                    {project.githubLink ? (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-[#e8a33d] hover:text-[#b8456b] transition-colors relative z-10">
                        Source Code →
                      </a>
                    ) : null}
                    
                    {!project.liveLink && !project.githubLink && (
                      <span className="text-[#5c6288]">Private Build</span>
                    )}
                  </div>
                </div>
              </Tilt>
            );
          })}
        </div>

      </div>
    </section>
  );
}