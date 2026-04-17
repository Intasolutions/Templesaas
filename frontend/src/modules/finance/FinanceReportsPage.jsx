import React, { useState, useEffect, useMemo } from 'react';
import api from '../../shared/api/client';
import { useAuth } from '../../context/AuthContext';
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
    ArrowRight,
    FileText,
    Activity,
    Lock
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
    const { checkPermission } = useAuth();
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

        if (checkPermission('finance', 'view')) {
            fetchFinanceData();
        } else {
            setLoading(false);
        }
    }, [dateRange, checkPermission]);

    if (!checkPermission('finance', 'view')) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                    <Lock size={40} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Access Restricted</h1>
                <p className="max-w-md text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                    You do not have the necessary privileges to view financial reports. 
                    Please contact your temple administrator for access.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-[6px] border-slate-100 border-t-slate-900 rounded-full animate-spin shadow-inner"></div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Generating Financial Reports...</p>
            </div>
        );
    }

    const totalIncome = data?.summary?.total_income || 0;
    const totalExpense = data?.summary?.total_expense || 0;
    const netBalance = data?.summary?.net_balance || 0;

    const COLORS = ['#0f172a', 'var(--primary)', '#334155', '#D4AF37', '#94a3b8'];
    const REVENUE_BY_CATEGORY = (data?.breakdown || []).map((b, i) => ({
        name: b.name,
        value: b.value,
        color: COLORS[i % COLORS.length]
    }));

    const TRANSACTIONS = data?.recent_transactions || [];
    const MONTHLY_REVENUE = data?.trends || [];

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Track temple income, expenses, and revenue patterns over time
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {['This Month', 'This Year'].map(range => (
                             <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 h-8 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${dateRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                             >
                                {range}
                             </button>
                        ))}
                    </div>
                    <button className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <Download size={14} /> Export
                    </button>
                    <button className="h-10 px-5 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 active:scale-95">
                        <Filter size={14} /> Custom Filter
                    </button>
                </div>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                    label="Current Balance" 
                    value={`₹${netBalance.toLocaleString('en-IN')}`} 
                    icon={TrendingUp} 
                    trend="+12%" 
                    color="gold" 
                    subtext="Net Operational Funds" 
                />
                <MetricCard 
                    label="Total Income" 
                    value={`₹${totalIncome.toLocaleString('en-IN')}`} 
                    icon={ArrowUpRight} 
                    trend="Inflow" 
                    color="emerald" 
                    subtext="Vazhipadu & Donations" 
                />
                <MetricCard 
                    label="Total Expenses" 
                    value={`₹${totalExpense.toLocaleString('en-IN')}`} 
                    icon={ArrowDownRight} 
                    trend="Outflow" 
                    color="red" 
                    subtext="Combined Expenditures" 
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                                    <Activity size={16} className="text-primary" /> Revenue Trends
                                </h2>
                                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Inflow vs Outflow comparison across periods</p>
                            </div>
                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                                <button
                                    onClick={() => setChartView('bar')}
                                    className={`px-4 h-8 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${chartView === 'bar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Bar Chart
                                </button>
                                <button
                                    onClick={() => setChartView('area')}
                                    className={`px-4 h-8 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${chartView === 'area' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Area View
                                </button>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartView === 'bar' ? (
                                    <BarChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                                        <Bar dataKey="income" name="Income" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={24} />
                                        <Bar dataKey="expense" name="Expense" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={8} />
                                    </BarChart>
                                ) : (
                                    <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                                        <Area type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={3} fillOpacity={0.1} fill="var(--primary)" />
                                        <Area type="monotone" dataKey="expense" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.05} fill="#94a3b8" />
                                    </AreaChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                                    <FileText size={16} className="text-primary" /> Recent Transactions
                                </h2>
                                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Verified ledger entries from all counters</p>
                            </div>
                            <button className="h-9 px-4 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Search size={14} /> Find
                            </button>
                        </div>

                        <div className="overflow-x-auto text-[13px]">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white border-b border-slate-50 text-slate-400">
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-wider">Date</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider">Description</th>
                                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {TRANSACTIONS.length === 0 ? (
                                        <tr><td colSpan="4" className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No transactions recorded</td></tr>
                                    ) : TRANSACTIONS.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-8 py-5">
                                               <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">#{trx.id}</span>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] font-bold text-slate-500">
                                               {trx.date}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{trx.desc}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1.5 uppercase">
                                                        <Activity size={10} className="text-primary" /> {trx.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className={`text-base font-bold tracking-tight ${trx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                    {trx.type === 'credit' ? '+' : '-'} ₹{Math.abs(trx.amount).toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 border-t border-slate-50 bg-slate-50/20 text-center">
                            <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all flex items-center gap-3 mx-auto">
                                View Full Financial Ledger <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><PieChartIcon size={120} /></div>
                        <h2 className="text-primary font-bold tracking-widest uppercase text-[10px] mb-8 flex items-center gap-2">
                            <Layers size={14} /> Revenue Distribution
                        </h2>

                        <div className="h-[250px] w-full relative z-10 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={REVENUE_BY_CATEGORY}
                                        cx="50%" cy="50%" innerRadius={70} outerRadius={95}
                                        paddingAngle={4} dataKey="value" stroke="none"
                                        animationDuration={1000}
                                    >
                                        {REVENUE_BY_CATEGORY.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-white tracking-tight leading-none">100%</span>
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-2">Allocated</span>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4 relative z-10">
                            {REVENUE_BY_CATEGORY.map((cat, idx) => (
                                <div key={idx} className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider group-hover/item:text-white transition-colors">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {Math.round((cat.value / (totalIncome || 1)) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 h-12 rounded-xl bg-white/5 hover:bg-white text-white hover:text-slate-900 border border-white/10 font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                            Detailed Analytics <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                         <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:scale-105 transition-transform"><ShieldCheck size={100} /></div>
                         <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <Lock size={14} className="text-emerald-500" /> Data Protection
                         </h3>
                         <p className="text-[11px] font-semibold text-slate-500 uppercase leading-relaxed tracking-tight">
                            All financial records are encrypted and synced with secure temple servers. 
                            Audit history is preserved for administrative review.
                         </p>
                         <div className="mt-6 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Secure Audit Active</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, trend, subtext }) {
    const cardColors = {
        gold: "hover:border-primary/30",
        emerald: "hover:border-emerald-200",
        red: "hover:border-red-200"
    };

    const iconColors = {
        gold: "bg-primary text-white",
        emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        red: "bg-red-50 text-red-600 border border-red-100"
    };

    return (
        <div className={`p-7 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all relative overflow-hidden group ${cardColors[color] || ''}`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${iconColors[color]}`}>
                        <Icon size={22} />
                    </div>
                    {trend && (
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100`}>
                            {trend}
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <h3 className="text-2xl font-bold mt-2 text-slate-900 tracking-tight leading-none">{value}</h3>
                <p className="text-[10px] font-semibold mt-3.5 uppercase tracking-wider text-slate-400 opacity-60 flex items-center gap-1.5">
                    <Activity size={10} /> {subtext}
                </p>
            </div>
        </div>
    );
}
