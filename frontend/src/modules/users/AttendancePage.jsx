import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { 
    Clock, 
    CheckCircle2, 
    AlertTriangle, 
    Search, 
    Calendar,
    MapPin,
    ArrowUpRight,
    Filter,
    Database,
    Zap,
    Layers,
    ArrowRight,
    Fingerprint
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ClockInModal from "../users/ClockInModal";
import { motion } from "framer-motion";

const AttendancePage = () => {
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showClockIn, setShowClockIn] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users/attendance/");
            setLogs(res.data.results || res.data || []);
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = Array.isArray(logs) ? logs.filter(log => 
        log.username?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Arrival Matrix</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Database size={10} className="text-primary" /> Real-time Presence Monitoring
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Query Identity Log..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-14 pr-6 rounded-xl bg-white border border-slate-100 focus:ring-4 focus:ring-slate-50 outline-none text-[11px] font-bold transition-all shadow-inner"
                        />
                    </div>
                    <button 
                        onClick={() => setShowClockIn(true)}
                        className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95"
                    >
                        Personnel Protocol
                    </button>
                </div>
            </header>

            {/* Presence Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <MetricCard 
                    label="Validated Access" 
                    value={filteredLogs.filter(l => l.is_verified).length} 
                    icon={CheckCircle2} 
                    trend="SECURE" 
                    color="emerald" 
                    subtext="Verified Spatial Node Entries" 
                />
                <MetricCard 
                    label="Flagged Access" 
                    value={filteredLogs.filter(l => !l.is_verified).length} 
                    icon={AlertTriangle} 
                    trend="RISK" 
                    color="primary" 
                    subtext="Unverified Authentication Attempts" 
                />
                <MetricCard 
                    label="Active Cycle" 
                    value="Alpha" 
                    icon={Calendar} 
                    trend="CURRENT" 
                    color="slate" 
                    subtext="Operational Shift Status" 
                />
            </div>

            {/* Attendance Ledger */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group mx-4 md:mx-0">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/20">
                    <div>
                        <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                            <Layers size={16} className="text-slate-900" /> Personnel Identification Ledger
                        </h2>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Monitoring personnel check-ins and verified geolocation vectors</p>
                    </div>
                    <button className="h-10 px-5 rounded-xl border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2">
                        <Filter size={12} /> Filter Cycle
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Personnel Hub</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Security State</th>
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Spatial Telemetry</th>
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Time Ledger</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="4" className="py-32 text-center text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Establishing Logic Connection...</td></tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr><td colSpan="4" className="py-24 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No presence recorded in current operational cycle</td></tr>
                            ) : filteredLogs.map(log => (
                                <tr key={log.id} className="group/row hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover/row:bg-slate-900 group-hover/row:text-white transition-all shadow-inner uppercase text-sm">
                                                {log.username?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">{log.username}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">{log.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        {log.is_verified ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={10} /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 text-red-500 border border-red-100 text-[8px] font-black uppercase tracking-widest">
                                                <AlertTriangle size={10} className="animate-pulse" /> Flagged
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                                                <MapPin size={10} className="text-primary" /> {log.verification_method || 'GPS Uplink'}
                                            </div>
                                            {log.latitude && (
                                                <div className="text-[7px] font-black text-slate-300 uppercase tracking-tighter opacity-60">
                                                    COORD: {parseFloat(log.latitude).toFixed(4)}°N, {parseFloat(log.longitude).toFixed(4)}°E
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="font-black text-sm text-slate-900 tracking-tighter">
                                                {log.in_time} <span className="text-slate-200">/</span> {log.out_time || "--:--"}
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors group/btn">
                                                Audit <ArrowUpRight size={10} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                    <button className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-slate-900 transition-all flex items-center gap-3">
                        Personnel Presence Node Synchronization Portal <ArrowUpRight size={12} />
                    </button>
                </div>
            </div>

            <ClockInModal 
                isOpen={showClockIn} 
                onClose={() => setShowClockIn(false)} 
                onRefresh={fetchLogs} 
            />
        </div>
    );
};

function MetricCard({ label, value, icon: Icon, color, trend, subtext }) {
    const colors = {
        slate: "bg-slate-900 text-white shadow-xl shadow-slate-900/40",
        emerald: "bg-emerald-50 text-emerald-500 border border-emerald-100 shadow-inner",
        primary: "bg-primary/10 text-primary border border-primary/20 shadow-inner"
    };

    const isSlate = color === 'slate';

    return (
        <div className={`p-8 rounded-3xl transition-all relative overflow-hidden group ${isSlate ? colors.slate : 'bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100'}`}>
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform ${isSlate ? 'text-white' : 'text-slate-900'}`}><Icon size={48} /></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSlate ? 'bg-white/10 border border-white/10' : colors[color]} group-hover:rotate-12 transition-transform shadow-inner`}>
                        <Icon size={20} />
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${isSlate ? 'bg-primary text-white shadow-lg shadow-primary/20' : colors[color]}`}>
                        {trend}
                    </div>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${isSlate ? 'text-white/40' : 'text-slate-400'}`}>{label}</p>
                <h3 className={`text-2xl font-black mt-2 tracking-tighter leading-none ${isSlate ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
                <p className={`text-[8px] font-black mt-4 uppercase tracking-widest flex items-center gap-2 ${isSlate ? 'text-white/20' : 'text-slate-300'}`}>
                    <Database size={10} /> {subtext}
                </p>
            </div>
        </div>
    );
}

export default AttendancePage;
