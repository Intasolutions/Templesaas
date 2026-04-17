import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../shared/api/client';
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Ticket,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ChevronRight,
  Database,
  Layers,
  Info
} from 'lucide-react';

const EventsPage = () => {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    enable_digital_passes: false,
    pass_price: "0",
    max_capacity: "0",
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await api.get("/events/");
      setEvents(res.data?.results || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!form.name || !form.start_date || !form.end_date) {
      setErrorMsg(t('events_required_fields', 'Name and dates are mandatory for registry.'));
      return;
    }

    try {
      setSubmitting(true);
      if (editingEvent) {
          await api.patch(`/events/${editingEvent.id}/`, form);
      } else {
          await api.post("/events/", form);
      }
      setIsAddOpen(false);
      setEditingEvent(null);
      setForm({
        name: "", description: "", start_date: "", end_date: "",
        location: "", enable_digital_passes: false, pass_price: "0", max_capacity: "0",
      });
      fetchEvents();
    } catch (e) {
      setErrorMsg(e.response?.data?.detail || 'registry_update_failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
      if (!window.confirm(t('confirm_delete_event', 'Deactivate this event protocol?'))) return;
      try {
          await api.delete(`/events/${id}/`);
          fetchEvents();
      } catch (e) {
          alert('Error deactivating event');
      }
  }

  function openEdit(evt) {
      setEditingEvent(evt);
      setForm({
          name: evt.name,
          description: evt.description || "",
          start_date: evt.start_date,
          end_date: evt.end_date,
          location: evt.location || "",
          enable_digital_passes: evt.enable_digital_passes || false,
          pass_price: evt.pass_price || "0",
          max_capacity: evt.max_capacity || "0",
      });
      setIsAddOpen(true);
  }

  const filteredEvents = useMemo(() => 
    events.filter(evt =>
      evt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [events, searchTerm]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Prime Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                <Sparkles size={18} />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">Ritual Registry</h1>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Layers size={10} className="text-primary" /> Festival Lifecycle & Global Observances
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-64 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-[9px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-50 transition-all shadow-inner"
              placeholder="Audit Registry..."
            />
          </div>
          {checkPermission('events', 'edit') && (
            <button
                onClick={() => { setEditingEvent(null); setForm({ name: "", description: "", start_date: "", end_date: "", location: "", enable_digital_passes: false, pass_price: "0", max_capacity: "0" }); setIsAddOpen(true); }}
                className="h-11 px-6 bg-slate-900 text-white rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95"
            >
                <Plus size={16} /> Schedule Event
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Mounting Records...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
           <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-100 shadow-xl">
             <Calendar size={32} />
           </div>
           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Registry Void: No Events Programmed</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredEvents.map(evt => (
            <EventCard 
              key={evt.id} 
              event={evt} 
              onEdit={() => openEdit(evt)} 
              onDelete={() => handleDelete(evt.id)} 
              canEdit={checkPermission('events', 'edit')}
              canDelete={checkPermission('events', 'delete')}
            />
          ))}
        </motion.div>
      )}

      {/* Creation/Edit Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => !submitting && setIsAddOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-xl flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white">
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tighter uppercase flex items-center gap-3 leading-none">
                     <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                       <Zap size={20} />
                     </div>
                     {editingEvent ? 'Protocol Update' : 'New Observance'}
                   </h2>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2.5 flex items-center gap-2">
                     <Database size={10} /> {editingEvent ? `#${editingEvent.id}` : 'Draft Protocol'}
                   </p>
                </div>
                <button onClick={() => !submitting && setIsAddOpen(false)} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <form id="event-form" onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Universal Designation</label>
                    <input 
                      required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                      placeholder="e.g., Mahotsavam Prime"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Initiation</label>
                        <input 
                          type="date" required value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value})}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Completion</label>
                        <input 
                          type="date" required value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value})}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Spatial Node</label>
                    <input 
                      value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
                      className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                      placeholder="Temple Sanctum..."
                    />
                  </div>

                  <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <span className="text-[9px] font-black uppercase tracking-widest text-primary">Ticketing Protocol</span>
                           <p className="text-[7px] text-white/40 uppercase tracking-widest font-medium">Digital Access & Capacity</p>
                        </div>
                        <button 
                           type="button" onClick={() => setForm({...form, enable_digital_passes: !form.enable_digital_passes})}
                           className={`h-6 w-10 rounded-full relative transition-all ${form.enable_digital_passes ? 'bg-primary' : 'bg-white/10'}`}
                        >
                           <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-all ${form.enable_digital_passes ? 'translate-x-4' : ''}`} />
                        </button>
                     </div>
                     {form.enable_digital_passes && (
                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-1.5">
                             <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Remittance</label>
                             <input type="number" value={form.pass_price} onChange={(e) => setForm({...form, pass_price: e.target.value})} className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-white font-bold outline-none focus:border-primary text-xs" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Registry Cap</label>
                             <input type="number" value={form.max_capacity} onChange={(e) => setForm({...form, max_capacity: e.target.value})} className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-white font-bold outline-none focus:border-primary text-xs" />
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Observance Abstract</label>
                    <textarea 
                      rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner resize-none text-[11px] leading-relaxed"
                      placeholder="Define the ritual significance..."
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-5 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                       <AlertCircle size={18} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{errorMsg}</span>
                    </div>
                  )}
                </form>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button type="button" onClick={() => !submitting && setIsAddOpen(false)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                  Abort
                </button>
                <button form="event-form" type="submit" disabled={submitting} className="h-11 px-10 bg-slate-900 text-white rounded-xl font-bold text-[9px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 disabled:opacity-50">
                  {submitting ? 'Transmitting...' : (editingEvent ? 'Commit Update' : 'Broadcast Protocol')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function EventCard({ event, onEdit, onDelete, canEdit, canDelete }) {
  const now = new Date();
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  const isLive = now >= start && now <= end;
  const isUpcoming = now < start;

  const config = isLive 
    ? { label: 'Active Protocol', color: 'bg-emerald-500', bg: 'bg-emerald-50' }
    : isUpcoming 
      ? { label: 'Standby Mode', color: 'bg-primary', bg: 'bg-amber-50' }
      : { label: 'Archive Record', color: 'bg-slate-200', bg: 'bg-slate-50' };

  return (
    <motion.div 
      layout
      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
        <Sparkles size={48} />
      </div>

      <div className="flex justify-between items-start mb-8 relative z-10">
         <div className="flex items-center gap-2.5">
            <div className={`h-2 w-2 rounded-full ${config.color} ${isLive ? 'animate-pulse' : ''}`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{config.label}</span>
         </div>
         <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
            {canEdit && (
                <button onClick={onEdit} className="h-8 w-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/20 active:scale-90 transition-all">
                    <Zap size={12} />
                </button>
            )}
            {canDelete && (
                <button onClick={onDelete} className="h-8 w-8 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 rounded-lg flex items-center justify-center active:scale-90 transition-all">
                    <X size={14} />
                </button>
            )}
         </div>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 tracking-tighter uppercase mb-1.5 group-hover:text-primary transition-colors leading-tight">
          {event.name}
        </h3>
        <div className="flex items-center gap-2 mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 w-fit px-2.5 py-1 rounded-lg">
           <Calendar size={10} /> {new Date(event.start_date).toLocaleDateString()} — {new Date(event.end_date).toLocaleDateString()}
        </div>
        <p className="text-[11px] font-bold text-slate-500 leading-relaxed line-clamp-3 mb-6 uppercase">
          {event.description || 'Traditional observance ritual details are being synchronized from the main temple registry archives.'}
        </p>
      </div>

      <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto relative z-10">
         <div className="flex items-center gap-2 text-[9px] font-black text-slate-900 uppercase tracking-widest">
            <div className="h-5 w-5 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
               <MapPin size={10} />
            </div>
            {event.location || 'Central Complex'}
         </div>
         {event.enable_digital_passes ? (
           <div className="h-7 px-3 bg-primary text-white text-[8px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 uppercase tracking-widest">
              ₹{event.pass_price}
           </div>
         ) : (
           <div className="h-7 px-3 bg-slate-50 text-slate-400 text-[8px] font-black rounded-lg flex items-center justify-center uppercase tracking-widest border border-slate-100">
              Free Access
           </div>
         )}
      </div>
    </motion.div>
  );
}

export default EventsPage;
