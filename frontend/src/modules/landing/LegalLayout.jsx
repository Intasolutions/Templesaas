import React from 'react';
import { motion } from 'framer-motion';
import MarketingLayout from './MarketingLayout';

const LegalLayout = ({ title, effectiveDate, children }) => {
    return (
        <MarketingLayout>
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                             Institutional & Legal
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight mb-10 leading-none uppercase">{title}.</h1>
                        <p className="text-slate-500 font-black mb-20 uppercase tracking-[0.3em] text-[10px] opacity-60">Effective Date: {effectiveDate || 'April 2026'} | Node: TVM-CORE-01</p>
                        
                        <div className="space-y-20 text-slate-600 leading-relaxed text-lg">
                            {children}
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

export default LegalLayout;
