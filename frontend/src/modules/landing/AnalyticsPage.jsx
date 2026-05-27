import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Check, ArrowRight, Target, Zap, BrainCircuit, Sparkles, Activity, Banknote, ScrollText } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const AnalyticsPage = () => {
    const navigate = useNavigate();

    return (
        <MarketingLayout>
            
            {/* ── Hero ── */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                             <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                                 <Banknote size={16} className="text-primary animate-pulse" />
                                 <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Accounts Module</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                                Accounts & <br />
                                <span className="text-primary font-serif italic">Hundi.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Simple financial tracking for your temple. Manage every rupee from poojas and Hundi boxes with absolute clarity.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => navigate('/demo')} className="h-16 px-10 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 group active:scale-95">
                                    See a Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-wood/5 aspect-[4/3] relative">
                                <img 
                                    src="/assets/landing/hero.png" 
                                    alt="Temple Accounts" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-wood/60 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Key Metrics ── */}
            <section className="py-24 bg-wood border-y border-white/10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 divide-x divide-white/10 text-center">
                        <MetricCard count="100%" label="Clear Accounts" />
                        <MetricCard count="DAILY" label="Ledger Update" />
                        <MetricCard count="SAFE" label="Bank Grade" />
                        <MetricCard count="READY" label="Audit Ready" />
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-wood mb-4">Financial Tools for the Committee</h2>
                        <p className="text-wood/60">Everything you need to keep temple accounts perfect and trusted.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <FeatureBullet 
                            title="Daily Daybook" 
                            desc="Every pooja booking and donation is automatically added to your daily ledger." 
                         />
                         <FeatureBullet 
                            title="Safe Hundi Recording" 
                            desc="Record Hundi collections with multiple witness signatures for complete trust." 
                         />
                         <FeatureBullet 
                            title="Income Categories" 
                            desc="Easily separate money into Poojas, Donations, and special Building Funds." 
                         />
                         <FeatureBullet 
                            title="Instant PDF Reports" 
                            desc="Download clear account reports for your monthly temple committee meetings." 
                         />
                         <FeatureBullet 
                            title="Expense Tracking" 
                            desc="Keep a record of all temple costs like electricity, oil, and staff salaries." 
                         />
                         <FeatureBullet 
                            title="Cloud Sync" 
                            desc="All data is safely backed up so you never lose your temple's financial history." 
                         />
                    </div>

                    <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-[12px] font-bold text-primary uppercase tracking-widest">Trust & Transparency</span>
                            <h2 className="text-4xl md:text-5xl font-black text-wood tracking-tight leading-[1.1]">
                                Total Account <br />
                                <span className="text-primary font-serif italic">Clarity.</span>
                            </h2>
                            <p className="text-lg text-wood/70 leading-relaxed max-w-lg">
                                Our software doesn't just show numbers; it keeps a permanent, unchangeable record of your temple's sacred offerings.
                            </p>
                        </div>
                        <div className="bg-wood rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><BarChart3 size={120} /></div>
                             <div className="relative z-10">
                                 <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-10">Live Account Sync</p>
                                 <div className="space-y-8">
                                     <div className="flex items-center justify-between">
                                         <span className="text-xs font-bold uppercase tracking-widest text-white/40">Ledger Status</span>
                                         <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Stable</span>
                                     </div>
                                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
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

function MetricCard({ count, label }) {
    return (
        <div className="px-4">
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">{count}</h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">{label}</p>
        </div>
    );
}

function FeatureBullet({ title, desc }) {
    return (
        <div className="p-10 rounded-3xl border border-wood/5 bg-cream/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-8 shadow-sm border border-wood/5 group-hover:bg-primary group-hover:text-white transition-all">
                <Check size={20} strokeWidth={3} />
            </div>
            <h4 className="text-xl font-black text-wood mb-4 uppercase tracking-tight">{title}</h4>
            <p className="text-wood/70 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

export default AnalyticsPage;
