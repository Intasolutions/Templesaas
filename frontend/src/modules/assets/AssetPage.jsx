import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
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
    Activity,
    Lock
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AssetPage = () => {
    const { t } = useTranslation();
    const { checkPermission } = useAuth();
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        asset_id: "",
        category: "",
        valuation: "",
        location: "",
        custodian: "",
        description: "",
        status: "healthy"
    });

    useEffect(() => {
        fetchAssets();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const res = await api.get("/assets/categories/");
            setCategories(res.data.results || res.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post("/assets/registry/", formData);
            setShowModal(false);
            setFormData({
                name: "",
                asset_id: "",
                category: "",
                valuation: "",
                location: "",
                custodian: "",
                description: "",
                status: "healthy"
            });
            fetchAssets();
        } catch (err) {
            console.error("Error saving asset:", err);
            alert("Security Violation: Could not register property. Check all mandatory fields.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRecertify = async (assetId) => {
        try {
            // Backend handles asset status update automatically via MaintenanceLog.save()
            await api.post("/assets/maintenance/", {
                asset: assetId,
                service_date: new Date().toISOString().split('T')[0],
                activity: "Standard ritual purification and verification.",
                performer: "Administrative Staff"
            });
            fetchAssets();
        } catch (err) {
            console.error("Certification Failure:", err);
            alert("Security Protocol Error: Could not log re-certification. Check backend constraints.");
        }
    };

    const filteredAssets = Array.isArray(assets) ? assets.filter(a => 
        (a.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.asset_id?.toLowerCase().includes(searchTerm.toLowerCase()))
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

    if (!checkPermission('assets', 'view')) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                    <Lock size={40} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Access Restricted</h1>
                <p className="max-w-md text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    You do not have the necessary privileges to access the Asset Registry. 
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
                    {checkPermission('assets', 'edit') && (
                        <button 
                            onClick={() => setShowCatModal(true)}
                            className="h-11 px-6 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2.5"
                        >
                            <Layers size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Classifications</span>
                        </button>
                    )}
                    {checkPermission('assets', 'edit') && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95"
                        >
                            <Plus size={18} /> Register Property
                        </button>
                    )}
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
                                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Economic Value</th>
                                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Service Lifecycle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-32 text-center text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Initializing Security Uplink...</td></tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Registry Empty: No Property Recorded</td></tr>
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
                                    <td className="px-8 py-6 text-right">
                                        <div className="text-[12px] font-black text-slate-900 tracking-tight">
                                            ₹{parseFloat(asset.valuation || 0).toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                            Market Est.
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                {asset.next_due ? `Due ${asset.next_due}` : 'No Service Date'}
                                            </div>
                                            {checkPermission('assets', 'edit') && (
                                                <button 
                                                    onClick={() => handleRecertify(asset.id)}
                                                    className="flex items-center gap-1.5 text-[8px] font-black text-slate-900 uppercase tracking-widest hover:text-primary transition-colors group/btn"
                                                >
                                                    Re-Certify <ArrowRight size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden p-10 border border-white/20"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">New Asset Entry</h2>
                                    <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mt-1">Initialize tracking for a new endowment</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                <Zap size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormGroup label="Asset Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="e.g. Golden Crown" required />
                                <FormGroup label="Internal tracking ID" value={formData.asset_id} onChange={v => setFormData({...formData, asset_id: v})} placeholder="TRS-2024-001" required />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</label>
                                    <select 
                                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-slate-900 text-[11px] font-bold outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <FormGroup label="Market Valuation (₹)" value={formData.valuation} onChange={v => setFormData({...formData, valuation: v})} placeholder="500000" type="number" required />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormGroup label="Deployment Node (Location)" value={formData.location} onChange={v => setFormData({...formData, location: v})} placeholder="Sanctum Sanctorum" required />
                                <FormGroup label="Designated Custodian" value={formData.custodian} onChange={v => setFormData({...formData, custodian: v})} placeholder="Head Priest" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description / Details</label>
                                <textarea 
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:border-slate-900 text-[11px] font-bold outline-none min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Enter intricate details of the asset..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-black transition-all disabled:opacity-50"
                            >
                                {isSaving ? "Authorizing Entry..." : "Finalize Registration"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Classification Manager Modal */}
            {showCatModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Layers size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Classifications</h2>
                                    <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mt-2">Manage asset groupings</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCatModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                <Zap size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="New Category (e.g. Ornaments)"
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                    className="flex-1 h-12 px-5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none text-[11px] font-bold"
                                />
                                <button 
                                    onClick={async () => {
                                        if(!newCatName) return;
                                        try {
                                            await api.post("/assets/categories/", { name: newCatName });
                                            setNewCatName("");
                                            fetchCategories();
                                        } catch(err) { console.error(err); }
                                    }}
                                    className="h-12 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {categories.length === 0 ? (
                                    <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">No Classifications Defined</p>
                                ) : categories.map(cat => (
                                    <div key={cat.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{cat.name}</span>
                                        <button 
                                            onClick={async () => {
                                                if(confirm("Expunge category? Assets in this category will become unclassified.")) {
                                                    try {
                                                        await api.delete(`/assets/categories/${cat.id}/`);
                                                        fetchCategories();
                                                    } catch(err) { console.error(err); }
                                                }
                                            }}
                                            className="h-8 w-8 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white"
                                        >
                                            <Zap size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowCatModal(false)}
                            className="w-full h-14 border border-slate-100 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all mt-8"
                        >
                            Close Manager
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

function FormGroup({ label, value, onChange, placeholder, type = "text", required = false }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{label}</label>
            <input 
                type={type}
                required={required}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 px-5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none text-[11px] font-bold"
            />
        </div>
    );
}

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
