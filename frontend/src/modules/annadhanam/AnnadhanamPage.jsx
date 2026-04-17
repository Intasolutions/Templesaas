import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { Utensils, Info, Plus, History, Package, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const AnnadhanamPage = () => {
    const { t } = useTranslation();
    const [consumptions, setConsumptions] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        prasad_name: "",
        item: "",
        quantity_used: "",
        notes: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRes, iRes] = await Promise.all([
                api.get("/annadhanam/consumptions/"),
                api.get("/inventory/items/")
            ]);
            setConsumptions(cRes.data.results || cRes.data || []);
            setItems(iRes.data.results || iRes.data || []);
        } catch (err) {
            console.error("Error fetching Annadhanam data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/annadhanam/consumptions/", formData);
            setFormData({ prasad_name: "", item: "", quantity_used: "", notes: "" });
            setShowForm(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Error recording consumption. Check stock levels.");
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4 md:px-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Utensils size={16} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                            Annadhanam Ops
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Ritual feast production & resource ledger
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="h-10 px-6 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-widest text-[9px] hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> Record Production
                </button>
            </header>

            {showForm && (
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 mx-4 md:mx-0">
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={12} /> Resource Allocation Protocol
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Batch Name</label>
                            <input 
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-lg h-9 px-4 text-xs font-bold"
                                placeholder="e.g. Morning Bhog"
                                value={formData.prasad_name}
                                onChange={e => setFormData({...formData, prasad_name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Raw Material</label>
                            <select 
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-lg h-9 px-4 text-xs font-bold appearance-none"
                                value={formData.item}
                                onChange={e => setFormData({...formData, item: e.target.value})}
                            >
                                <option value="">Select Resource</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} ({item.current_stock} avail)</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                            <input 
                                required
                                type="number"
                                step="0.01"
                                className="w-full bg-slate-50 border border-slate-100 rounded-lg h-9 px-4 text-xs font-bold"
                                placeholder="0.00"
                                value={formData.quantity_used}
                                onChange={e => setFormData({...formData, quantity_used: e.target.value})}
                            />
                        </div>
                        <div className="flex items-end">
                            <button 
                                type="submit"
                                className="w-full h-9 rounded-lg bg-slate-900 text-white font-bold text-[9px] uppercase tracking-widest hover:bg-slate-800"
                            >
                                Authorize
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50/50 border border-orange-100 rounded-xl">
                        <AlertCircle className="text-orange-500 shrink-0" size={12} />
                        <p className="text-[8px] font-bold uppercase tracking-widest text-orange-600 leading-relaxed">
                            WARNING: Authorizing this batch will immediately subtract units from the inventory ledger.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <History size={12} /> Consumption History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Batch/Date</th>
                                        <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                                        <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Consumption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" className="px-6 py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">Syncing with Ledger...</td></tr>
                                    ) : consumptions.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">No consumption records found</td></tr>
                                    ) : consumptions.map(c => (
                                        <tr key={c.id} className="border-b border-slate-50">
                                            <td className="px-6 py-5">
                                                <div className="text-xs font-bold text-slate-900 uppercase">{c.prasad_name}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">{c.date}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Package size={12} className="text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-700 uppercase">{c.item_name || 'Stock Resource'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right font-mono font-bold text-red-500 text-sm">
                                                -{c.quantity_used}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden shadow-2xl shadow-slate-900/40 border border-slate-800">
                        <h4 className="text-[8px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Real-time Stock Audit</h4>
                        <div className="space-y-4">
                            {items.slice(0, 5).map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{item.name}</span>
                                    <span className={`text-[10px] font-bold uppercase ${item.current_stock < 10 ? 'text-red-400' : 'text-slate-100'}`}>
                                        {item.current_stock} {item.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnadhanamPage;
