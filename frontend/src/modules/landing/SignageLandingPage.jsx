import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tv, Check, ArrowRight, Zap, Play, Layout, Activity, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from './MarketingLayout';

const SignageLandingPage = () => {
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
                                 <Monitor size={16} className="text-primary animate-pulse" />
                                 <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Visual Module</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                                TV Display <br />
                                <span className="text-primary font-serif italic">Screens.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Manage your temple's TV screens from one place. Show token numbers, pooja times, and festival announcements easily.
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
                            <div className="rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-wood/5 aspect-video relative">
                                <img 
                                    src="/assets/landing/signage.png" 
                                    alt="Temple TV Display" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-wood/60 to-transparent" />
                                <div className="absolute top-6 right-6 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]" />
                                    <span className="text-[10px] font-bold uppercase text-white tracking-widest">Live Display</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Key Metrics ── */}
            <section className="py-24 bg-wood border-y border-white/10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 divide-x divide-white/10 text-center">
                        <MetricCard count="4K" label="Clear Quality" />
                        <MetricCard count="FAST" label="Real-time Sync" />
                        <MetricCard count="EASY" label="Remote Control" />
                        <MetricCard count="AUTO" label="Daily Timings" />
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-wood mb-4">A Better Experience for Devotees</h2>
                        <p className="text-wood/60">Keep your temple crowd organized and informed with clear TV displays.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
                         <FeatureBullet 
                            title="Live Token Display" 
                            desc="Show current pooja numbers on the screen as soon as they are called." 
                         />
                         <FeatureBullet 
                            title="Bilingual Text" 
                            desc="Show announcements in English and Malayalam with beautiful, clear fonts." 
                         />
                         <FeatureBullet 
                            title="One Dashboard" 
                            desc="Change what is showing on all your temple screens from one simple computer screen." 
                         />
                         <FeatureBullet 
                            title="Auto-Panchangam" 
                            desc="Automatically show today's Star, Tithi, and Malayalam date on the TV." 
                         />
                         <FeatureBullet 
                            title="Festival Notices" 
                            desc="Quickly put up messages about special poojas or festival dates for everyone to see." 
                         />
                         <FeatureBullet 
                            title="Works Offline" 
                            desc="The screens will keep working even if your temple's internet is slow." 
                         />
                    </div>

                    <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-[12px] font-bold text-primary uppercase tracking-widest">Visual Communication</span>
                            <h2 className="text-4xl md:text-5xl font-black text-wood tracking-tight leading-[1.1]">
                                Modern Displays for <br />
                                <span className="text-primary font-serif italic">Modern Temples.</span>
                            </h2>
                            <p className="text-lg text-wood/70 leading-relaxed max-w-lg">
                                Stop using chalkboards or paper notices. Professional TV screens make your temple look organized and respect the time of your devotees.
                            </p>
                        </div>
                        <div className="bg-wood rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><Tv size={120} /></div>
                             <div className="relative z-10">
                                 <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-10">Display Status</p>
                                 <div className="space-y-8">
                                     <div className="flex items-center justify-between">
                                         <span className="text-xs font-bold uppercase tracking-widest text-white/40">Sync Reliability</span>
                                         <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">99.9%</span>
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

export default SignageLandingPage;
