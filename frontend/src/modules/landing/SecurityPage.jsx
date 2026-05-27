import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Check, ArrowRight, Eye, Database, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const SecurityPage = () => {
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
                                 <Shield size={16} className="text-primary animate-pulse" />
                                 <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Trust Module</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                                Safe & <br />
                                <span className="text-primary font-serif italic">Secure.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Your temple's data is sacred. We use high-level encryption to keep your accounts, staff records, and devotee lists completely private and safe.
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
                                    alt="Temple Security" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-wood/60 to-transparent" />
                                
                                <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl border border-primary/10 hidden md:block">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold border border-emerald-500/10"><ShieldCheck size={24} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-wood/40 tracking-wider">Protection Level</p>
                                            <p className="text-base font-black text-wood tracking-tight">AES-256 BANK GRADE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-wood mb-4">Protecting Your Temple Data</h2>
                        <p className="text-wood/60">Built with the latest technology to ensure 100% privacy for your institution.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <FeatureBullet 
                            title="Private Cloud" 
                            desc="Your temple's data is kept completely separate and private from all other temples." 
                         />
                         <FeatureBullet 
                            title="Auto-Backups" 
                            desc="All temple records are automatically backed up every day so you never lose any data." 
                         />
                         <FeatureBullet 
                            title="Safe Payments" 
                            desc="We use secure encryption for every single pooja booking and donation entry." 
                         />
                         <FeatureBullet 
                            title="Staff Role Access" 
                            desc="You choose which staff can see accounts. No one else can access sensitive temple money records." 
                         />
                         <FeatureBullet 
                            title="Phone Safety" 
                            desc="Access your temple dashboard safely from your phone with secure login protection." 
                         />
                         <FeatureBullet 
                            title="Long-term History" 
                            desc="Your temple's financial and pooja history is safely archived for years and future generations." 
                         />
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-40 bg-wood rounded-[3rem] p-16 md:p-32 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-20 opacity-5"><Lock size={150} /></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 text-left">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none mb-8">
                                    Total Data <br /> Safety.
                                </h2>
                                <p className="text-lg text-white/50 leading-relaxed max-w-md">
                                    Our philosophy is simple: keep temple data safe. Every access is recorded and every entry is secure.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4 text-center lg:text-left">
                                    <p className="text-5xl font-black text-primary">24/7</p>
                                    <p className="text-[11px] uppercase font-bold text-white/30 tracking-widest">Active Safety</p>
                                </div>
                                <div className="space-y-4 text-center lg:text-left">
                                    <p className="text-5xl font-black text-white">99.9%</p>
                                    <p className="text-[11px] uppercase font-bold text-white/30 tracking-widest">System Uptime</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

const FeatureBullet = ({ title, desc }) => (
    <div className="p-10 rounded-3xl border border-wood/5 bg-cream/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-8 shadow-sm border border-wood/5 group-hover:bg-primary group-hover:text-white transition-all">
            <Check size={20} strokeWidth={3} />
        </div>
        <h4 className="text-xl font-black text-wood mb-4 uppercase tracking-tight">{title}</h4>
        <p className="text-wood/70 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default SecurityPage;
