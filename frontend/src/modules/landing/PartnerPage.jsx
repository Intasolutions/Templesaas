import React from 'react';
import { motion } from 'framer-motion';
import MarketingLayout from './MarketingLayout';

const PartnerPage = () => {
    return (
        <MarketingLayout>
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                             Ecosystem Growth
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">Partner Policy</h1>
                        <p className="text-slate-500 font-bold mb-16 uppercase tracking-widest text-xs">Official Partner Program 2026</p>
                        
                        <div className="space-y-16 text-slate-600 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight uppercase">1. Authorized Reseller Network</h2>
                                <p className="font-medium">Devalayam OS partners with verified heritage technology consultants and Devaswom Board advisors. Partners are authorized to facilitate onboarding and configuration of the platform within institutional environments.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight uppercase">2. Integrity & Ethics</h2>
                                <p className="font-medium">All partners must adhere to strict ethical guidelines regarding temple administration. Any misrepresentation of platform fees or unauthorized access to institutional data will result in immediate termination of partner status.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight uppercase">3. Technical Integration</h2>
                                <p className="font-medium">Technology partners may integrate via our Panchangam and Seva APIs under the 'Royal Heritage' tier. All integrations must pass security validation by Devalayam Systems core node administrators.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

export default PartnerPage;
