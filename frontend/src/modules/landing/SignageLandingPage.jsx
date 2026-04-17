import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tv, Check, ArrowRight, Zap, Play, Layout, Activity } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const SignageLandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Broadcast Infrastructure
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Digital <br />
                                <span className="text-slate-400">Signage.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                High-fidelity 4K broadcast nodes for modern temples. Real-time token status, ritual announcements, and traditional panchangam displays.
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
                             <div className="relative w-full aspect-video max-w-[650px] mx-auto group">
                                <div 
                                    className="absolute inset-0 z-10"
                                    style={{
                                        background: 'radial-gradient(circle at 50% 10%, transparent 20%, rgba(255,255,255,1) 95%)'
                                    }}
                                />
                                <img 
                                    src="/live_tv_signage_mockup.png" 
                                    alt="Temple Digital Signage" 
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
                        <MetricCard count="4K" label="Broadcast Quality" isDark />
                        <MetricCard count="<1s" label="Sync Latency" isDark />
                        <MetricCard count="24/7" label="Node Uptime" isDark />
                        <MetricCard count="∞" label="Display Nodes" isDark />
                    </div>
                </div>
            </section>

            <section className="py-40 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet 
                            title="Real-time Token Sync" 
                            desc="Display current ritual numbers and queue status across all temple display nodes instantly." 
                         />
                         <FeatureBullet 
                            title="Multi-lingual Support" 
                            desc="Dynamic translation engine for Malayalam and English announcements with professional typography." 
                         />
                         <FeatureBullet 
                            title="Cloud Control Central" 
                            desc="Manage hundreds of display nodes from a single administrative dashboard with remote overrides." 
                         />
                         <FeatureBullet 
                            title="Panchangam Overlay" 
                            desc="Automated daily Masam, Nakshatra, and Tithi displays synchronized with local latitude/longitude." 
                         />
                         <FeatureBullet 
                            title="Emergency Broadcast" 
                            desc="Instantly override all displays with critical safety information or festival crowd control alerts." 
                         />
                         <FeatureBullet 
                            title="Offline Resilience" 
                            desc="Smart-caching technology ensure displays remain professional and active even during network outages." 
                         />
                    </div>

                    <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Visual Edge</span>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1]">
                                Sovereign <br />Display Nodes.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Transform your institution's communication with zero-latency visual nodes. Designed for high-density environments like large queue complexes and Annadhanam halls.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Standardized institutional branding</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Zero-configuration edge hardware deployment</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-12 opacity-5"><Monitor size={120} /></div>
                             <div className="relative z-10">
                                 <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-10">Broadcast Protocol Status</p>
                                 <div className="space-y-6">
                                     <div className="flex items-center justify-between">
                                         <span className="text-xs font-bold uppercase tracking-widest text-white/40">Node Reliability</span>
                                         <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">99.99%</span>
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

export default SignageLandingPage;
