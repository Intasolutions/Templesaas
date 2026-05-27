import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Check, ArrowRight, Shield, Zap, Briefcase, Activity, Sparkles, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from './MarketingLayout';

const StaffPage = () => {
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
                                 <Utensils size={16} className="text-primary animate-pulse" />
                                 <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Staff Module</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                                Annadhanam <br />
                                <span className="text-primary font-serif italic">& Staff.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Manage your temple's workforce and mass feeding programs easily. Track staff duties, attendance, and Annadhanam stocks.
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
                                    src="/assets/landing/priest.png" 
                                    alt="Temple Staff" 
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
                        <MetricCard count="100%" label="Duty Sync" />
                        <MetricCard count="DAILY" label="Stock Check" />
                        <MetricCard count="SAFE" label="Staff Records" />
                        <MetricCard count="READY" label="Annadhanam" />
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-wood mb-4">Manage Your Temple Workforce</h2>
                        <p className="text-wood/60">Everything you need to coordinate priests, office staff, and volunteers.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <FeatureBullet 
                            title="Daily Duty Lists" 
                            desc="Easily plan which priests and staff are on duty for each pooja or festival shift." 
                         />
                         <FeatureBullet 
                            title="Annadhanam Stock" 
                            desc="Keep a clear count of rice, oil, and groceries used for temple mass feeding." 
                         />
                         <FeatureBullet 
                            title="Staff Attendance" 
                            desc="A simple way to record when staff arrive and leave for their daily temple work." 
                         />
                         <FeatureBullet 
                            title="Salary Records" 
                            desc="Keep a record of staff salaries and dakshina payments in your temple accounts." 
                         />
                         <FeatureBullet 
                            title="Volunteer Tracking" 
                            desc="Manage the names and phone numbers of volunteers who help during big festivals." 
                         />
                         <FeatureBullet 
                            title="Work Categories" 
                            desc="Give different computer access to priests, office staff, and the manager." 
                         />
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

export default StaffPage;
