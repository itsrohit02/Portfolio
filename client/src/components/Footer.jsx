export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)] font-mono text-xs text-[#5c6288]">
      <div className="w-full mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>© {currentYear} Rohit Kumar. Built with intent.</div>
        <div className="flex gap-6">
            <span>Jaipur, Rajasthan — IN</span>
            <a href="https://github.com/itsrohit02" target="_blank" rel="noreferrer" className="hover:text-[#e8a33d] transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}