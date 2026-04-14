import React from 'react';
import { motion } from 'framer-motion';
import MarketingLayout from './MarketingLayout';

const TermsPage = () => {
    return (
        <MarketingLayout>
            <section className="pt-48 pb-32 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-semibold mb-8 border border-slate-100">
                             Legal & Governance
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">Terms of Service</h1>
                        <p className="text-slate-500 font-bold mb-16 uppercase tracking-widest text-xs">Effective Date: April 2026 | Node: TVM-CORE-01</p>
                        
                        <div className="space-y-16 text-slate-600 leading-relaxed text-lg">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">1. Acceptance of Terms</h2>
                                <p className="font-medium">By accessing and utilizing Devalayam OS ("the Platform"), you, representing a Temple Trust, Devaswom Board, or authorized administrative body, agree to be bound by these Terms of Service. The Platform is provided by Devalayam Systems to facilitate heritage administration, receipt generation, and auditing.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">2. Software Usage & Licensing</h2>
                                <p className="font-medium">Devalayam grants you a non-exclusive, non-transferable, revocable license to use the Platform strictly for internal temple administration. You may not distribute, lease, or reverse-engineer the source code. The "Heritage Enterprise" tier provides specific SLA guarantees which are detailed in your institutional contract.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">3. Sacred Data Integrity & Liability</h2>
                                <p className="font-medium">While the Platform employs institutional-grade encryption for all Devotee CRM and Hundi Analytics data, the Temple Trust remains the sole custodian of its data. Devalayam Systems shall not be held liable for discrepancies in physical cash counting or unauthorized modifications to Vazhipadu receipts made by authorized staff credentials.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">4. Compliance with Kerala Standards</h2>
                                <p className="font-medium">The Platform is engineered to comply with state heritage laws and standard Devaswom auditing practices. However, users are responsible for ensuring that their specific usage, particularly regarding online donation collection, complies with local laws, tax regulations, and religious compliance mandates.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">5. Service Availability</h2>
                                <p className="font-medium">Devalayam OS operates on high-availability regional nodes (TVM-CORE-01). We strive for 99.9% uptime, recognizing the critical nature of temple scheduling. Scheduled maintenance will be communicated at least 48 hours in advance, typically during non-peak hours aligned with the temple calendar.</p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

export default TermsPage;
