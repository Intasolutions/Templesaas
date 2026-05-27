import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Clock, Check, ArrowRight, Zap, Target, Star, Sparkles } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const PanchangamPage = () => {
    const navigate = useNavigate();

    return (
        <MarketingLayout>
            {/* ── Hero ── */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                                <Star size={16} className="text-primary animate-pulse" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Star-Based Accuracy</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                                Correct <br />
                                <span className="text-primary font-serif italic">Pooja Timings.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Our software uses your temple's exact location to calculate the correct Tithi, Nakshatra, and Pooja times every single day.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => navigate('/demo')} 
                                    className="h-16 px-10 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 group active:scale-95"
                                >
                                    Try It Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-wood/5 aspect-square relative">
                                <img 
                                    src="/assets/landing/hero.png" 
                                    alt="Temple Timings" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-wood/60 to-transparent" />
                                
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white hidden md:block">
                                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Status</span>
                                        <span className="text-[10px] font-black uppercase text-green-400">100% Accurate</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Precision</p>
                                            <p className="text-2xl font-black">ISO Sync</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Updates</p>
                                            <p className="text-2xl font-black">Real-Time</p>
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
                        <h2 className="text-3xl font-black text-wood mb-4">How It Helps Your Temple</h2>
                        <p className="text-wood/60">Automated calculations so your staff can focus on the rituals.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <FeatureBullet 
                            title="Location Accurate" 
                            desc="Timings are calculated based on your temple's exact latitude and longitude." 
                         />
                         <FeatureBullet 
                            title="Auto-Update Screens" 
                            desc="Display screens automatically show today's pooja times based on the star." 
                         />
                         <FeatureBullet 
                            title="Zero Mistakes" 
                            desc="Built-in panchangam ensures priests never book a pooja at the wrong time." 
                         />
                    </div>
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

export default PanchangamPage;
