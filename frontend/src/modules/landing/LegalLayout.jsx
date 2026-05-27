import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const LegalLayout = ({ title, effectiveDate, children }) => {
    return (
        <MarketingLayout>
            <section className="pt-32 pb-24 md:pt-48 md:pb-32 bg-cream overflow-hidden min-h-screen">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-12">
                             <ShieldCheck size={16} className="text-primary" />
                             <span className="text-[11px] font-bold uppercase tracking-widest text-wood/60">Temple & Legal</span>
                        </div> */}
                        <h1 className="text-4xl md:text-7xl font-black text-wood tracking-tight mb-8">{title}</h1>
                        <p className="text-wood/40 font-bold mb-20 uppercase tracking-widest text-[10px]">Effective Date: {effectiveDate || 'April 2026'}</p>

                        <div className="text-wood/70 leading-relaxed text-lg prose prose-orange max-w-none space-y-12">
                            {children}
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

export default LegalLayout;
