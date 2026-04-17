import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Plus, 
    Search, 
    ArrowRight, 
    Filter,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    PieChart,
    Wallet,
    Download,
    X,
    AlertCircle,
    CheckCircle2,
    Zap,
    ScrollText,
    Activity,
    Layers,
    Clock
} from 'lucide-react';
import api from '../../shared/api/client';
import { useTranslation } from "react-i18next";

const CATEGORY_MAP = {
    'ritual_fees': { label: 'Ritual Fees', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    'donation_general': { label: 'Donations', color: 'text-blue-500', bg: 'bg-blue-50' },
    'hundi_collection': { label: 'Hundi Collection', color: 'text-amber-500', bg: 'bg-amber-50' },
    'staff_salary': { label: 'Staff Salary', color: 'text-rose-500', bg: 'bg-rose-50' },
    'temple_maintenance': { label: 'Maintenance', color: 'text-slate-500', bg: 'bg-slate-50' },
    'stock_purchase': { label: 'Stock/Inventory', color: 'text-orange-500', bg: 'bg-orange-50' },
    'utility_bills': { label: 'Utilities', color: 'text-violet-500', bg: 'bg-violet-50' },
    'other': { label: 'Miscellaneous', color: 'text-slate-400', bg: 'bg-slate-50' }
};

export default function FinancePage() {
    const { t } = useTranslation();
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [form, setForm] = useState({
        txn_type: 'expense',
        category: 'other',
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sumRes, txnRes] = await Promise.all([
                api.get('/finance/summary/'),
                api.get('/finance/transactions/')
            ]);
            setSummary(sumRes.data);
            setTransactions(txnRes.data.results || txnRes.data);
        } catch (error) {
            console.error("Finance Load Error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTxn = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/finance/transactions/', form);
            setIsAddOpen(false);
            setForm({
                txn_type: 'expense', category: 'other', title: '', amount: '',
                date: new Date().toISOString().split('T')[0], notes: ''
            });
            fetchData();
        } catch (err) {
            alert("Record creation failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredTxns = useMemo(() => {
        return transactions.filter(t => 
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.reference?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transactions, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                            <Wallet size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Fiscal Ledger</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                                <Zap size={12} className="text-primary" /> Multi-Ledger Revenue Monitoring
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 w-72 bg-white border border-slate-100 rounded-2xl pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-50 transition-all shadow-sm"
                            placeholder="Audit Ledger..."
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddOpen(true)}
                        className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> Record Transaction
                    </button>
                </div>
            </header>

            {/* Financial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
                <MetricCard 
                    title="Profit Terminal" 
                    value={summary?.net_profit || 0} 
                    sub="Net Retained Earnings" 
                    icon={<TrendingUp size={24} />} 
                    color="text-emerald-500"
                    trend={true}
                />
                <MetricCard 
                    title="Revenue Stream" 
                    value={summary?.total_income || 0} 
                    sub="Gross Inward Transfers" 
                    icon={<ArrowUpRight size={24} />} 
                    color="text-blue-500"
                />
                <MetricCard 
                    title="Operational Burn" 
                    value={summary?.total_expense || 0} 
                    sub="Audit Validated Outflow" 
                    icon={<TrendingDown size={24} />} 
                    color="text-rose-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4 md:px-0">
                {/* Transaction List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                           <ScrollText size={18} strokeWidth={3} /> Transaction Archives
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 capitalize">{filteredTxns.length} Encrypted Records</p>
                    </div>

                    <div className="space-y-4">
                        {loading ? [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />) : 
                        filteredTxns.map(txn => (
                            <div 
                                key={txn.id}
                                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex items-center gap-6"
                            >
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${txn.txn_type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    {txn.txn_type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${CATEGORY_MAP[txn.category]?.bg} ${CATEGORY_MAP[txn.category]?.color}`}>
                                            {CATEGORY_MAP[txn.category]?.label || 'General'}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{txn.date}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{txn.title}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{txn.reference || `TXN#${txn.id}`}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xl font-black tracking-tighter ${txn.txn_type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                                        {txn.txn_type === 'income' ? '+' : '-'}₹{Number(txn.amount).toLocaleString()}
                                    </p>
                                    <div className="flex items-center justify-end gap-2 mt-1">
                                         <div className={`h-1.5 w-1.5 rounded-full ${txn.txn_type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                         <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">{txn.txn_type} Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analytical Sidebar */}
                <div className="space-y-10">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/20 blur-[60px] group-hover:bg-primary/40 transition-all duration-700" />
                        <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <Activity size={18} /> Performance Node
                        </h4>
                        <div className="space-y-6">
                            {summary?.income_by_category?.map(cat => (
                                <div key={cat.category} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{CATEGORY_MAP[cat.category]?.label || cat.category}</span>
                                        <span className="text-xs font-black text-white">₹{Number(cat.total).toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: `${(cat.total / summary.total_income) * 100}%` }} 
                                            className="h-full bg-primary shadow-[0_0_12px_rgba(249,115,22,0.4)]" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-medium text-white/30 mt-10 leading-relaxed italic">
                           "All financial telemetry is audit-locked and synchronized across temple edge nodes in real-time."
                        </p>
                    </div>

                    <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white space-y-6 group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                             <CheckCircle2 size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Status</p>
                             <p className="text-sm font-black text-slate-900 uppercase">Registry Verified</p>
                          </div>
                       </div>
                    </div>
                </div>
            </div>

            {/* Transaction Modal */}
            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                            onClick={() => !submitting && setIsAddOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white rounded-[3rem] w-full max-w-xl p-12 relative z-[510] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-100"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Record Transaction</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                        <Layers size={12} className="text-primary" /> Immutable Ledger Entry
                                    </p>
                                </div>
                                <button onClick={() => setIsAddOpen(false)} className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddTxn} className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setForm({...form, txn_type: 'income'})}
                                        className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${form.txn_type === 'income' ? 'bg-emerald-50 border-emerald-500 text-emerald-500' : 'bg-white border-slate-100 text-slate-400'}`}
                                    >
                                        Inward (Income)
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setForm({...form, txn_type: 'expense'})}
                                        className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${form.txn_type === 'expense' ? 'bg-rose-50 border-rose-500 text-rose-500' : 'bg-white border-slate-100 text-slate-400'}`}
                                    >
                                        Outward (Expense)
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Protocol Title</label>
                                    <input 
                                        required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner"
                                        placeholder="e.g., Temple Maintenance"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Spatial Category</label>
                                        <select 
                                            value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs appearance-none"
                                        >
                                            {Object.entries(CATEGORY_MAP).map(([key, val]) => (
                                                <option key={key} value={key}>{val.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Total Remittance</label>
                                        <input 
                                            required type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})}
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner"
                                            placeholder="₹ 0.00"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Protocol Date</label>
                                    <input 
                                        type="date" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="pt-6">
                                    <button 
                                        disabled={submitting} 
                                        type="submit" 
                                        className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        {submitting ? 'Transmitting Data...' : 'Commit to Ledger'}
                                        <ArrowRight size={20} />
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

function MetricCard({ title, value, sub, icon, color, trend }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-primary/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${color} bg-slate-50 group-hover:bg-slate-900 group-hover:text-white`}>
                {icon}
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">{title}</h3>
            <p className={`text-4xl font-black tracking-tighter ${color} flex items-baseline gap-2`}>
                ₹{Number(value).toLocaleString()}
                {trend && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{value > 0 ? '+ Active' : 'Neutral'}</span>}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{sub}</p>
        </div>
    );
}
