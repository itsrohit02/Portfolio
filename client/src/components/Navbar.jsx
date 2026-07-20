import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["About", "Skills", "Education", "Projects", "Certificates", "Contact"];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[rgba(241,234,224,0.1)] ${
        scrolled ? 'py-4 bg-[#0a0d1a]/80 backdrop-blur-md' : 'py-6 bg-transparent'
      }`}
    >
      <div className="relative w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
        <div className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2 text-[#f1eae0]">
          <span className="w-2.5 h-2.5 bg-[#e8a33d] rotate-45 inline-block"></span>
          Rohit Kumar
        </div>

        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="font-mono text-xs uppercase tracking-widest text-[#9aa0c0] hover:text-[#f1eae0] transition-colors relative group"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#e8a33d] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-md border border-[rgba(241,234,224,0.15)]"
          aria-label="Toggle menu"
        >
          <span className="w-6 h-[1px] bg-[#f1eae0]"></span>
          <span className="w-6 h-[1px] bg-[#f1eae0]"></span>
          <span className="w-6 h-[1px] bg-[#f1eae0]"></span>
        </button>

        {mobileMenuOpen && (
          <div className="absolute right-4 top-full mt-3 w-[calc(100%-2rem)] rounded-xl border border-[rgba(241,234,224,0.15)] bg-[#0a0d1a]/95 p-4 shadow-2xl shadow-black/30 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-sm uppercase tracking-widest text-[#9aa0c0] hover:text-[#f1eae0] transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}