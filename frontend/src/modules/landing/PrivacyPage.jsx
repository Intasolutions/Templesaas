import React from 'react';
import { motion } from 'framer-motion';
import MarketingLayout from './MarketingLayout';

const PrivacyPage = () => {
    return (
        <MarketingLayout>
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                             Data Sovereignty
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">Privacy Policy</h1>
                        <p className="text-slate-500 font-bold mb-16 uppercase tracking-widest text-xs">Updated: April 2026</p>
                        
                        <div className="space-y-16 text-slate-600 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight uppercase">1. Our Commitment to Sacred Data</h2>
                                <p className="font-medium">At Devalayam OS, we recognize that temple data is not just information, but part of a sacred heritage. We are committed to maintaining the highest standards of data privacy and institutional sovereignty. Your devotee records and financial logs belong exclusively to your institution.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight uppercase">2. Collection with Purpose</h2>
                                <p className="font-medium">We only collect data necessary for the administrative operation of your institution (e.g., devotee names for Vazhipadu receipts, contact details for SMS alerts). We do not harvest, sell, or profile your devotees for third-party advertising.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight uppercase">3. Security Infrastructure</h2>
                                <p className="font-medium">All data is stored on encrypted regional nodes (AES-256). Periodic backups are performed every 24 hours to ensure that religious calendars and ritual bookings are never lost in case of local hardware failure.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

export default PrivacyPage;
