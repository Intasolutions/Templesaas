import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, Check, ArrowRight, Zap, Target, Star } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const PanchangamPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 High-Precision Engine
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Panchangam <br />
                                <span className="text-slate-400">API Sync.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Real-time astronomical calculations for Kerala. Automated Tithi, Nakshatra, and Malayalam Masam tracking with 99.9% precision.
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
                             <div className="relative w-full aspect-square max-w-[550px] mx-auto group">
                                <div 
                                    className="absolute inset-0 z-10"
                                    style={{
                                        background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(255,255,255,1) 90%), linear-gradient(to top, white 5%, transparent 30%)'
                                    }}
                                />
                                <img 
                                    src="/panchangam-hero.png" 
                                    alt="Celestial Temple Sync" 
                                    className="w-full h-full object-cover rounded-[5rem] group-hover:scale-105 transition-transform duration-1000"
                                />
                             </div>
                             
                             {/* Technical Overlay */}
                             <div className="absolute -bottom-10 -left-10 bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white z-20">
                                 <div className="space-y-4 font-mono">
                                     <div className="flex justify-between items-center text-amber-400 border-b border-white/10 pb-2">
                                         <span className="text-[10px] tracking-widest opacity-60">Engine Status</span>
                                         <span className="text-[10px]">SYNC_STABLE</span>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                         <p className="text-[10px] opacity-40">Precision</p>
                                         <p className="text-sm font-bold">+/- 0.2s</p>
                                     </div>
                                 </div>
                             </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-40 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet title="Geo-Aware Localisation" desc="Timings are calculated based on the exact latitude and longitude of your temple node." />
                         <FeatureBullet title="Automated Ritual Sync" desc="Pooja timings automatically update on devotee displays based on the daily Panchangam." />
                         <FeatureBullet title="Vivid 2.0 Astronomy" desc="Utilizing the latest astronomical algorithms for 100% compliance with Kerala standards." />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

const FeatureBullet = ({ title, desc }) => (
    <div className="space-y-4">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100"><Check size={20} strokeWidth={3} /></div>
        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default PanchangamPage;
