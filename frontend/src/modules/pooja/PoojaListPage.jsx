import { useEffect, useState } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
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
    ChevronRight,
    ChevronLeft,
    ListFilter,
    IndianRupee
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import ModernInput from "../../components/ui/ModernInput";
import { ValidationUtils } from "../../shared/utils/ValidationUtils";
import { useNotify } from "../../context/NotificationContext";

export default function PoojaListPage() {
    const { checkPermission } = useAuth();
    const notify = useNotify();
    const [poojas, setPoojas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, current: 1 });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", amount: "", duration_minutes: 30, is_active: true });
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    const fetchPoojas = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/pooja/?page=${page}&search=${search}`);
            if (res.data.results) {
                setPoojas(res.data.results);
                setPagination({
                    count: res.data.count,
                    next: res.data.next,
                    previous: res.data.previous,
                    current: page
                });
            } else {
                setPoojas(res.data);
                setPagination({ count: res.data.length, next: null, previous: null, current: 1 });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPoojas(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const updateForm = (key, val) => {
        let err = null;
        if (key === 'amount') err = ValidationUtils.validators.amount(val);
        if (key === 'name') err = val.length < 3 ? "Name is too short" : null;

        setFormData(prev => ({ ...prev, [key]: val }));
        setErrors(prev => ({ ...prev, [key]: err }));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        const amountErr = ValidationUtils.validators.amount(formData.amount);
        const nameErr = formData.name.length < 3 ? "Name must be at least 3 characters" : null;

        if (amountErr || nameErr) {
            setErrors({ amount: amountErr, name: nameErr });
            return notify.warn("Please fix the highlighted errors.");
        }

        try {
            if (editingId) {
                await api.put(`/pooja/${editingId}/`, formData);
            } else {
                await api.post("/pooja/", formData);
            }
            setShowForm(false);
            setFormData({ name: "", amount: "", duration_minutes: 30, is_active: true });
            setEditingId(null);
            setErrors({});
            fetchPoojas();
            notify.success(editingId ? "Service updated" : "New service created");
        } catch (err) { 
            notify.error(err.response?.data?.detail || "Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this service?")) return;
        try {
            await api.delete(`/pooja/${id}/`);
            fetchPoojas();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Feather size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pooja Services</h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Manage ritual offerings, prices, and descriptions</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900" />
                        <input
                            type="text"
                            placeholder="Search poojas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 pl-11 pr-4 bg-white border border-slate-200 rounded-lg w-64 md:w-72 text-xs font-medium outline-none focus:border-primary transition-all"
                        />
                    </div>
                    {checkPermission('pooja', 'edit') && (
                        <button 
                            onClick={() => { 
                                setEditingId(null); 
                                setFormData({ name: "", amount: "", duration_minutes: 30, is_active: true }); 
                                setErrors({});
                                setShowForm(true); 
                            }}
                            className="h-10 px-5 bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-md hover:bg-slate-800 transition-all"
                        >
                            <Plus size={18} /> Add Service
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InsightCard label="Total Offerings" value={pagination.count} icon={Scroll} color="slate" />
                <InsightCard label="Online Enabled" value={poojas.filter(p => p.is_active).length} icon={Activity} color="emerald" />
                <InsightCard label="Avg. Response" value="Fast" icon={Zap} color="orange" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ListFilter size={14} /> Service Inventory
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-xs font-bold text-slate-300 uppercase animate-pulse">Loading...</div>
                ) : poojas.map((pooja) => (
                    <motion.div key={pooja.id} layout className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Sparkles size={16} />
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingId(pooja.id); setFormData(pooja); setErrors({}); setShowForm(true); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Edit size={14} /></button>
                                <button onClick={() => handleDelete(pooja.id)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 truncate">{pooja.name}</h3>
                        <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] font-bold text-slate-400">₹</span>
                                <span className="text-lg font-bold text-slate-900">{pooja.amount}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                                <Clock size={12} className="text-slate-400" /> {pooja.duration_minutes} MIN
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Pagination currentPage={pagination.current} totalPages={Math.ceil(pagination.count / 10) || 1} onPageChange={fetchPoojas} count={pagination.count} pageSize={10} />

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">{editingId ? "Update Service" : "New Service"}</h2>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Configure offering parameters</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <ModernInput 
                                        label="Service Identity" 
                                        value={formData.name} 
                                        error={errors.name}
                                        success={formData.name.length > 2}
                                        onChange={e => updateForm('name', e.target.value)} 
                                        placeholder="e.g. Maha Ganapathy Homam" 
                                    />
                                    <div className="grid grid-cols-2 gap-6">
                                        <ModernInput 
                                            label="Service Magnitude (₹)" 
                                            type="number" 
                                            value={formData.amount} 
                                            error={errors.amount}
                                            success={formData.amount >= 1}
                                            onChange={e => updateForm('amount', e.target.value)} 
                                            placeholder="0.00" 
                                            icon={IndianRupee}
                                        />
                                        <ModernInput 
                                            label="Duration Log (Min)" 
                                            type="number" 
                                            value={formData.duration_minutes} 
                                            onChange={e => updateForm('duration_minutes', e.target.value)} 
                                            placeholder="30" 
                                            icon={Clock}
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50">
                                    <button type="submit" className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                                        {editingId ? "Finalize Updates" : "Initialize Service"}
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${colors[color]}`}><Icon size={18} /></div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
        </div>
    );
}
