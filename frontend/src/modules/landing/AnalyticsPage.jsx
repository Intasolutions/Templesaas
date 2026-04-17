import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Check, ArrowRight, Target, Zap, BrainCircuit, Sparkles, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const forecastData = [
    { day: 'Mon', actual: 450, forecast: 450 },
    { day: 'Tue', actual: 520, forecast: 500 },
    { day: 'Wed', actual: 480, forecast: 510 },
    { day: 'Thu', actual: 610, forecast: 600 },
    { day: 'Fri', actual: 750, forecast: 740 },
    { day: 'Sat', forecast: 950 },
    { day: 'Sun', forecast: 1200 },
];

const AnalyticsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Institutional Analytics
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Fiscal <br />
                                <span className="text-slate-400">Intelligence.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Comprehensive financial oversight for sacred institutions. Track every counter entry, donation, and operational expense with bank-grade precision.
                            </p>
                            <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95">
                                Book Executive Demo <ArrowRight size={18} />
                            </button>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="relative"
                        >
                             <div className="relative w-full aspect-[4/3] max-w-[650px] mx-auto group">
                                <div 
                                    className="absolute inset-0 z-10"
                                    style={{
                                        background: 'radial-gradient(circle at 50% 10%, transparent 20%, rgba(255,255,255,1) 95%)'
                                    }}
                                />
                                <img 
                                    src="/finance_analytics_hero.png" 
                                    alt="Temple Financial Analytics" 
                                    className="w-full h-full object-cover rounded-[3rem] shadow-2xl group-hover:scale-[1.02] transition-transform duration-1000 border border-slate-100"
                                />
                             </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-950 border-y border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
                        <MetricCard count="₹1.2Cr+" label="Annual Throughput" isDark />
                        <MetricCard count="100%" label="Audit Compliance" isDark />
                        <MetricCard count="AES-256" label="TXN Encryption" isDark />
                        <MetricCard count="DAILY" label="Ledger Sync" isDark />
                    </div>
                </div>
            </section>

            <section className="py-40 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet 
                            title="Unified Financial Ledger" 
                            desc="Real-time consolidation of ritual fees, donations, and hundi collections across all temple counters." 
                         />
                         <FeatureBullet 
                            title="Category-wise Tracking" 
                            desc="Granular breakdown of income into Rituals, General Donations, and Maintenance expenses." 
                         />
                         <FeatureBullet 
                            title="Immutable Audit Trails" 
                            desc="Every transaction is cryptographically hashed with a unique reference ID for administrative verification." 
                         />
                         <FeatureBullet 
                            title="Monthly Trend Analysis" 
                            desc="Visual comparison of income vs. expenditure to monitor institutional financial health." 
                         />
                         <FeatureBullet 
                            title="Export-Ready Reports" 
                            desc="Generate PDF and CSV audits for board meetings and local government compliance instantly." 
                         />
                         <FeatureBullet 
                            title="Cross-Counter Sync" 
                            desc="Zero-latency data synchronization between physical booking nodes and the central finance hub." 
                         />
                    </div>

                    <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Command & Control</span>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1]">
                                Absolute <br />Fiscal Clarity.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Our analytics engine doesn't just show numbers; it provides an immutable record of your institution's heritage and growth. Designed for high-density transactional environments.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Real-time Remittance Logging</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Secure Multi-Witness Audit Logs</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-12 opacity-5"><BarChart3 size={120} /></div>
                             <div className="relative z-10">
                                 <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-10">Ledger Integrity Status</p>
                                 <div className="space-y-6">
                                     <div className="flex items-center justify-between">
                                         <span className="text-xs font-bold uppercase tracking-widest text-white/40">Sync Status</span>
                                         <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Operational</span>
                                     </div>
                                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                         <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} className="h-full bg-primary" />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function MetricCard({ count, label, isDark }) {
    return (
        <div className="text-center group">
            <h3 className={`text-3xl md:text-5xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{count}</h3>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{label}</p>
        </div>
    );
}

function FeatureBullet({ title, desc }) {
    return (
        <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                <Check size={20} strokeWidth={3} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed uppercase tracking-tight text-xs opacity-80">{desc}</p>
        </div>
    );
}

export default AnalyticsPage;
