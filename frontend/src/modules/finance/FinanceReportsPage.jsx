import { useState, useEffect, useMemo } from 'react';
import api from '../../shared/api/client';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Filter,
    TrendingUp,
    IndianRupee,
    Wallet,
    Flame,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    PieChart as PieChartIcon,
    BarChart3,
    Database,
    Zap,
    ShieldCheck,
    Layers,
    ChevronRight,
    Search,
    ArrowRight
} from 'lucide-react';

// Recharts for Visualization
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function FinanceReportsPage() {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState('This Month');
    const [chartView, setChartView] = useState('bar');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinanceData = async () => {
            setLoading(true);
            try {
                let period = 'month';
                if (dateRange === 'This Year') period = 'year';

                const response = await api.get(`/reports/finance-report/?period=${period}`);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch finance report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, [dateRange]);

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-[6px] border-slate-100 border-t-slate-900 rounded-full animate-spin shadow-inner"></div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Establishing Audit Logic...</p>
            </div>
        );
    }

    const totalIncome = data?.summary?.total_income || 0;
    const totalExpense = data?.summary?.total_expense || 0;
    const netBalance = data?.summary?.net_balance || 0;

    const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];
    const REVENUE_BY_CATEGORY = (data?.breakdown || []).map((b, i) => ({
        name: b.name,
        value: b.value,
        color: COLORS[i % COLORS.length]
    }));

    const TRANSACTIONS = data?.recent_transactions || [];
    const MONTHLY_REVENUE = data?.trends || [];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Audit Intelligence</h1>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Database size={10} className="text-primary" /> Capital State & Fiscal Analysis
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner mr-2">
                        {['This Month', 'This Year'].map(range => (
                             <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-5 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${dateRange === range ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                             >
                                {range}
                             </button>
                        ))}
                    </div>
                    <button className="h-11 px-6 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2.5 active:scale-95">
                        <Download size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Export</span>
                    </button>
                    <button className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 flex items-center gap-2.5 active:scale-95">
                        <Filter size={16} /> Custom Audit
                    </button>
                </div>
            </header>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <MetricCard 
                    label="Active Capital" 
                    value={`₹${netBalance.toLocaleString('en-IN')}`} 
                    icon={TrendingUp} 
                    trend="+12% Delta" 
                    color="slate" 
                    subtext="Net Operational Treasury" 
                />
                <MetricCard 
                    label="Gross Inflow" 
                    value={`₹${totalIncome.toLocaleString('en-IN')}`} 
                    icon={ArrowUpRight} 
                    trend="VERIFIED" 
                    color="emerald" 
                    subtext="Total Remittance Mass" 
                />
                <MetricCard 
                    label="Gross Outflow" 
                    value={`₹${totalExpense.toLocaleString('en-IN')}`} 
                    icon={ArrowDownRight} 
                    trend="AUDITED" 
                    color="primary" 
                    subtext="Consolidated Terminus" 
                />
            </div>

            {/* Visual Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 md:px-0">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                                    <Zap size={16} className="text-slate-900" /> Velocity Matrix
                                </h2>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Real-time capital variance across fiscal periods</p>
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                                <button
                                    onClick={() => setChartView('bar')}
                                    className={`px-6 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${chartView === 'bar' ? 'bg-white text-slate-900 shadow-sm border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Quantized
                                </button>
                                <button
                                    onClick={() => setChartView('area')}
                                    className={`px-6 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${chartView === 'area' ? 'bg-white text-slate-900 shadow-sm border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Continuous
                                </button>
                            </div>
                        </div>

                        <div className="h-[400px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartView === 'bar' ? (
                                    <BarChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900, textAnchor: 'middle' }} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold', padding: '1.5rem' }} />
                                        <Bar dataKey="income" name="Inflow" fill="#0f172a" radius={[12, 12, 0, 0]} barSize={32} />
                                        <Bar dataKey="expense" name="Outflow" fill="#cbd5e1" radius={[12, 12, 0, 0]} barSize={12} />
                                    </BarChart>
                                ) : (
                                    <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold', padding: '1.5rem' }} />
                                        <Area type="monotone" dataKey="income" stroke="#0f172a" strokeWidth={5} fillOpacity={0.08} fill="#0f172a" />
                                        <Area type="monotone" dataKey="expense" stroke="#cbd5e1" strokeWidth={3} fillOpacity={0.05} fill="#94a3b8" />
                                    </AreaChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operational Ledger Table */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <div>
                                <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                                    <Layers size={16} className="text-slate-900" /> Operational Data Stream
                                </h2>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Latest synchronized ledger entries</p>
                            </div>
                            <button className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                                <Search size={16} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white border-b border-slate-50">
                                        <th className="px-12 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400">Registry ID</th>
                                        <th className="px-10 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Protocol Date</th>
                                        <th className="px-12 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400">Remittance Origin</th>
                                        <th className="px-12 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Magnitude Delta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {TRANSACTIONS.map((trx) => (
                                        <tr key={trx.id} className="group/row hover:bg-slate-50/50 transition-all">
                                            <td className="px-12 py-8">
                                               <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover/row:text-slate-900 transition-colors">#{trx.id}</div>
                                            </td>
                                            <td className="px-10 py-8 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                               {trx.date}
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{trx.desc}</span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                                        <div className="h-1 w-1 rounded-full bg-primary" /> {trx.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                <div className={`text-base font-black tracking-tighter ${trx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900'}`}>
                                                    {trx.type === 'credit' ? '+' : '–'} ₹{Math.abs(trx.amount).toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-slate-900 transition-all flex items-center gap-4">
                                Access Comprehensive Central Ledger <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden border border-slate-800 shadow-2xl shadow-slate-900/40 group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform"><PieChartIcon size={100} /></div>
                        <h2 className="text-primary font-black tracking-[0.3em] uppercase text-[9px] mb-8 pb-4 border-b border-white/5 flex items-center gap-3">
                            <Layers size={12} /> Allocation Mass
                        </h2>

                        <div className="h-[280px] w-full relative z-10 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={REVENUE_BY_CATEGORY}
                                        cx="50%" cy="50%" innerRadius={85} outerRadius={110}
                                        paddingAngle={6} dataKey="value" stroke="none"
                                        animationBegin={0} animationDuration={1500}
                                    >
                                        {REVENUE_BY_CATEGORY.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-white tracking-tighter leading-none">100%</span>
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mt-3">Aggregate Node</span>
                            </div>
                        </div>

                        <div className="mt-12 space-y-6 relative z-10">
                            {REVENUE_BY_CATEGORY.map((cat, idx) => (
                                <div key={idx} className="flex items-center justify-between group/item cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: cat.color }} />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover/item:text-white transition-colors">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-white tracking-tighter">
                                        {Math.round((cat.value / (totalIncome || 1)) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-12 h-14 rounded-2xl bg-white/5 hover:bg-white text-white hover:text-slate-900 border border-white/10 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl group/btn">
                            Detailed Distribution <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                         <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform"><ShieldCheck size={80} /></div>
                         <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                            <ShieldCheck size={12} className="text-slate-900" /> Compliance State
                         </h3>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                            Financial vectors are recorded with 256-bit encryption. Audit trail linked to Central Treasury.
                         </p>
                         <div className="mt-6 flex items-center gap-3">
                            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Encryption Active • T-Alpha</span>
                         </div>
                    </div>
                </div>
            </div>
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
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSlate ? 'bg-white/10 border border-white/10' : colors[color]} group-hover:rotate-12 transition-transform`}>
                        <Icon size={20} />
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${isSlate ? 'bg-primary text-white' : colors[color]}`}>
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
