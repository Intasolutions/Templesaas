import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Shield, Layers, Check, Globe, 
  TrendingUp, Users, Zap, Clock, Lock, CheckCircle2,
  Tv, Monitor, Database, Sparkles, Activity, ShieldCheck,
  Package, MapPin, Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            {/* ── Hero: Global Standard SaaS ───────────────────── */}
            <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.03),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 text-slate-900 text-[13px] font-bold mb-10 border border-slate-900/5 backdrop-blur-sm">
                                <Sparkles size={14} className="text-amber-500" />
                                <span className="uppercase tracking-widest">Institutional OS v3.0</span>
                            </div>
                            <h1 className="text-6xl md:text-[92px] font-black leading-[0.9] tracking-tighter text-slate-900 mb-10">
                                The Complete <br />
                                <span className="text-slate-400">Temple OS.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12 max-w-lg">
                                The all-in-one infrastructure for modern temple administration, ritual automation, and seamless devotee interaction. 
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-16 px-10 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:bg-black transition-all flex items-center justify-center gap-3 group active:scale-95"
                                >
                                    Establish Node <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-16 px-10 rounded-2xl border-2 border-slate-200 text-slate-900 font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center justify-center active:scale-95"
                                >
                                    Book Walkthrough
                                </button>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative"
                        >
                            {/* Browser Frame for "Real" App Feel */}
                            <div className="rounded-2xl border border-slate-200 shadow-[0_64px_128px_-32px_rgba(15,23,42,0.2)] overflow-hidden bg-white group">
                                <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                    </div>
                                    <div className="flex-1 max-w-md h-5 bg-white border border-slate-200 rounded-md mx-auto" />
                                </div>
                                <div className="p-0">
                                    <img 
                                        src="/real_software_screenshot.png" 
                                        alt="Devalayam Control Nexus" 
                                        className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.02]"
                                    />
                                </div>
                            </div>
                            
                            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-[280px] hidden md:block z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Protocol Check</p>
                                        <p className="text-base font-black text-slate-900 tracking-tight">Node Verified</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, delay: 1 }}
                                        className="h-full bg-emerald-500" 
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Key Platform Pillars: Analytics ──────────────── */}
            <section className="py-24 bg-slate-950 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 blur-[120px]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
                        <MetricCard count="100%" label="Operational Accuracy" isDark />
                        <MetricCard count="REAL-TIME" label="Registry Sync" isDark />
                        <MetricCard count="AES-256" label="Data Security" isDark />
                        <MetricCard count="GLOBAL" label="Scale Readiness" isDark />
                    </div>
                </div>
            </section>

            {/* ── Features Group 1: The Administrative Core ────── */}
            <section className="py-40 bg-white" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-40">
                        <div className="space-y-8">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Command Center</span>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1]">
                                Sovereign <br />Administrative Suite.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                                A centralized operating system for ritual booking, inventory control, and financial auditing. Engineered for high-load environments with zero-latency synchronization.
                            </p>
                            <ul className="space-y-6 pt-6">
                                <li className="flex items-start gap-4">
                                     <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Check size={12} strokeWidth={4} /></div>
                                     <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Real-time TCC Synchronization Across Counters</p>
                                </li>
                                <li className="flex items-start gap-4">
                                     <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Check size={12} strokeWidth={4} /></div>
                                     <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Automated Hundi Auditing & Remittance Reports</p>
                                </li>
                                <li className="flex items-start gap-4">
                                     <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Check size={12} strokeWidth={4} /></div>
                                     <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Low-stock Alerts for Ritual Ingredients</p>
                                </li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                             <FeatureCard small title="Ritual Registry" icon={Zap} desc="Automated Pooja booking with Nakshatra-aware scheduling and token issuance." />
                             <FeatureCard small title="Fiscal Ledger" icon={Activity} desc="Secure Hundi audits and donation tracking with multi-witness verification." />
                             <FeatureCard small title="Annadhanam Ops" icon={Package} desc="Scalable kitchen resource management and production registry for mass feeding." />
                             <FeatureCard small title="Staff Hub" icon={Clock} desc="GPS-verified attendance and duty management for temple personnel." />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 lg:order-1"
                        >
                            <div className="rounded-[4rem] border-[16px] border-slate-900 shadow-2xl overflow-hidden bg-slate-950 aspect-video relative group">
                                  <img 
                                    src="/live_tv_signage_mockup.png" 
                                    alt="Signage Node" 
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                                  <div className="absolute top-10 right-10 flex items-center gap-2">
                                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                                     <span className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Live Feed</span>
                                  </div>
                            </div>
                        </motion.div>
                        <div className="space-y-8 order-1 lg:order-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Devotee Experience</span>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1]">
                                Digital Signage <br />Broadcast Node.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                                Automate your temple's visual communication with high-fidelity SIGNAGE displays. Show live ritual schedules, weather-synced panchangam, and festival notices.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-6">
                                 <div>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">4K HDR</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Output Fidelity</p>
                                 </div>
                                 <div>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">LIVE SYNC</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Response Node</p>
                                 </div>
                            </div>
                            <button 
                                onClick={() => navigate('/tv-display')}
                                className="h-14 px-8 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 shadow-xl hover:bg-black transition-all active:scale-95"
                            >
                                Preview Interface <Monitor size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Operational Modules: Deep Dive ────────────────── */}
            <section className="py-40 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">System Architecture</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mt-6">
                            Institutional <br />Administrative Core.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ModuleDetail 
                            title="Ritual Management" 
                            desc="End-to-end Pooja and Vazhipadu automation with real-time token tracking and Nakshatra-aware booking logic."
                        />
                        <ModuleDetail 
                            title="Fiscal Auditing" 
                            desc="Secure Hundi collection recording with multi-witness verification protocols and automated revenue analysis."
                        />
                        <ModuleDetail 
                            title="Annadhanam Ops" 
                            desc="Resource allocation and production registry for mass feeding programs, integrated with inventory stock levels."
                        />
                        <ModuleDetail 
                            title="Staff & Biometrics" 
                            desc="GPS-verified attendance and shift management for temple personnel, ensuring operational transparency."
                        />
                        <ModuleDetail 
                            title="Inventory Control" 
                            desc="Automated deduction of ritual ingredients and temple assets tracking with low-stock predictive alerts."
                        />
                        <ModuleDetail 
                            title="Public Signage" 
                            desc="High-fidelity broadcast nodes for real-time queue status, ritual timings, and festival announcements."
                        />
                    </div>
                </div>
            </section>

            {/* ── Advanced Capabilities: Pillars ───────────────── */}
            <section className="py-40 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <CapabilityCard 
                            title="Astro-Logic Sync" 
                            desc="Precision Panchangam integration for accurate Malayalam Masam, Tithi, and Nakshatra-based ritual scheduling." 
                            icon={Globe}
                            highlights={['Kerala Calendar Default', 'Solar/Lunar Alignment', 'Dinam Transitions']}
                        />
                        <CapabilityCard 
                            title="Global E-Prasad Hub" 
                            desc="Integrated logistics engine with BlueDart and DHL connectivity for tracked Prasad distribution worldwide." 
                            icon={Truck}
                            highlights={['Live Shipping Labels', 'Transit Analytics', 'Customs Clearance']}
                        />
                        <CapabilityCard 
                            title="Audit Assurance" 
                            desc="Bank-grade security with immutable audit trails for every collection, donation, and administrative action." 
                            icon={Lock}
                            highlights={['Witness Protocol', 'Hashing Security', 'Admin Overwatch']}
                        />
                    </div>
                </div>
            </section>

            {/* ── CTA: Minimalist ────────────────────────────── */}
            <section className="py-20 md:py-40 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-slate-900 rounded-[4rem] px-12 py-24 md:p-32 text-center text-white relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 p-32 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Sparkles size={160} /></div>
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-12 leading-[1.05] uppercase">Establish <br />Sacred Infrastructure.</h2>
                            <p className="text-xl text-white/50 font-medium mb-16 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                                Join 500+ Institutions Managing Heritage with Digital Excellence.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-20 px-12 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-white/10 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    Initialize Protocol
                                </button>
                                <button onClick={() => setIsModalOpen(true)} className="h-20 px-12 rounded-2xl border-2 border-white/10 text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/5 transition-all">
                                    Request Clearance
                                </button>
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
            <h3 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{count}</h3>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{label}</p>
        </div>
    );
}

