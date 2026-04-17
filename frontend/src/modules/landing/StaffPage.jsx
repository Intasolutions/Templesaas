import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Check, ArrowRight, Shield, Zap, Briefcase, Activity } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const StaffPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Human Capital Management
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Staff <br />
                                <span className="text-slate-400">Governance.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Orchestrate your temple's workforce with institutional precision. From priest rosters to volunteer coordination and automated attendance tracking.
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
                                    src="/management_hero.png" 
                                    alt="Temple Staff Management" 
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
                        <MetricCard count="100%" label="Payroll Accuracy" isDark />
                        <MetricCard count="REAL-TIME" label="Attendance Sync" isDark />
                        <MetricCard count="RBAC" label="Role Security" isDark />
                        <MetricCard count="DAILY" label="Roster Planning" isDark />
                    </div>
                </div>
            </section>

            <section className="py-40 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet 
                            title="Dynamic Rostering" 
                            desc="Optimized scheduling for priests, staff, and volunteers during peak festival seasons and daily rituals." 
                         />
                         <FeatureBullet 
                            title="Automated Attendance" 
                            desc="Secure check-in protocols with geo-fencing and biometric integration options for institutional staff." 
                         />
                         <FeatureBullet 
                            title="Financial Integration" 
                            desc="Seamless synchronization with the core finance module for automated salary and allowance processing." 
                         />
                         <FeatureBullet 
                            title="Role-Based Access" 
                            desc="Enforce strict permission boundaries between administrative staff, ritual practitioners, and general volunteers." 
                         />
                         <FeatureBullet 
                            title="Performance Analytics" 
                            desc="Track operational efficiency and task completion across different temple departments and departments." 
                         />
                         <FeatureBullet 
                            title="Digital Registry" 
                            desc="Centralized repository for staff credentials, historical service records, and institutional certifications." 
                         />
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

export default StaffPage;
