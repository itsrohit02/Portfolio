// admin/src/components/ProjectManager.jsx
import { useState, useEffect } from 'react';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    featured: false
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  // Fetch all projects when component loads
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: editingId ? 'Updating...' : 'Saving...' });
    const token = localStorage.getItem('adminToken');

    const projectPayload = {
      ...formData,
      techStack: typeof formData.techStack === 'string' 
        ? formData.techStack.split(',').map(tech => tech.trim()) 
        : formData.techStack
    };

    try {
      const url = editingId 
        ? `${apiBaseUrl}/api/projects/${editingId}`
        : `${apiBaseUrl}/api/projects`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectPayload)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: `Project ${editingId ? 'updated' : 'added'} successfully!` });
        setFormData({ title: '', techStack: '', githubLink: '', liveLink: '', featured: false });
        setEditingId(null);
        fetchProjects(); // Refresh the list
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', message: errorData.message || 'Action failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error.' });
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      featured: project.featured || false
    });
    setStatus({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${apiBaseUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchProjects(); // Refresh the list
        setStatus({ type: 'success', message: 'Project deleted.' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', techStack: '', githubLink: '', liveLink: '', featured: false });
    setStatus({ type: '', message: '' });
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* FORM SECTION */}
      <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-serif text-[#38bdf8]">
             {editingId ? 'Edit Project' : 'Add New Project'}
           </h2>
           {editingId && (
             <button onClick={cancelEdit} className="text-sm font-mono text-[#5c6288] hover:text-[#f1eae0]">
               Cancel Edit ✕
             </button>
           )}
        </div>
        
        {status.message && (
          <div className={`mb-6 p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#5c6288]">Project Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] focus:border-[#38bdf8] outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#5c6288]">Tech Stack (Comma separated)</label>
              <input name="techStack" value={formData.techStack} onChange={handleChange} required placeholder="HTML, CSS, React" className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] focus:border-[#38bdf8] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#5c6288]">GitHub Link</label>
              <input name="githubLink" value={formData.githubLink} onChange={handleChange} className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] focus:border-[#38bdf8] outline-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#5c6288]">Live Link</label>
              <input name="liveLink" value={formData.liveLink} onChange={handleChange} className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] focus:border-[#38bdf8] outline-none" />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#0a0d1a]/50 border border-[#1e293b] rounded">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-[#38bdf8]" />
            <div>
              <div className="text-[#f1eae0] font-bold">Featured Project</div>
              <div className="text-[#5c6288] text-xs font-mono mt-1">Spans two columns.</div>
            </div>
          </label>

          <button type="submit" className="mt-2 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 font-bold py-3 px-4 rounded hover:bg-[#38bdf8] hover:text-[#0a0d1a] transition-colors">
            {editingId ? 'Update Project' : 'Publish Project'}
          </button>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
        <h2 className="text-2xl font-serif text-[#f1eae0] mb-6">Current Projects</h2>
        
        {projects.length === 0 ? (
          <p className="text-[#5c6288] font-mono text-sm">No projects found. Add one above.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map(project => (
              <div key={project._id} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-[#0a0d1a]/50 border border-[#1e293b] rounded group hover:border-[#38bdf8]/30 transition-colors">
                
                <div>
                  <h3 className="text-[#f1eae0] font-bold text-lg flex items-center gap-2">
                    {project.title}
                    {project.featured && <span className="text-[10px] bg-[#e8a33d]/20 text-[#e8a33d] px-2 py-0.5 rounded font-mono uppercase tracking-widest">Featured</span>}
                  </h3>
                  <div className="text-[#5c6288] text-xs font-mono mt-1">
                    {project.techStack.join(' • ')}
                  </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  <button onClick={() => handleEdit(project)} className="px-4 py-2 text-xs font-mono border border-[#38bdf8]/30 text-[#38bdf8] rounded hover:bg-[#38bdf8]/10 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project._id)} className="px-4 py-2 text-xs font-mono border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors">
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}