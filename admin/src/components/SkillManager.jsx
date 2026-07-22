// admin/src/components/SkillManager.jsx
import { useState, useEffect } from 'react';

export default function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Frontend' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Languages'];

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/skills`);
      setSkills(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const normalizeSkillNames = (value) =>
    value
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: editingId ? 'Updating...' : 'Saving...' });
    const token = localStorage.getItem('adminToken');

    try {
      if (editingId) {
        const res = await fetch(`${apiBaseUrl}/api/skills/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          setStatus({ type: 'success', message: 'Skill updated!' });
          setFormData({ name: '', category: 'Frontend' });
          setEditingId(null);
          fetchSkills();
        } else {
          setStatus({ type: 'error', message: 'Action failed' });
        }
        return;
      }

      const skillNames = normalizeSkillNames(formData.name);
      if (skillNames.length === 0) {
        setStatus({ type: 'error', message: 'Enter at least one skill name.' });
        return;
      }

      const requests = skillNames.map((name) =>
        fetch(`${apiBaseUrl}/api/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, category: formData.category })
        })
      );

      const responses = await Promise.all(requests);
      const allOk = responses.every((res) => res.ok);

      if (allOk) {
        setStatus({ type: 'success', message: `Added ${skillNames.length} skill${skillNames.length > 1 ? 's' : ''}!` });
        setFormData({ name: '', category: 'Frontend' });
        setEditingId(null);
        fetchSkills();
      } else {
        setStatus({ type: 'error', message: 'Some skills could not be added' });
      }
    } catch (err) { setStatus({ type: 'error', message: 'Server error.' }); }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({ name: skill.name, category: skill.category });
    setStatus({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`${apiBaseUrl}/api/skills/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchSkills();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* FORM SECTION */}
      <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
        <h2 className="text-2xl font-serif text-[#38bdf8] mb-6">{editingId ? 'Edit Skill' : 'Add New Skill'}</h2>
        
        {status.message && <div className={`mb-6 p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{status.message}</div>}

        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-[#5c6288]">Skill Names</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. React.js, Node.js, MongoDB"
              required
              className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]"
            />
          
          </div>
            <div className="flex-1 flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-[#5c6288]">Category</label>
            <input 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                list="category-suggestions" 
                placeholder="e.g. Cloud Architecture" 
                required 
                className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" 
            />
            {/* This datalist suggests existing categories as you type */}
            <datalist id="category-suggestions">
                {[...new Set(skills.map(s => s.category))].map(cat => (
                <option key={cat} value={cat} />
                ))}
            </datalist>
            </div>
          <button type="submit" className="bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 py-3 px-6 rounded hover:bg-[#38bdf8] hover:text-[#0a0d1a] transition-colors">{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name: '', category: 'Frontend'})}} className="px-6 py-3 border border-[#5c6288] text-[#9aa0c0] rounded hover:text-[#f1eae0]">Cancel</button>}
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
        <h2 className="text-xl font-serif text-[#f1eae0] mb-6">Current Arsenal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill._id} className="flex justify-between items-center p-4 bg-[#0a0d1a]/50 border border-[#1e293b] rounded hover:border-[#38bdf8]/30">
              <div>
                <h3 className="text-[#f1eae0] font-bold">{skill.name}</h3>
                <p className="text-[#5c6288] text-xs font-mono">{skill.category}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(skill)} className="px-3 py-1 text-xs border border-[#38bdf8]/30 text-[#38bdf8] rounded hover:bg-[#38bdf8]/10">Edit</button>
                <button onClick={() => handleDelete(skill._id)} className="px-3 py-1 text-xs border border-red-500/30 text-red-400 rounded hover:bg-red-500/10">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}