import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { 
    Gem, 
    Calendar, 
    AlertTriangle, 
    CheckCircle2, 
    Search, 
    Plus, 
    History,
    MapPin,
    User,
    ArrowUpRight,
    Wrench,
    Database,
    Zap,
    Layers,
    ArrowRight,
    SearchCode,
    Activity
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AssetPage = () => {
    const { t } = useTranslation();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await api.get("/assets/registry/");
            setAssets(res.data.results || res.data || []);
        } catch (err) {
            console.error("Error fetching assets:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssets = Array.isArray(assets) ? assets.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.asset_id.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const getStatusColor = (status) => {
        switch(status) {
            case 'healthy': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'maintenance': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'damaged': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const totalValuation = filteredAssets.reduce((acc, curr) => acc + parseFloat(curr.valuation || 0), 0);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
                            <Gem size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Asset Legacy</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Database size={10} className="text-primary" /> Permanent Endowment Registry
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Query Tracking Vector..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-14 pr-6 rounded-xl bg-white border border-slate-100 focus:ring-4 focus:ring-slate-50 outline-none text-[11px] font-bold transition-all shadow-inner"
                        />
                    </div>
                    <button className="h-11 px-6 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2.5">
                        <History size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Logs</span>
                    </button>
                    <button className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95">
                        <Plus size={18} /> Register Property
                    </button>
                </div>
            </header>

            {/* Core Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <MetricCard 
                    label="Portfolio Valuation" 
                    value={`₹${totalValuation.toLocaleString('en-IN')}`} 
                    icon={Activity} 
                    trend="VERIFIED" 
                    color="slate" 
                    subtext="Consolidated Endowment Value" 
                />
                <MetricCard 
                    label="Critical Alert" 
                    value={filteredAssets.filter(a => a.is_overdue).length} 
                    icon={AlertTriangle} 
                    trend="OVERDUE" 
                    color="primary" 
                    subtext="Units Requiring Service" 
                />
                <MetricCard 
                    label="Healthy Units" 
                    value={filteredAssets.filter(a => !a.is_overdue).length} 
                    icon={CheckCircle2} 
                    trend="SYNCED" 
                    color="emerald" 
                    subtext="Active Protocol Records" 
                />
            </div>

            {/* Asset Ledger */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group mx-4 md:mx-0">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <div>
                        <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                            <Layers size={16} className="text-slate-900" /> Administrative Property Ledger
                        </h2>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Comprehensive registry of high-value temple endowments</p>
                    </div>
                    <div className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <SearchCode size={16} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Asset Identity</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Protocol State</th>
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Deployment Node</th>
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Service Lifecycle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="4" className="py-32 text-center text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Initializing Security Uplink...</td></tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr><td colSpan="4" className="py-24 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Registry Empty: No Property Recorded</td></tr>
                            ) : filteredAssets.map(asset => (
                                <tr key={asset.id} className="group/row hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-white scale-90 group-hover/row:scale-100 transition-transform shadow-lg shadow-slate-900/20">
                                                <Gem size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">{asset.name}</p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                                                    {asset.asset_id} • {asset.category_name || 'Generic'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getStatusColor(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-800 uppercase tracking-widest">
                                                <MapPin size={10} className="text-primary" /> {asset.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                                                <User size={10} /> {asset.custodian || 'Unassigned'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            {asset.is_overdue ? (
                                                <div className="flex items-center gap-1.5 text-red-500 text-[8px] font-black uppercase tracking-widest border border-red-100 bg-red-50/50 px-2 py-0.5 rounded">
                                                    <AlertTriangle size={12} className="animate-pulse" /> Overdue
                                                </div>
                                            ) : (
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                    Due {asset.next_due}
                                                </div>
                                            )}
                                            <button className="flex items-center gap-1.5 text-[8px] font-black text-slate-900 uppercase tracking-widest hover:text-primary transition-colors group/btn">
                                                Re-Certify <ArrowRight size={10} />
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
                        Primary Property Registry Synchronization Portal <ArrowUpRight size={12} />
                    </button>
                </div>
            </div>
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
                <p className={`text-[8px] font-black mt-3 uppercase tracking-widest flex items-center gap-2 ${isSlate ? 'text-white/20' : 'text-slate-300'}`}>
                    <Database size={10} /> {subtext}
                </p>
            </div>
        </div>
    );
}

export default AssetPage;
