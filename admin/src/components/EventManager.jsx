// admin/src/components/EventManager.jsx
import { useState, useEffect } from 'react';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', role: '', badge: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/events`);
      setEvents(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: editingId ? 'Updating...' : 'Saving...' });
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId ? `${apiBaseUrl}/api/events/${editingId}` : `${apiBaseUrl}/api/events`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus({ type: 'success', message: `Event ${editingId ? 'updated' : 'added'} successfully!` });
        setFormData({ title: '', role: '', badge: '' });
        setEditingId(null);
        fetchEvents();
      } else {
        setStatus({ type: 'error', message: 'Action failed' });
      }
    } catch (err) { setStatus({ type: 'error', message: 'Server error.' }); }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setFormData({ title: event.title, role: event.role, badge: event.badge });
    setStatus({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`${apiBaseUrl}/api/events/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchEvents();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* FORM SECTION */}
      <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
        <h2 className="text-2xl font-serif text-[#38bdf8] mb-6">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
        
        {status.message && <div className={`mb-6 p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{status.message}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
            <input name="role" value={formData.role} onChange={handleChange} placeholder="Role (e.g. Panelist)" required className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
          </div>
          <input name="badge" value={formData.badge} onChange={handleChange} placeholder="Badge (e.g. Conference)" required className="bg-[#0a0d1a] border border-[#1e293b] p-3 rounded text-[#f1eae0] outline-none focus:border-[#38bdf8]" />
          
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 py-3 rounded hover:bg-[#38bdf8] hover:text-[#0a0d1a] transition-colors">{editingId ? 'Update Event' : 'Publish Event'}</button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({title: '', role: '', badge: ''})}} className="px-6 border border-[#5c6288] text-[#9aa0c0] rounded hover:text-[#f1eae0]">Cancel</button>}
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
        <h2 className="text-xl font-serif text-[#f1eae0] mb-6">Current Events</h2>
        <div className="flex flex-col gap-4">
          {events.map(event => (
            <div key={event._id} className="flex justify-between items-center p-4 bg-[#0a0d1a]/50 border border-[#1e293b] rounded hover:border-[#38bdf8]/30 transition-colors">
              <div>
                <h3 className="text-[#f1eae0] font-bold">{event.title}</h3>
                <p className="text-[#5c6288] text-xs font-mono">{event.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(event)} className="px-3 py-1 text-xs border border-[#38bdf8]/30 text-[#38bdf8] rounded hover:bg-[#38bdf8]/10 transition-colors">Edit</button>
                <button onClick={() => handleDelete(event._id)} className="px-3 py-1 text-xs border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}