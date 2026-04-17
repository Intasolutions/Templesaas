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
    Lock,
    Edit3,
    Trash2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "../../components/common/Pagination";
import { useDebounce } from "../../shared/hooks/useDebounce";

const AssetPage = () => {
    const { t } = useTranslation();
    const { checkPermission } = useAuth();
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [showModal, setShowModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [assetHistory, setAssetHistory] = useState([]);
    const [selectedAssetForHistory, setSelectedAssetForHistory] = useState(null);
    const [newCatName, setNewCatName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [pagination, setPagination] = useState({
        current: 1,
        count: 0,
        next: null,
        previous: null
    });

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
        fetchAssets(1);
        fetchCategories();
    }, [debouncedSearch]);

    const fetchAssets = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page });
            if (debouncedSearch) params.append("search", debouncedSearch);

            const res = await api.get(`/assets/registry/?${params}`);
            const data = res.data;
            
            if (data.results) {
                setAssets(data.results);
                setPagination({
                    current: page,
                    count: data.count,
                    next: data.next,
                    previous: data.previous
                });
            } else {
                setAssets(Array.isArray(data) ? data : []);
                setPagination(prev => ({ ...prev, count: data.length || 0, current: page }));
            }
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
            if (editingAsset) {
                await api.put(`/assets/registry/${editingAsset.id}/`, formData);
            } else {
                await api.post("/assets/registry/", formData);
            }
            setShowModal(false);
            setEditingAsset(null);
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
            alert("Security Violation: Action rejected by backend server.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRecertify = async (assetId) => {
        if (!navigator.geolocation) {
            alert("SECURITY ALERT: Geolocation is required for protocol re-certification. Please use a modern browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                await api.post("/assets/maintenance/", {
                    asset: assetId,
                    activity: "Secure ritual verification with location authentication.",
                    performer: "Administrative Staff",
                    latitude: latitude,
                    longitude: longitude
                });
                fetchAssets();
            } catch (err) {
                console.error("Certification Failure:", err);
                alert("Security Protocol Error: Verification failed.");
            }
        }, (error) => {
            alert("SECURITY RESTRICTION: You must enable location services to verify the physical presence of the asset. Action aborted.");
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    };

    const handleDelete = async (assetId) => {
        if (!window.confirm("SECURITY ALERT: Permanent deletion of asset record. Continue?")) return;
        try {
            await api.delete(`/assets/registry/${assetId}/`);
            fetchAssets();
        } catch (err) {
            console.error("Deletion Failure:", err);
            alert("Security Error: Record is locked or protected.");
        }
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name,
            asset_id: asset.asset_id,
            category: asset.category,
            valuation: asset.valuation,
            location: asset.location,
            custodian: asset.custodian,
            description: asset.description,
            status: asset.status
        });
        setShowModal(true);
    };

    const handleViewHistory = async (asset) => {
        setSelectedAssetForHistory(asset);
        setShowHistoryModal(true);
        // Reset history before fetch to show loading state if needed
        setAssetHistory([]); 
        try {
            const response = await api.get(`/assets/maintenance/?asset=${asset.id}`);
            // Handle DRF pagination: check for .results first
            const data = response.data.results || response.data || [];
            setAssetHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("History Fetch Failure:", err);
            setAssetHistory([]);
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
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Asset Legacy</h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
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
                            <Layers size={16} /> <span className="text-[9px] font-bold uppercase tracking-widest">Classifications</span>
                        </button>
                    )}
                    {checkPermission('assets', 'edit') && (
                        <button 
                            onClick={() => setShowModal(true)}
                            className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95"
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
                        <h2 className="text-[10px] font-bold text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                            <Layers size={16} className="text-slate-900" /> Administrative Property Ledger
                        </h2>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">Comprehensive registry of high-value temple endowments</p>
                    </div>
                    <div className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <SearchCode size={16} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">Asset Identity</th>
                                <th className="px-8 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Protocol State</th>
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">Deployment Node</th>
                                <th className="px-8 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Economic Value</th>
                                <th className="px-10 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Service Lifecycle</th>
                                <th className="px-6 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-32 text-center text-[10px] font-bold text-slate-200 uppercase tracking-[0.5em] animate-pulse">Initializing Security Uplink...</td></tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Registry Empty: No Property Recorded</td></tr>
                            ) : filteredAssets.map(asset => (
                                <tr key={asset.id} className="group/row hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-white scale-90 group-hover/row:scale-100 transition-transform shadow-lg shadow-slate-900/20">
                                                <Gem size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 tracking-tighter uppercase leading-none">{asset.name}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                                                    {asset.asset_id} • {asset.category_name || 'Generic'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-lg border text-[8px] font-bold uppercase tracking-widest ${getStatusColor(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-800 uppercase tracking-widest">
                                                <MapPin size={10} className="text-primary" /> {asset.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                                                <User size={10} /> {asset.custodian || 'Unassigned'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="text-[12px] font-bold text-slate-900 tracking-tight">
                                            ₹{parseFloat(asset.valuation || 0).toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                                            Market Est.
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                                {asset.next_due ? `Due ${asset.next_due}` : 'No Service Date'}
                                            </div>
                                            {checkPermission('assets', 'edit') && (
                                                <button 
                                                    onClick={() => handleRecertify(asset.id)}
                                                    className="flex items-center gap-1.5 text-[8px] font-bold text-slate-900 uppercase tracking-widest hover:text-primary transition-colors group/btn"
                                                >
                                                    Re-Certify <ArrowRight size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 border-l border-slate-50">
                                        <div className="flex items-center justify-center gap-3">
                                            {checkPermission('assets', 'edit') && (
                                                <button onClick={() => handleEdit(asset)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                                                    <Edit3 size={12} />
                                                </button>
                                            )}
                                            <button onClick={() => handleViewHistory(asset)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                                                <History size={12} />
                                            </button>
                                            {checkPermission('assets', 'delete') && (
                                                <button onClick={() => handleDelete(asset.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-600 transition-all">
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                    <Pagination 
                        currentPage={pagination.current} 
                        totalPages={Math.ceil(pagination.count / 10) || 1} 
                        onPageChange={fetchAssets} 
                        count={pagination.count} 
                        pageSize={10} 
                    />
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
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tighter uppercase">New Asset Entry</h2>
                                    <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-1">Initialize tracking for a new endowment</p>
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
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Classification</label>
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
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description / Details</label>
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
                                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-black transition-all disabled:opacity-50"
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
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Classifications</h2>
                                    <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-2">Manage asset groupings</p>
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
                                    className="h-12 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {categories.length === 0 ? (
                                    <p className="text-center py-10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Classifications Defined</p>
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
                            className="w-full h-14 border border-slate-100 text-slate-400 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all mt-8"
                        >
                            Close Manager
                        </button>
                    </motion.div>
                </div>
            )}
            {/* Audit History Modal */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        className="w-full max-w-md bg-white h-full overflow-hidden shadow-2xl flex flex-col rounded-l-3xl border-l border-slate-100"
                    >
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none">Audit Ledger</h3>
                                <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-wider">{selectedAssetForHistory?.name}</p>
                            </div>
                            <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8">
                            {assetHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-40">
                                    <History size={40} className="text-slate-200" />
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-4">No protocol records found</p>
                                </div>
                            ) : (
                                <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-slate-100">
                                    {assetHistory.map((log, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="absolute -left-[30px] top-1 w-2 h-2 rounded-full border-2 border-white bg-slate-900 shadow-sm" />
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                        {new Date(log.service_date).toLocaleDateString('en-GB')} • {new Date(log.service_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        {log.latitude && (
                                                            <a 
                                                                href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="px-1.5 py-0.5 bg-emerald-50 rounded flex items-center gap-1 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100"
                                                                title={`Lat: ${log.latitude}, Lon: ${log.longitude}`}
                                                            >
                                                                <MapPin size={8} /> <span className="text-[7px] font-bold uppercase tracking-tighter">Loc Verified</span>
                                                            </a>
                                                        )}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-full">{log.performer}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-50 pl-3 py-1">
                                                    "{log.activity}"
                                                </p>
                                                {log.cost > 0 && (
                                                    <div className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">₹{log.cost} Expenditure</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

function FormGroup({ label, value, onChange, placeholder, type = "text", required = false }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{label}</label>
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
                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${isSlate ? 'bg-primary text-white shadow-lg shadow-primary/20' : colors[color]}`}>
                        {trend}
                    </div>
                </div>
                <p className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isSlate ? 'text-white/40' : 'text-slate-400'}`}>{label}</p>
                <h3 className={`text-2xl font-bold mt-2 tracking-tighter leading-none ${isSlate ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
                <p className={`text-[8px] font-bold mt-3 uppercase tracking-widest flex items-center gap-2 ${isSlate ? 'text-white/20' : 'text-slate-300'}`}>
                    <Database size={10} /> {subtext}
                </p>
            </div>
        </div>
    );
}

export default AssetPage;
