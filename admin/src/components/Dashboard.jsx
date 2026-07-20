import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  Cpu, 
  Calendar, 
  MessageSquare, 
  User, 
  Settings,
  FolderKanban
} from 'lucide-react'; // 1. IMPORT ICONS

import ProjectManager from './ProjectManager';
import CertificateManager from './CertificateManager'; 
import SkillManager from './SkillManager';
import EventManager from './EventManager';
import ProfileManager from './ProfileManager';
import SettingsManager from './SettingsManager';
import MessageManager from './MessageManager';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const navigate = useNavigate();

  // 2. MAPPED ICONS TO NAVIGATION
  const navItems = [
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={18} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={18} /> },
    { id: 'arsenal', label: 'Tech Arsenal', icon: <Cpu size={18} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { id: 'profile', label: 'Identity', icon: <User size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectManager />;
      case 'certificates': return <CertificateManager />;
      case 'arsenal': return <SkillManager />;
      case 'events': return <EventManager />;
      case 'profile': return <ProfileManager />;
      case 'settings': return <SettingsManager />;
      case 'messages': return <MessageManager />;
      default: return <ProjectManager />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] flex flex-col lg:flex-row text-[#f1eae0]">
      <aside className="w-full lg:w-64 bg-[#141a33] border-b lg:border-b-0 lg:border-r border-[rgba(241,234,224,0.05)] flex flex-col">
        <div className="p-4 sm:p-6 border-b border-[rgba(241,234,224,0.05)]">
          <h1 className="text-xl font-serif font-bold text-[#f1eae0]">Command<span className="text-[#38bdf8]">Center</span></h1>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-[#5c6288]">Admin v1.0</p>
        </div>

        <nav className="flex-1 p-3 sm:p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {navItems.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`flex min-w-max items-center gap-3 rounded p-3 text-sm font-mono tracking-wide transition-all ${
                activeTab === tab.id 
                ? 'border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8]' 
                : 'text-[#9aa0c0] hover:bg-[rgba(241,234,224,0.05)] hover:text-[#f1eae0]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-[rgba(241,234,224,0.05)]">
          <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded border border-[#e8a33d]/30 p-3 text-sm font-mono tracking-widest text-[#e8a33d] transition-colors hover:bg-[#e8a33d] hover:text-[#0a0d1a]">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#38bdf8]/5 blur-[120px]"></div>

        <header className="relative z-10 flex h-20 items-center border-b border-[rgba(241,234,224,0.05)] px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-mono uppercase tracking-wider text-[#f1eae0] sm:text-xl">
            {navItems.find(t => t.id === activeTab)?.label}
          </h2>
        </header>

        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
