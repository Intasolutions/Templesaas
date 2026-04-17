import { useState, useEffect, useMemo } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Truck, 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    Package, 
    CheckCircle2, 
    Clock, 
    Navigation, 
    ExternalLink,
    Filter,
    Edit3,
    Zap,
    ShieldCheck,
    Database,
    Layers,
    ArrowRight,
    MapPin,
    Box,
    Lock,
    X,
    RefreshCw,
    Plus
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

export default function ShipmentsPage() {
    const { t } = useTranslation();
    const { checkPermission } = useAuth();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);
    const [activeTab, setActiveTab] = useState('shipments'); // 'shipments' or 'registry'
    const [prasads, setPrasads] = useState([]);
    const [isPrasadModalOpen, setIsPrasadModalOpen] = useState(false);
    const [editingPrasad, setEditingPrasad] = useState(null);
    const [prasadForm, setPrasadForm] = useState({
        name: '',
        description: '',
        price: '',
        expiry_days: 30,
        is_active: true
    });
    
    const [form, setForm] = useState({
        status: 'pending',
        courier_partner: '',
        tracking_id: '',
        tracking_url: '',
        notes: ''
    });
    const pageSize = 12;

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/shipping/shipments/", { 
                params: { 
                    page, 
                    search: searchTerm,
                    status: statusFilter === 'all' ? '' : statusFilter
                } 
            });
            const data = res.data;
            setShipments(data.results || data || []);
            setCount(data.count || (Array.isArray(data) ? data.length : 0));
        } catch (err) {
            console.error("Failed to fetch shipments", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrasads = async () => {
        setLoading(true);
        try {
            const res = await api.get("/shipping/prasadam-items/");
            setPrasads(res.data.results || res.data || []);
        } catch (err) {
            console.error("Failed to fetch prasads", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (checkPermission('shipments', 'view')) {
            if (activeTab === 'shipments') fetchShipments();
            else fetchPrasads();
        } else {
            setLoading(false);
        }
    }, [page, statusFilter, activeTab, checkPermission]);

    const handleOpenPrasadModal = (p = null) => {
        if (p) {
            setEditingPrasad(p);
            setPrasadForm({
                name: p.name,
                description: p.description || '',
                price: p.price,
                expiry_days: p.expiry_days || 30,
                is_active: p.is_active
            });
        } else {
            setEditingPrasad(null);
            setPrasadForm({ name: '', description: '', price: '', expiry_days: 30, is_active: true });
        }
        setIsPrasadModalOpen(true);
    };

    const handlePrasadSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingPrasad) {
                await api.patch(`/shipping/prasadam-items/${editingPrasad.id}/`, prasadForm);
            } else {
                await api.post(`/shipping/prasadam-items/`, prasadForm);
            }
            setIsPrasadModalOpen(false);
            fetchPrasads();
            alert("Protocol Initialized: Item saved successfully.");
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || err.message || "Unknown error";
            alert(`Protocol Failure: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenEdit = (s) => {
        setEditingShipment(s);
        setForm({
            status: s.status,
            courier_partner: s.courier_partner || '',
            tracking_id: s.tracking_id || '',
            tracking_url: s.tracking_url || '',
            notes: s.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            await api.patch(`/shipping/shipments/${editingShipment.id}/`, form);
            setIsModalOpen(false);
            fetchShipments();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') fetchShipments();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return "bg-amber-50 text-amber-600 border-amber-100";
            case 'prepared': return "bg-blue-50 text-blue-600 border-blue-100";
            case 'dispatched': return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case 'delivered': return "bg-emerald-50 text-emerald-600 border-emerald-100";
            default: return "bg-slate-50 text-slate-400 border-slate-100";
        }
    };

    const totalPages = Math.ceil(count / pageSize) || 1;

    if (!checkPermission('shipments', 'view')) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                    <Lock size={40} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Access Restricted</h1>
                <p className="max-w-md text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    You do not have the necessary privileges to access the Logistics Command. 
                    Please contact your temple administrator for access.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">Logistics Center</h1>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">E-Prasad Distribution</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button onClick={() => setActiveTab('shipments')} className={`px-5 h-8 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'shipments' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                            Shipments
                        </button>
                        <button onClick={() => setActiveTab('registry')} className={`px-5 h-8 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'registry' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                            Inventory
                        </button>
                    </div>

                    {activeTab === 'shipments' ? (
                        <>
                            <div className="relative group">
                                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search shipments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl w-60 text-xs font-medium text-slate-900 outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </>
                    ) : (
                        <button onClick={() => handleOpenPrasadModal()} className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all">
                            <Plus size={14} /> Add Item
                        </button>
                    )}
                </div>
            </header>

            {/* Logistics Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <InsightCard label="Active Transit" value={shipments.filter(s => s.status === 'dispatched').length} subtext="Global Payload Status" icon={Navigation} color="indigo" />
                <InsightCard label="Pending Prep" value={shipments.filter(s => s.status === 'pending').length} subtext="Resource Allocation Queue" icon={Box} color="amber" />
                <InsightCard label="System Integrity" value="99.9%" subtext="Network Efficiency Node" icon={ShieldCheck} color="emerald" />
            </div>

            {/* Data Ledger */}
            {activeTab === 'shipments' ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0 transition-all">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Vessel Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Token</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">State</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-32 text-center text-[11px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Accessing Logistics Ledger...</td></tr>
                                ) : shipments.length === 0 ? (
                                    <tr><td colSpan="5" className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Grid Empty: No Active payloads</td></tr>
                                ) : shipments.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 text-[11px] tracking-tight uppercase leading-none">#{s.id.toString().padStart(6, '0')}</div>
                                                    <div className="text-[8px] font-black text-primary uppercase tracking-widest mt-1">
                                                        {s.booking_details?.prasadam_item_name || s.booking_details?.pooja_name || "Seva Prasad Protocol"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-tight leading-none">{s.recipient_name}</div>
                                                <div className="flex items-center gap-1 text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60 leading-none">
                                                    <MapPin size={8} />
                                                    <span className="truncate max-w-[150px]">{s.shipping_address}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {s.tracking_id ? (
                                                <div className="space-y-0.5">
                                                    <div className="text-[10px] font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit tracking-tighter uppercase">{s.tracking_id}</div>
                                                    <div className="text-[7px] text-slate-300 font-black uppercase tracking-widest ml-0.5">{s.courier_partner}</div>
                                                </div>
                                            ) : (
                                                 <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                                    <div className="h-1 w-1 rounded-full bg-slate-100" /> Standby
                                                 </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${getStatusBadge(s.status)}`}>
                                                <div className={`h-1 w-1 rounded-full ${s.status === 'delivered' ? 'bg-emerald-500' : 'bg-current animate-pulse'}`} />
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                                                {checkPermission('shipments', 'edit') && (
                                                    <button onClick={() => handleOpenEdit(s)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 active:scale-90 transition-all">
                                                        <Edit3 size={14} />
                                                    </button>
                                                )}
                                                {s.tracking_url && (
                                                    <a href={s.tracking_url} target="_blank" rel="noreferrer" className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/20 transition-all active:scale-90">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-3">
                            <Database size={12} /> Registry Index Payload • {count} Vessels
                        </div>
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={setPage} 
                            count={count} 
                            pageSize={pageSize} 
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0 transition-all animate-in fade-in slide-in-from-bottom-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50/50">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Item Node</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Shelf Life</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Valuation</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Integrity</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && prasads.length === 0 ? (
                                    <tr><td colSpan="5" className="py-32 text-center text-[11px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Syncing Inventory Index...</td></tr>
                                ) : prasads.length === 0 ? (
                                    <tr><td colSpan="5" className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">Registry Empty: Add initial prasad nodes</td></tr>
                                ) : prasads.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                    <Box size={18} />
                                                </div>
                                                <div className="font-black text-slate-900 text-[11px] tracking-tight uppercase leading-none">{p.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest truncate max-w-[250px]">
                                                {p.description || "No Protocol defined"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                                                {p.expiry_days} Days
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs font-black text-slate-900">₹{p.price}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${p.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                {p.is_active ? 'Active Node' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => handleOpenPrasadModal(p)} className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-90 shadow-sm">
                                                <Edit3 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Footer Stats Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-12 pt-10 border-t border-slate-50">
                <div className="flex items-center gap-4 group">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <Zap size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Uplink</p>
                        <p className="text-xs font-bold text-slate-900 uppercase">Synchronized</p>
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="flex items-center gap-4 group">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Latency</p>
                        <p className="text-xs font-bold text-slate-900 uppercase">12ms</p>
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="flex items-center gap-4 group">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Cycle</p>
                        <p className="text-xs font-bold text-slate-900 uppercase">60s Polling</p>
                    </div>
                </div>
            </div>

            {/* Update Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !submitting && setIsModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-xl flex flex-col overflow-hidden border border-slate-100">
                            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                                        <Zap size={14} className="animate-pulse" /> Finalize Logistics Protocol
                                    </p>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Vessel Deployment</h2>
                                    <p className="text-[10px] font-medium text-slate-400 mt-2 uppercase tracking-widest whitespace-nowrap">Authorize shipment to {editingShipment?.recipient_name}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white text-slate-400 border border-transparent hover:border-slate-200 transition-all shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="p-10 space-y-8 bg-white">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lifecycle State</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
                                        {['pending', 'prepared', 'dispatched', 'delivered'].map((s) => (
                                            <button 
                                                key={s} type="button" 
                                                onClick={() => setForm({...form, status: s})}
                                                className={`h-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${form.status === s ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-white/50"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Courier Partner</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Layers size={14} /></div>
                                            <input 
                                                value={form.courier_partner} onChange={(e) => setForm({...form, courier_partner: e.target.value})}
                                                className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                                                placeholder="e.g. BlueDart" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tracking ID (Logistics Token)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Zap size={14} /></div>
                                            <input 
                                                value={form.tracking_id} onChange={(e) => setForm({...form, tracking_id: e.target.value})}
                                                className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white transition-all shadow-inner uppercase" 
                                                placeholder="AWB12345678" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tracking URL</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><ExternalLink size={14} /></div>
                                        <input 
                                            type="url" value={form.tracking_url} onChange={(e) => setForm({...form, tracking_url: e.target.value})}
                                            className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-indigo-600 outline-none focus:bg-white transition-all shadow-inner lowercase" 
                                            placeholder="https://tracker.com/awb123" 
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={submitting} className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-4 group">
                                    {submitting ? <RefreshCw className="animate-spin" size={20} /> : (
                                        <>
                                            Execute Deployment <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Prasadam Registry Modal */}
            <AnimatePresence>
                {isPrasadModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !submitting && setIsPrasadModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-lg flex flex-col overflow-hidden border border-slate-100">
                            <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                                        <Box size={14} /> Inventory Registry
                                    </p>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{editingPrasad ? 'Update Node' : 'Initialize Node'}</h2>
                                </div>
                                <button onClick={() => setIsPrasadModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white text-slate-400 border border-transparent hover:border-slate-200 transition-all shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handlePrasadSubmit} className="p-10 space-y-6 bg-white">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Prasadam Name</label>
                                    <input 
                                        required value={prasadForm.name} onChange={(e) => setPrasadForm({...prasadForm, name: e.target.value})}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner text-xs" 
                                        placeholder="e.g. Mahaprasadam Ladoo"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Valuation (Price)</label>
                                        <input 
                                            type="number" required value={prasadForm.price} onChange={(e) => setPrasadForm({...prasadForm, price: e.target.value})}
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner text-xs" 
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Shelf Life (Days)</label>
                                        <input 
                                            type="number" required value={prasadForm.expiry_days} onChange={(e) => setPrasadForm({...prasadForm, expiry_days: e.target.value})}
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner text-xs" 
                                            placeholder="30"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Protocol Description</label>
                                    <textarea 
                                        rows={3} value={prasadForm.description} onChange={(e) => setPrasadForm({...prasadForm, description: e.target.value})}
                                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner text-xs resize-none" 
                                        placeholder="Enter item details..."
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        type="button" onClick={() => setPrasadForm({...prasadForm, is_active: !prasadForm.is_active})}
                                        className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${prasadForm.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                    >
                                        {prasadForm.is_active ? 'Active' : 'Offline'}
                                    </button>
                                </div>

                                <button type="submit" disabled={submitting} className="w-full h-14 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-4">
                                    {submitting ? <RefreshCw className="animate-spin" size={16} /> : (editingPrasad ? 'Commit Changes' : 'Initialize Protocol')}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InsightCard({ label, value, subtext, icon: Icon, color }) {
    const colors = {
        indigo: "text-indigo-600 bg-indigo-50",
        amber: "text-amber-600 bg-amber-50",
        emerald: "text-emerald-600 bg-emerald-50",
        slate: "text-slate-600 bg-slate-50"
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:border-primary/20">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-xl font-bold text-slate-900 leading-none mt-1">{value}</p>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1">{subtext}</p>
            </div>
        </div>
    );
}