function FeatureCard({ title, desc, icon: Icon, small }) {
    return (
        <div className={`bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:border-slate-300 transition-all duration-500 group relative overflow-hidden ${small ? 'p-8' : ''}`}>
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform ${small ? 'p-6' : ''}`}>
                <Icon size={48} />
            </div>
            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <Icon size={20} />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-4 uppercase tracking-tight">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2 uppercase tracking-tight opacity-70">{desc}</p>
        </div>
    );
}

function CapabilityCard({ title, desc, icon: Icon, highlights }) {
    return (
        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 hover:border-slate-400 transition-all duration-500 group">
             <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-slate-900/40">
                <Icon size={32} />
             </div>
             <h4 className="text-2xl font-black text-slate-900 mb-6 tracking-tighter uppercase">{title}</h4>
             <p className="text-slate-500 font-medium leading-relaxed mb-10 tracking-tight">{desc}</p>
             <div className="space-y-4">
                 {highlights.map(h => (
                     <div key={h} className="flex items-center gap-3">
                         <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</span>
                     </div>
                 ))}
             </div>
        </div>
    )
}

function ModuleDetail({ title, desc }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
            <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" /> {title}
            </h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-tight opacity-70">
                {desc}
            </p>
        </div>
    );
}

export default LandingPage;
