import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, Shield, Check, ArrowRight, Database, Search, Sparkles, HeartHandshake } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const CrmPage = () => {
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
                                 <HeartHandshake size={16} className="text-primary animate-pulse" />
                                 <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Devotee Module</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                                Devotee <br />
                                <span className="text-primary font-serif italic">Records.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Keep a safe list of your temple's regular families. Save their names, phone numbers, stars, and pooja history in one place.
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
                            <div className="rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-wood/5 aspect-square relative">
                                <img 
                                    src="/assets/landing/hero.png" 
                                    alt="Devotee Families" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-wood/60 to-transparent" />
                                
                                <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl border border-primary/10 hidden md:block">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-cream flex items-center justify-center text-wood font-black text-lg border border-primary/10">RK</div>
                                        <div>
                                            <p className="text-sm font-black text-wood leading-none">Rajesh Kumar</p>
                                            <p className="text-[10px] uppercase font-bold text-primary tracking-widest mt-2">Regular Devotee</p>
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
                        <h2 className="text-3xl font-black text-wood mb-4">Features for Your Devotees</h2>
                        <p className="text-wood/60">Help your temple committee build better relationships with your community.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
                         <FeatureBullet title="Pooja History" desc="See a clear list of every pooja a devotee has done at your temple." />
                         <FeatureBullet title="Star & Gothram" desc="Save the correct star and gothram details for the whole family." />
                         <FeatureBullet title="WhatsApp Alerts" desc="Automatically send festival messages and pooja reminders to their phones." />
                         <FeatureBullet title="Family Links" desc="Connect family members together so you can book poojas for the whole house easily." />
                         <FeatureBullet title="Secure & Private" desc="All devotee information is kept safe and is only visible to the temple committee." />
                         <FeatureBullet title="Quick Search" desc="Find any devotee instantly by just typing their name or phone number." />
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-wood rounded-[3rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                         <div className="absolute top-0 right-0 p-20 opacity-5"><Database size={150} /></div>
                         <div className="relative z-10 max-w-3xl mx-auto">
                              <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-8">One Record For <br />Every Family.</h2>
                              <p className="text-lg text-white/50 mb-12 max-w-xl mx-auto">
                                  Every visit, booking, and offering is kept in one secure temple record for generations to see.
                              </p>
                              <div className="flex flex-wrap gap-4 justify-center">
                                  <div className="px-8 py-4 bg-white/5 rounded-full border border-white/10 text-[11px] font-bold uppercase tracking-widest">Star Mapping</div>
                                  <div className="px-8 py-4 bg-white/5 rounded-full border border-white/10 text-[11px] font-bold uppercase tracking-widest">Family Links</div>
                                  <div className="px-8 py-4 bg-white/5 rounded-full border border-white/10 text-[11px] font-bold uppercase tracking-widest">Safe Records</div>
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

export default CrmPage;
