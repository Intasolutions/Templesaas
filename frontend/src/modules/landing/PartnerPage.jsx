import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const PartnerPage = () => {
    return (
        <MarketingLayout>
            <section className="pt-32 pb-24 md:pt-48 md:pb-32 bg-cream overflow-hidden min-h-screen">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-12">
                             <Users size={16} className="text-primary" />
                             <span className="text-[11px] font-bold uppercase tracking-widest text-wood/60">Community Program</span>
                        </div>
                        <h1 className="text-5xl md:text-[84px] font-black text-wood tracking-tight mb-10 leading-[0.9] uppercase">Partner <br /><span className="text-primary font-serif italic">Program.</span></h1>
                        <p className="text-wood/40 font-bold mb-20 uppercase tracking-widest text-[10px]">Official Program 2026</p>
                        
                        <div className="space-y-16 text-wood/70 leading-relaxed text-lg prose prose-orange max-w-none">
                            <section>
                                <h2 className="text-2xl font-black text-wood mb-6 tracking-tight uppercase">1. Become a Partner</h2>
                                <p>We work with temple technology experts and advisors who want to help temples go digital. Partners help with the initial setup and training of temple staff.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-wood mb-6 tracking-tight uppercase">2. Rules & Ethics</h2>
                                <p>All partners must respect the sacred traditions of the temples they work with. We expect honesty regarding pricing and a helpful attitude toward the temple committees.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-wood mb-6 tracking-tight uppercase">3. How to Join</h2>
                                <p>If you are interested in becoming an official TempleSaaS partner, please contact our support team. We provide training and special dashboard access for our partners.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

export default PartnerPage;
