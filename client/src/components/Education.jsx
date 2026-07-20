export default function Education() {
  const education = [
    {
      degree: "B.Tech in Computer Science (Artificial Intelligence)",
      school: "Jaipur Engineering Collenge,Kukas, Jaipur",
      board: "Rajasthan Technical University (RTU)",
      year: "2023 — 2027",
      details: "Focus on Machine Learning, Neural Networks, and Data Structures. Currently maintaining 8.33 CGPA."
    },
    {
      degree: "Senior Secondary Education (Class XII)",
      school: "Government Senior Secondary School, Murlipura, Jaipur",
      board: "Board of Secondary Education, Rajasthan",
      year: "2022 — 2023",
      details: "Completed with a strong focus on Physics, Chemistry, and Mathematics (PCM)."
    },
    {
      degree: "Secondary Education (Class X)",
      school: "SKH Memorial School, Jaipur",
      board: "Board of Secondary Education, Rajasthan",
      year: "2020 — 2021",
      details: "Completed with a strong focus on Science, English and Mathematics."
    }
  ];

  return (
    <section id="education" className="py-20 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)]">
      <div className="w-full mx-auto px-4 md:px-8">
        <div className="mb-12">
          <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
            02 — Education
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0]">Academic Background</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <div key={index} className="p-8 border border-[rgba(241,234,224,0.1)] bg-[#141a33]/50 hover:border-[#e8a33d] transition-colors duration-300">
              <div className="font-mono text-xs text-[#e8a33d] mb-3">{edu.year}</div>
              <h3 className="text-xl font-bold text-[#f1eae0] mb-2">{edu.degree}</h3>
              <div className="text-sm text-[#5c6288] font-mono uppercase tracking-wider mb-4">{edu.board}</div>
              <div className="text-sm text-[#5c6288] font-mono uppercase tracking-wider mb-4">{edu.school}</div>
              <p className="text-[#9aa0c0] text-sm leading-relaxed">{edu.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}