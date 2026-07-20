import './styles/global.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Events from './components/Events'; // <-- Import added
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <main className="bg-[#0a0d1a] min-h-screen overflow-x-hidden font-sans text-[#f1eae0] selection:bg-[#e8a33d] selection:text-[#0a0d1a]">
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Certificates />
      <Events /> {/* <-- Rendered here! */}
      <Contact />
      <Footer />
    </main>
  );
}

export default App;