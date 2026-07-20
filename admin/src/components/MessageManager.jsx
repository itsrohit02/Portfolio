import { useState, useEffect } from 'react';

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const res = await fetch(`${apiBaseUrl}/api/messages`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    const data = await res.json();
    setMessages(data);
    setSelectedIds([]); // Reset selection
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} messages?`)) return;
    await fetch(`${apiBaseUrl}/api/messages/delete-many`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ ids: selectedIds })
    });
    fetchMessages();
  };

  return (
    <div className="bg-[#141a33]/50 border border-[rgba(241,234,224,0.1)] rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#38bdf8]">Inbox</h2>
        {selectedIds.length > 0 && (
          <button onClick={deleteSelected} className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded text-sm hover:bg-red-500/20 transition-colors">
            Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {loading ? <p className="text-[#5c6288]">Loading...</p> : (
        <div className="space-y-4">
          {messages.map(msg => {
            const messageDate = msg.date || msg.createdAt;
            const formattedDate = messageDate
              ? new Date(messageDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : 'No date';

            return (
              <div key={msg._id} className={`p-4 bg-[#0a0d1a] border rounded-lg flex items-start gap-4 ${selectedIds.includes(msg._id) ? 'border-[#38bdf8]' : 'border-[#1e293b]'}`}>
                <input type="checkbox" checked={selectedIds.includes(msg._id)} onChange={() => toggleSelect(msg._id)} className="mt-1 accent-[#38bdf8]" />
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <h3 className="text-[#f1eae0] font-bold">{msg.name}</h3>
                    <span className="text-[#5c6288] text-[10px] whitespace-nowrap">{formattedDate}</span>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-[#38bdf8] text-sm hover:underline">{msg.email}</a>
                  <p className="text-[#9aa0c0] text-sm italic mt-2">{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}