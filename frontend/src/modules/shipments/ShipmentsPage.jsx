import { useState, useEffect, useMemo } from "react";
import api from "../../shared/api/client";
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
    Box
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

export default function ShipmentsPage() {
    const { t } = useTranslation();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const pageSize = 12;

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/shipments/", { 
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

    useEffect(() => {
        fetchShipments();
    }, [page, statusFilter]);

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

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Logistics Command</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Database size={10} className="text-primary" /> E-Prasad Distribution Node
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Query Vessel ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="h-11 pl-12 pr-6 bg-white border border-slate-100 rounded-xl w-64 md:w-72 text-xs font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-50 transition-all placeholder:text-slate-200 shadow-inner"
                        />
                    </div>
                    <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-100 shadow-inner">
                        {['all', 'pending', 'dispatched', 'delivered'].map((s) => (
                            <button 
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 h-9 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? "bg-white text-slate-900 shadow-sm border border-slate-50" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Logistics Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <InsightCard label="Active Transit" value={shipments.filter(s => s.status === 'dispatched').length} subtext="Global Payload Status" icon={Navigation} color="indigo" />
                <InsightCard label="Pending Prep" value={shipments.filter(s => s.status === 'pending').length} subtext="Resource Allocation Queue" icon={Box} color="amber" />
                <InsightCard label="System Integrity" value="99.9%" subtext="Network Efficiency Node" icon={ShieldCheck} color="emerald" />
            </div>

            {/* Data Ledger */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0">
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
                                                    {s.booking?.pooja_name || "Seva Prasad Protocol"}
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
                                            <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 active:scale-90 transition-all">
                                                <Edit3 size={14} />
                                            </button>
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
        </div>
    );
}

function InsightCard({ label, value, subtext, icon: Icon, color }) {
    const colors = {
        indigo: "bg-indigo-50 text-indigo-500",
        amber: "bg-amber-50 text-amber-500",
        emerald: "bg-emerald-50 text-emerald-500",
        slate: "bg-slate-100 text-slate-400"
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group hover:shadow-2xl hover:shadow-slate-100 transition-all relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.06] transition-all duration-700 text-slate-900">
                <Icon size={100} />
            </div>
            <div className="relative z-10 flex items-start gap-5">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${colors[color]}`}>
                    <Icon size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                   <p className="text-2xl font-black text-slate-900 mt-2 tracking-tighter leading-none">{value}</p>
                   <div className="flex items-center gap-2 mt-4 text-[8px] font-black uppercase tracking-widest text-slate-400">
                      {subtext} <ArrowRight size={10} className="text-primary group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
            </div>
        </div>
    );
}
