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
    Feather,
    Info,
    IndianRupee,
    ChevronRight,
    ListFilter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PoojaListPage() {
    const [poojas, setPoojas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
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
            setShowForm(false);
            setFormData({ name: "", description: "", price: "", duration_minutes: 30, is_active: true });
            setEditingId(null);
            fetchPoojas();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to remove this service?")) return;
        try {
            await api.delete(`/pooja/${id}/`);
            fetchPoojas();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                        <Feather size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pooja Services</h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Manage ritual offerings, prices, and descriptions
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search poojas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 pl-11 pr-4 bg-white border border-slate-200 rounded-lg w-64 md:w-72 text-xs font-medium text-slate-900 outline-none focus:border-[#B8860B] transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => { 
                            setEditingId(null); 
                            setFormData({ name: "", description: "", price: "", duration_minutes: 30, is_active: true }); 
                            setShowForm(true); 
                        }}
                        className="h-10 px-5 bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-md hover:bg-slate-800 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Add Service
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InsightCard label="Total Offerings" value={poojas.length} icon={Scroll} color="slate" />
                <InsightCard label="Online Enabled" value={poojas.filter(p => p.is_active).length} icon={Activity} color="emerald" />
                <InsightCard label="Avg. Response" value="Fast" icon={Zap} color="orange" />
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <ListFilter size={14} /> Service Inventory
                </h2>
                <span className="text-[10px] font-bold text-slate-300 uppercase">{filtered.length} Items</span>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">
                        Loading services...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        No poojas found matching your search
                    </div>
                ) : filtered.map((pooja) => (
                    <motion.div 
                        key={pooja.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:border-[#B8860B]/20 transition-all relative"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Sparkles size={16} />
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => { setEditingId(pooja.id); setFormData(pooja); setShowForm(true); }} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                                    <Edit size={14} />
                                </button>
                                <button onClick={() => handleDelete(pooja.id)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                             <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                                {pooja.name}
                            </h3>
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                                {pooja.description || "No description provided for this service."}
                            </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] font-bold text-slate-400">₹</span>
                                <span className="text-lg font-bold text-slate-900">{pooja.price}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                <Clock size={12} className="text-[#B8860B]" /> {pooja.duration_minutes} MIN
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col border border-slate-100">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                   <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                      <Zap size={20} />
                                   </div>
                                   <div>
                                      <h2 className="text-base font-bold text-slate-900">{editingId ? "Update Offering" : "New Pooja Service"}</h2>
                                      <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">Configure service details and pricing</p>
                                   </div>
                                </div>
                                <button onClick={() => setShowForm(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all">
                                  <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Pooja Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="e.g. Archana" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Price (₹)</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</div>
                                                <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="0.00" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Duration (min)</label>
                                            <div className="relative">
                                                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input required type="number" value={formData.duration_minutes} onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all" placeholder="30" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full h-28 bg-slate-50 border border-slate-200 rounded-xl p-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all resize-none" placeholder="Enter service description..." />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end items-center gap-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                                    <button type="submit" className="px-8 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all">
                                        {editingId ? "Save Changes" : "Create Service"}
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

function InsightCard({ label, value, icon: Icon, color }) {
    const colors = {
        slate: "bg-slate-100 text-slate-400",
        emerald: "bg-emerald-50 text-emerald-500",
        orange: "bg-orange-50 text-orange-500"
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-[#B8860B]/20 transition-all">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${colors[color]}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}
