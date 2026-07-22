import { useRef, Suspense, useState } from 'react'; // Added useState
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars, useTexture } from '@react-three/drei';

const AnimatedStars = () => {
  const starsRef = useRef();
  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.02;
      starsRef.current.rotation.x += delta * 0.01;
    }
  });
  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
    </group>
  );
};

const RealisticEarth = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const [earthTexture, cloudTexture] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.07; 
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={2.5} />
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial map={earthTexture} roughness={0.7} />
      </Sphere>
      <Sphere ref={cloudsRef} args={[2.1, 64, 64]}>
        <meshStandardMaterial map={cloudTexture} transparent={true} opacity={0.8} depthWrite={false} />
      </Sphere>
    </group>
  );
};

export default function Contact() {
  // Added state to track when the form is submitting
  const [isSending, setIsSending] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  return (
    <section id="contact" className="relative py-20 bg-[#0a0d1a] border-t border-[rgba(241,234,224,0.1)] overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <AnimatedStars />
        </Canvas>
      </div>

      <div className="w-full mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        <div className="flex flex-col gap-8 lg:pl-12">
          <div>
            <div className="font-mono text-xs tracking-[0.22em] uppercase text-[#e8a33d] flex items-center gap-3 mb-4">
              <span className="w-6 h-[1px] bg-[#e8a33d]"></span>
              06 — Contact
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#f1eae0] mb-4">
              Let's build something worth deploying.
            </h2>
            <p className="text-[#9aa0c0] text-lg mb-8 max-w-md">
              Open to entry-level full-stack and AI-adjacent roles, internships, and freelance builds.
            </p>
            
            <div className="flex flex-col gap-4 font-mono text-sm text-[#9aa0c0]">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a33d]"></span>
                Jaipur, Rajasthan, India
              </div>
              <a href="https://github.com/itsrohit02" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#e8a33d] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a33d]"></span>
                GitHub — itsrohit02
              </a>
            </div>
          </div>

          <form 
            className="flex flex-col gap-4 bg-[#141a33]/80 backdrop-blur-md p-6 lg:p-8 border border-[rgba(241,234,224,0.1)]"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsSending(true); // Disable button and show sending text
              
              const formData = {
                name: e.target.name.value,
                email: e.target.email.value,
                message: e.target.message.value
              };

              try {
                const response = await fetch(`${apiBaseUrl}/api/contact`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                });

                if (response.ok) {
                  alert("Message sent successfully!");
                  e.target.reset(); 
                } else {
                  alert("Something went wrong. Please try again.");
                }
              } catch (error) {
                console.error(error);
                alert("Failed to connect to the server.");
              } finally {
                setIsSending(false); // Re-enable button when done
              }
            }}
          >
             <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-[#5c6288]">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" className="bg-transparent border border-[rgba(241,234,224,0.2)] p-3 text-[#f1eae0] focus:outline-none focus:border-[#e8a33d] transition-colors" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-[#5c6288]">Email</label>
              <input type="email" id="email" name="email" placeholder="you@gmail.com" className="bg-transparent border border-[rgba(241,234,224,0.2)] p-3 text-[#f1eae0] focus:outline-none focus:border-[#e8a33d] transition-colors" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-[#5c6288]">Message</label>
              <textarea id="message" name="message" rows="3" placeholder="Tell me about the opportunity..." className="bg-transparent border border-[rgba(241,234,224,0.2)] p-3 text-[#f1eae0] focus:outline-none focus:border-[#e8a33d] transition-colors resize-none" required></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSending} // Prevents double-clicking
              className={`mt-2 font-bold py-3 uppercase tracking-wider text-sm transition-colors duration-300 ${
                isSending 
                  ? 'bg-[#5c6288] text-[#f1eae0] cursor-not-allowed' // Styling while loading
                  : 'bg-[#e8a33d] text-[#1a1204] hover:bg-[#b8456b] hover:text-[#f1eae0]' // Normal styling
              }`}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="w-full h-[350px] lg:h-[450px] relative cursor-grab active:cursor-grabbing bg-transparent lg:mt-70">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <Suspense fallback={null}>
              <RealisticEarth />
            </Suspense>
            <OrbitControls enableZoom={false} />
          </Canvas>
          <div className="absolute bottom-0 left-0 w-full text-center font-mono text-[10px] text-[#9aa0c0] uppercase tracking-widest pointer-events-none drop-shadow-md">
            Click and drag to rotate
          </div>
        </div>

      </div>
    </section>
  );
}