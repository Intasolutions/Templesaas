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
    Lock,
    ArrowDown,
    ArrowUp,
    Landmark,
    Plus,
    BookOpen,
    X
} from 'lucide-react';
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import Pagination from '../../components/common/Pagination';

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

    const [activeTab, setActiveTab] = useState('overview');
    
    // Daybook State
    const [daybookDate, setDaybookDate] = useState(new Date().toISOString().split('T')[0]);
    const [daybookFilters, setDaybookFilters] = useState({ bank_account: '', payment_mode: '' });
    const [daybookData, setDaybookData] = useState(null);
    const [daybookLoading, setDaybookLoading] = useState(false);
    const [daybookPage, setDaybookPage] = useState(1);
    const [daybookPagination, setDaybookPagination] = useState({ count: 0, total_pages: 1 });

    // Bank Accounts State
    const [bankAccounts, setBankAccounts] = useState([]);
    const [bankLoading, setBankLoading] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [newBank, setNewBank] = useState({ name: '', account_number: '', ifsc_code: '', branch: '', opening_balance: 0 });

    // Quick Expense State
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [quickExpense, setQuickExpense] = useState({ title: '', amount: '', category: 'other', payment_mode: 'cash', bank_account: null });
    // Profit & Loss State
    const [plData, setPlData] = useState(null);
    const [plLoading, setPlLoading] = useState(false);
    const [plDateRange, setPlDateRange] = useState({ start: '', end: '' });

    const [isSubmitting, setIsSubmitting] = useState(false);

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
            if (activeTab === 'overview') {
                fetchFinanceData();
            }
        } else {
            setLoading(false);
        }
    }, [dateRange, checkPermission, activeTab]);

    useEffect(() => {
        const fetchDaybook = async () => {
            setDaybookLoading(true);
            try {
                let url = `/reports/daybook/?date=${daybookDate}&page=${daybookPage}`;
                if (daybookFilters.bank_account) url += `&bank_account_id=${daybookFilters.bank_account}`;
                if (daybookFilters.payment_mode) url += `&payment_mode=${daybookFilters.payment_mode}`;
                
                const response = await api.get(url);
                setDaybookData(response.data);
                setDaybookPagination(response.data.pagination);
            } catch (error) {
                console.error("Failed to fetch daybook:", error);
            } finally {
                setDaybookLoading(false);
            }
        };

        if (checkPermission('finance', 'view') && activeTab === 'daybook') {
            fetchDaybook();
        }
    }, [daybookDate, daybookFilters, daybookPage, checkPermission, activeTab]);

    const fetchBankAccounts = async () => {
        setBankLoading(true);
        try {
            const response = await api.get('/finance/bank-accounts/');
            setBankAccounts(response.data.results || response.data || []);
        } catch (error) {
            console.error("Failed to fetch bank accounts:", error);
        } finally {
            setBankLoading(false);
        }
    };

    useEffect(() => {
        if (checkPermission('finance', 'view') && (activeTab === 'bank_accounts' || activeTab === 'daybook' || activeTab === 'profit_loss')) {
            fetchBankAccounts();
        }
    }, [checkPermission, activeTab]);

    useEffect(() => {
        const fetchPL = async () => {
            setPlLoading(true);
            try {
                const response = await api.get(`/reports/profit-loss/?start_date=${plDateRange.start}&end_date=${plDateRange.end}`);
                setPlData(response.data);
            } catch (error) {
                console.error("PL Report Error", error);
            } finally {
                setPlLoading(false);
            }
        };

        if (checkPermission('finance', 'view') && activeTab === 'profit_loss') {
            fetchPL();
        }
    }, [plDateRange, checkPermission, activeTab]);

    const handleCreateBank = async (e) => {
        e.preventDefault();
        try {
            await api.post('/finance/bank-accounts/', newBank);
            setShowBankModal(false);
            setNewBank({ name: '', account_number: '', ifsc_code: '', branch: '', opening_balance: 0 });
            fetchBankAccounts();
        } catch (error) {
            console.error("Failed to create bank account:", error);
        }
    };

    const handleQuickExpense = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/finance/transactions/', {
                ...quickExpense,
                txn_type: 'expense',
                date: daybookDate
            });
            setIsExpenseModalOpen(false);
            setQuickExpense({ title: '', amount: '', category: 'other', payment_mode: 'cash', bank_account: null });
            
            // Refresh Daybook
            const response = await api.get(`/reports/daybook/?date=${daybookDate}`);
            setDaybookData(response.data);
        } catch (error) {
            console.error("Quick Expense Error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 h-10 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <BarChart3 size={14} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('daybook')}
                        className={`px-6 h-10 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'daybook' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <BookOpen size={14} /> Daybook
                    </button>
                    <button
                        onClick={() => setActiveTab('profit_loss')}
                        className={`px-6 h-10 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'profit_loss' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <TrendingUp size={14} /> Profit & Loss
                    </button>
                    <button
                        onClick={() => setActiveTab('bank_accounts')}
                        className={`px-6 h-10 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'bank_accounts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Landmark size={14} /> Bank Accounts
                    </button>
                </div>
            </header>

            {activeTab === 'overview' ? (
                <>
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

                        <ResponsiveTable
                            columns={[
                                {
                                    header: "Time / ID",
                                    key: "id",
                                    render: (trx) => (
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-900">
                                                {trx.timestamp ? new Date(trx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : trx.date}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{trx.id}</span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Description",
                                    key: "desc",
                                    mobileLabel: "Transaction Details",
                                    render: (trx) => (
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{trx.desc}</span>
                                            <span className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1.5 uppercase">
                                                <Activity size={10} className="text-primary" /> {trx.category}
                                            </span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Amount",
                                    key: "amount",
                                    align: "right",
                                    render: (trx) => (
                                        <div className={`text-base font-bold tracking-tight ${trx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                            {trx.type === 'credit' ? '+' : '-'} ₹{Math.abs(trx.amount).toLocaleString('en-IN')}
                                        </div>
                                    )
                                }
                            ]}
                            data={TRANSACTIONS}
                            loading={loading}
                            emptyMessage="No transactions recorded"
                        />
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
            </>
            ) : activeTab === 'daybook' ? (
                <DaybookView 
                    date={daybookDate} 
                    setDate={(d) => { setDaybookPage(1); setDaybookDate(d); }}
                    filters={daybookFilters}
                    setFilters={(f) => { setDaybookPage(1); setDaybookFilters(f); }}
                    bankAccounts={bankAccounts}
                    data={daybookData} 
                    loading={daybookLoading} 
                    page={daybookPage}
                    setPage={setDaybookPage}
                    pagination={daybookPagination}
                    onRecordClick={() => setIsExpenseModalOpen(true)}
                />
            ) : activeTab === 'profit_loss' ? (
                <ProfitLossView 
                    data={plData}
                    loading={plLoading}
                    dateRange={plDateRange}
                    setDateRange={setPlDateRange}
                />
            ) : (
                <BankAccountsView 
                    bankAccounts={bankAccounts}
                    loading={bankLoading}
                    showModal={showBankModal}
                    setShowModal={setShowBankModal}
                    newBank={newBank}
                    setNewBank={setNewBank}
                    handleCreateBank={handleCreateBank}
                />
            )}

            {/* Quick Expense Modal */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Quick Record Expense</h2>
                            <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
                        </div>
                        
                        <form onSubmit={handleQuickExpense} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Description (What for?)</label>
                                <input required type="text" value={quickExpense.title} onChange={e => setQuickExpense({...quickExpense, title: e.target.value})} placeholder="e.g. Electricity Bill, Milk Purchase" className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none focus:border-slate-900" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
                                    <select value={quickExpense.category} onChange={e => setQuickExpense({...quickExpense, category: e.target.value})} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none appearance-none">
                                        <option value="other">Miscellaneous</option>
                                        <option value="utility_bills">Utilities/Bills</option>
                                        <option value="temple_maintenance">Maintenance</option>
                                        <option value="staff_salary">Staff Salary</option>
                                        <option value="stock_purchase">Stock/Inventory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Amount (₹)</label>
                                    <input required type="number" step="0.01" value={quickExpense.amount} onChange={e => setQuickExpense({...quickExpense, amount: e.target.value})} placeholder="0.00" className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Payment Mode</label>
                                    <select value={quickExpense.payment_mode} onChange={e => setQuickExpense({...quickExpense, payment_mode: e.target.value})} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none appearance-none">
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="upi">UPI</option>
                                        <option value="card">Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Bank Account</label>
                                    <select 
                                        disabled={quickExpense.payment_mode === 'cash'}
                                        value={quickExpense.bank_account || ''} 
                                        onChange={e => setQuickExpense({...quickExpense, bank_account: e.target.value || null})} 
                                        className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none appearance-none disabled:opacity-50"
                                    >
                                        <option value="">No Account</option>
                                        {bankAccounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button disabled={isSubmitting} type="submit" className="w-full h-12 mt-4 rounded-xl bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg flex items-center justify-center gap-2">
                                {isSubmitting ? 'Recording...' : 'Save Expense'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function BankAccountsView({ bankAccounts, loading, showModal, setShowModal, newBank, setNewBank, handleCreateBank }) {
    if (loading) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-[4px] border-slate-100 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                        <Landmark size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Bank Ledger Master</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Manage temple bank accounts and balances</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="h-10 px-5 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
                >
                    <Plus size={14} /> Add Account
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bankAccounts.length === 0 ? (
                    <div className="col-span-3 py-20 text-center bg-white rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        No Bank Accounts Configured
                    </div>
                ) : bankAccounts.map((acc) => (
                    <div key={acc.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform"><Landmark size={60} /></div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight relative z-10">{acc.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest relative z-10 flex items-center gap-2">
                            {acc.account_number || 'No A/C Info'} {acc.ifsc_code && `• ${acc.ifsc_code}`}
                        </p>
                        
                        <div className="mt-8 pt-6 border-t border-slate-50 relative z-10">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Opening Balance</p>
                            <p className="text-xl font-bold text-slate-900 tracking-tight">₹{parseFloat(acc.opening_balance).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8"
                    >
                        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-6">New Bank Account</h2>
                        <form onSubmit={handleCreateBank} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Account Name</label>
                                <input required type="text" value={newBank.name} onChange={e => setNewBank({...newBank, name: e.target.value})} placeholder="e.g. SBI Main Branch" className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none focus:border-slate-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Account Number</label>
                                    <input type="text" value={newBank.account_number} onChange={e => setNewBank({...newBank, account_number: e.target.value})} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none focus:border-slate-900" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">IFSC Code</label>
                                    <input type="text" value={newBank.ifsc_code} onChange={e => setNewBank({...newBank, ifsc_code: e.target.value})} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none focus:border-slate-900" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Opening Balance (₹)</label>
                                <input required type="number" step="0.01" value={newBank.opening_balance} onChange={e => setNewBank({...newBank, opening_balance: e.target.value})} className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold outline-none focus:border-slate-900" />
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100">Cancel</button>
                                <button type="submit" className="flex-1 h-12 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black">Save Account</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function DaybookView({ date, setDate, filters, setFilters, bankAccounts, data, loading, page, setPage, pagination, onRecordClick }) {
    if (loading) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-[4px] border-slate-100 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const txns = data?.transactions || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Financial Daybook</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Detailed Daily Transaction Ledger</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <input 
                            type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="bg-transparent text-[10px] font-bold outline-none px-2"
                        />
                    </div>
                    
                    <select 
                        value={filters.payment_mode}
                        onChange={e => setFilters({...filters, payment_mode: e.target.value})}
                        className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-slate-900 transition-all"
                    >
                        <option value="">All Modes</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI / Scan</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="card">Card</option>
                    </select>

                    <select 
                        value={filters.bank_account}
                        onChange={e => setFilters({...filters, bank_account: e.target.value})}
                        className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-slate-900 transition-all"
                    >
                        <option value="">All Accounts</option>
                        {bankAccounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>

                    <button onClick={onRecordClick} className="h-11 px-6 bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                        <Plus size={16} /> Record Expense
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard label="Opening Balance" value={`₹${(data?.opening_balance || 0).toLocaleString('en-IN')}`} icon={Wallet} color="slate" subtext="Carry forward" />
                <MetricCard label="Total Inflow" value={`₹${(data?.total_income || 0).toLocaleString('en-IN')}`} icon={ArrowUp} color="emerald" trend="IN" subtext="Cash & Bank Income" />
                <MetricCard label="Total Outflow" value={`₹${(data?.total_expense || 0).toLocaleString('en-IN')}`} icon={ArrowDown} color="red" trend="OUT" subtext="Cash & Bank Expense" />
                <MetricCard label="Closing Balance" value={`₹${(data?.closing_balance || 0).toLocaleString('en-IN')}`} icon={Database} color="gold" subtext="End of day balance" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Physical Cash Inflow</p>
                        <h4 className="text-xl font-bold text-slate-900 mt-1">₹{(data?.mode_summary?.cash?.income || 0).toLocaleString()}</h4>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                        <Wallet size={18} />
                    </div>
                </div>
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Bank / Digital Inflow</p>
                        <h4 className="text-xl font-bold text-slate-900 mt-1">₹{((data?.mode_summary?.upi?.income || 0) + (data?.mode_summary?.bank?.income || 0) + (data?.mode_summary?.card?.income || 0)).toLocaleString()}</h4>
                    </div>
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                        <Landmark size={18} />
                    </div>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl flex justify-between items-center text-white shadow-xl shadow-slate-900/10">
                    <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Today's Net Profit</p>
                        <h4 className="text-xl font-bold text-white mt-1">₹{((data?.total_income || 0) - (data?.total_expense || 0)).toLocaleString()}</h4>
                    </div>
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                        <TrendingUp size={18} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <ResponsiveTable
                    columns={[
                        {
                            header: "Timestamp / ID",
                            key: "time",
                            render: (trx) => (
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-900">
                                        {new Date(trx.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span className="text-[8px] font-black text-primary/50 mt-1 uppercase tracking-widest">{trx.id}</span>
                                </div>
                            )
                        },
                        {
                            header: "Description",
                            key: "desc",
                            mobileLabel: "Transaction",
                            render: (trx) => (
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">{trx.desc}</span>
                                    <span className="text-[10px] font-bold text-primary mt-1 uppercase tracking-widest">{trx.category}</span>
                                </div>
                            )
                        },
                        {
                            header: "Mode",
                            key: "mode",
                            render: (trx) => (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded w-max">{trx.payment_mode}</span>
                                    {trx.bank_account && <span className="text-[9px] font-bold text-slate-400 mt-1">{trx.bank_account}</span>}
                                </div>
                            )
                        },
                        {
                            header: "Income",
                            key: "income",
                            align: "right",
                            render: (trx) => (
                                <span className="font-bold text-emerald-600 text-sm">
                                    {trx.income > 0 ? `₹${trx.income.toLocaleString('en-IN')}` : '-'}
                                </span>
                            )
                        },
                        {
                            header: "Expense",
                            key: "expense",
                            align: "right",
                            render: (trx) => (
                                <span className="font-bold text-rose-500 text-sm">
                                    {trx.expense > 0 ? `₹${trx.expense.toLocaleString('en-IN')}` : '-'}
                                </span>
                            )
                        }
                    ]}
                    data={txns}
                    loading={loading}
                    emptyMessage="No transactions for this date"
                />

                {pagination && pagination.count > 0 && (
                    <div className="px-8 border-t border-slate-50 bg-slate-50/20">
                        <Pagination
                            currentPage={page}
                            totalPages={pagination.total_pages || 1}
                            onPageChange={setPage}
                            count={pagination.count}
                            pageSize={10}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, trend, subtext }) {
    const cardColors = {
        gold: "hover:border-primary/30",
        emerald: "hover:border-emerald-200",
        red: "hover:border-red-200",
        slate: "hover:border-slate-300"
    };

    const iconColors = {
        gold: "bg-primary text-white",
        emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        red: "bg-red-50 text-red-600 border border-red-100",
        slate: "bg-slate-50 text-slate-600 border border-slate-100"
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

function ProfitLossView({ data, loading, dateRange, setDateRange }) {
    if (loading) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-[4px] border-slate-100 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const COLORS = ['#0f172a', 'var(--primary)', '#334155', '#D4AF37', '#94a3b8', '#64748b'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Profit & Loss Analysis</h2>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Custom period financial summary</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                        <input 
                            type="date" value={dateRange.start} 
                            onChange={e => setDateRange({...dateRange, start: e.target.value})}
                            className="bg-transparent text-[10px] font-bold outline-none px-2"
                        />
                        <span className="text-slate-300 text-[10px]">TO</span>
                        <input 
                            type="date" value={dateRange.end} 
                            onChange={e => setDateRange({...dateRange, end: e.target.value})}
                            className="bg-transparent text-[10px] font-bold outline-none px-2"
                        />
                    </div>
                    <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">Download P&L</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard label="Total Period Income" value={`₹${(data?.summary?.total_income || 0).toLocaleString()}`} icon={ArrowUp} color="emerald" subtext="Gross Inflow" />
                <MetricCard label="Total Period Expenses" value={`₹${(data?.summary?.total_expense || 0).toLocaleString()}`} icon={ArrowDown} color="red" subtext="Gross Outflow" />
                <MetricCard label="Net Period Profit" value={`₹${(data?.summary?.net_profit || 0).toLocaleString()}`} icon={TrendingUp} color="gold" trend="P/L" subtext="Surplus/Deficit" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <PieChartIcon size={16} className="text-primary" /> Income by Flow
                    </h3>
                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.breakdown_by_flow?.filter(f => f.type === 'income')}
                                    cx="50%" cy="50%" innerRadius={70} outerRadius={95}
                                    paddingAngle={4} dataKey="total" nameKey="mode" stroke="none"
                                >
                                    {data?.breakdown_by_flow?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3">
                        {data?.breakdown_by_flow?.filter(f => f.type === 'income').map((f, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.mode}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900">₹{f.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <Activity size={16} className="text-rose-500" /> Expense Breakdown
                    </h3>
                    <div className="space-y-6">
                        {data?.breakdown_by_category?.filter(f => f.type === 'expense').length === 0 ? (
                            <div className="py-20 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No expenses recorded</div>
                        ) : data?.breakdown_by_category?.filter(f => f.type === 'expense').map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat.category}</span>
                                    <span className="text-xs font-bold text-slate-900">₹{cat.total.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${(cat.total / (data.summary.total_expense || 1)) * 100}%` }}
                                        className="h-full bg-slate-900 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
