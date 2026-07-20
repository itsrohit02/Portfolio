// client/src/components/Certificates.jsx
import { useState, useEffect } from 'react';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/certificates`);
        const data = await response.json();
        setCertificates(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch certificates", err);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <section id="certificates" className="py-32 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full px-4 md:px-8">
        
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
            05 — Credentials
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0]">
            Internships & Training Certificates
          </h2>
        </div>

        {loading ? (
          <div className="text-[#e8a33d] font-mono animate-pulse">Loading credentials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <div 
                key={cert._id} 
                className="group border border-[rgba(241,234,224,0.1)] bg-[#141a33] flex flex-col overflow-hidden transition-all duration-400 hover:border-[#e8a33d] hover:shadow-[0_15px_30px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1"
              >
                <div className="w-full h-48 border-b border-[rgba(241,234,224,0.1)] overflow-hidden relative bg-[#0a0d1a]">
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 right-4 bg-[#0a0d1a]/80 backdrop-blur-sm border border-[rgba(241,234,224,0.2)] px-3 py-1 font-mono text-[10px] text-[#6fe7dd] uppercase tracking-wider">
                    {cert.badge}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#f1eae0] mb-2">{cert.title}</h3>
                  <div className="text-[#9aa0c0] text-sm mb-6">{cert.org}</div>
                  
                  <div className="mt-auto pt-4 border-t border-[rgba(241,234,224,0.1)] flex justify-between items-center">
                    <span className="font-mono text-xs text-[#5c6288]">{cert.date}</span>
                    <div className="flex gap-4 font-mono text-xs">
                      {cert.verify && <a href={cert.verify} target="_blank" rel="noreferrer" className="text-[#e8a33d] hover:text-[#b8456b] transition-colors relative z-10">Verify</a>}
                      {cert.download && <a href={cert.download} target="_blank" rel="noreferrer" className="text-[#e8a33d] hover:text-[#b8456b] transition-colors relative z-10">Download</a>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}