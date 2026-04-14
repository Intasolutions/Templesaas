import { useEffect, useState } from "react";
import api from "../../shared/api/client";
import { 
    Sparkles, 
    Search, 
    Plus, 
    Clock, 
    Zap,
    Scroll,
    Activity,
    ShieldCheck,
    Database,
    Edit,
    Trash2,
    X,
    Layers,
    Feather
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PoojaListPage() {
    const [poojas, setPoojas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", duration_minutes: 30, is_active: true });
    const [editingId, setEditingId] = useState(null);

    const fetchPoojas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/pooja/");
            setPoojas(res.data.results || res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchPoojas(); 
    }, []);

    const filtered = Array.isArray(poojas) ? poojas.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : [];

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/pooja/${editingId}/`, formData);
            } else {
                await api.post("/pooja/", formData);
            }
            setShowRegister(false);
            setFormData({ name: "", description: "", price: "", duration_minutes: 30, is_active: true });
            setEditingId(null);
            fetchPoojas();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to decommission this protocol?")) return;
        try {
            await api.delete(`/pooja/${id}/`);
            fetchPoojas();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                            <Feather size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Protocol Registry</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Database size={12} className="text-slate-900" /> Ritual Ledger Node
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Query Protocols..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 pl-14 pr-6 bg-white border border-slate-100 rounded-xl w-64 md:w-72 text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-50 transition-all placeholder:text-slate-200"
                        />
                    </div>
                    <button 
                        onClick={() => { 
                            setEditingId(null); 
                            setFormData({ name: "", description: "", price: "", duration_minutes: 30, is_active: true }); 
                            setShowRegister(true); 
                        }}
                        className="h-12 px-6 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Register Protocol
                    </button>
                </div>
            </header>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <InsightCard label="Active Protocols" value={poojas.length} icon={Scroll} color="slate" badge="LIVE" />
                <InsightCard label="Avg. Energy Level" value="High" icon={Activity} color="emerald" badge="STABLE" />
                <InsightCard label="System Integrity" value="99.9%" icon={ShieldCheck} color="primary" badge="VERIFIED" />
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {loading ? (
                    <div className="col-span-full py-32 text-center text-[11px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">
                        Synchronizing Ritual Ledgers...
                    </div>
                ) : filtered.map((pooja) => (
                    <motion.div 
                        key={pooja.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6 }}
                        className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                             <Scroll size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                                <Sparkles size={18} />
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setEditingId(pooja.id); setFormData(pooja); setShowRegister(true); }} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(pooja.id)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-300 hover:text-red-500 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-tight group-hover:text-primary transition-colors">
                                {pooja.name}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed line-clamp-2 uppercase tracking-wide">
                                {pooja.description || "The ritual description data node is currently awaiting hydration from the primary ledger."}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocol Cost</p>
                                <p className="text-xl font-black text-slate-900 tracking-tighter">₹{pooja.price}</p>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Temporal Unit</p>
                                <div className="flex items-center justify-end gap-1.5 text-slate-900 font-bold text-xs">
                                    <Clock size={12} className="text-primary" /> {pooja.duration_minutes}m
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Registration Modal Overlay */}
            <AnimatePresence>
                {showRegister && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setShowRegister(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col border border-slate-100">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                                <div className="space-y-3">
                                   <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                      <Zap size={20} />
                                   </div>
                                   <div>
                                      <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{editingId ? "Update Protocol" : "Register Protocol"}</h2>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-2">
                                        <Layers size={12} className="text-primary" /> Ritual Architecture Definition
                                      </p>
                                   </div>
                                </div>
                                <button onClick={() => setShowRegister(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                                  <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-10 space-y-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Protocol Identification</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs" placeholder="e.g. Maha Ganapathi Homam" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valuation (₹)</label>
                                            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs" placeholder="0.00" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Units (min)</label>
                                            <input required type="number" value={formData.duration_minutes} onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs" placeholder="30" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Functional Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner resize-none text-[11px]" placeholder="Define ritual parameters..." />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex justify-end items-center gap-6">
                                    <button type="button" onClick={() => setShowRegister(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors">Abort Definiton</button>
                                    <button type="submit" className="h-14 px-12 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all">
                                        {editingId ? "Update Protocol" : "Commit Protocol"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InsightCard({ label, value, icon: Icon, color, badge }) {
    const colors = {
        slate: "bg-slate-100 text-slate-400",
        emerald: "bg-emerald-50 text-emerald-500",
        primary: "bg-primary/10 text-primary"
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group hover:shadow-xl hover:shadow-slate-100 transition-all">
            <div className="flex items-start gap-5">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${colors[color]}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</p>
                    <p className="text-2xl font-black text-slate-900 mt-2 tracking-tighter leading-none">{value}</p>
                </div>
            </div>
            {badge && (
                <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${colors[color]}`}>
                    {badge}
                </div>
            )}
        </div>
    );
}
