import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Check, ArrowRight, Eye, Database, Zap } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const SecurityPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Institutional Governance
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Trust & <br />
                                <span className="text-slate-400">Security.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Military-grade data isolation and end-to-end encryption for the most sensitive temple records. Heritage compliance by design.
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
                                    src="/security-hero.png" 
                                    alt="Institutional Vault Security" 
                                    className="w-full h-full object-cover rounded-[5rem] group-hover:scale-105 transition-transform duration-1000"
                                />
                             </div>
                             
                             {/* Security Badge */}
                             <div className="absolute -bottom-10 -left-10 bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white z-20">
                                 <div className="flex items-center gap-4">
                                     <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 font-bold"><Shield size={20} /></div>
                                     <div>
                                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">Protection Level</p>
                                         <p className="text-xl font-extrabold text-white leading-none">AES-256 Core</p>
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
                         <FeatureBullet title="Data Sovereignty" desc="Your institutional data remains yours. We use private storage nodes that ensure zero third-party access." />
                         <FeatureBullet title="Audit Log Integrity" desc="Every transaction and ritual booking is logged with an immutable audit trail for complete transparency." />
                         <FeatureBullet title="Heritage Compliance" desc="Designed to meet the specific legal and religious compliance standards of Kerala Devaswom Boards." />
                    </div>
                </div>
            </section>
            <section className="py-40 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet title="Institutional Isolation" desc="Multi-tenant architecture ensures that your institution's data is logically and physically siloed from others." />
                         <FeatureBullet title="Regional Redundancy" desc="Data is continuously backed up across multiple regional nodes (TVM-CORE, EKM-RESERVE) for disaster recovery." />
                         <FeatureBullet title="Z-Leak Auditing" desc="End-to-end encryption for every transaction record, ensuring zero leakage of sensitive financial data." />
                         <FeatureBullet title="Biometric Integration" desc="Support for advanced physical counter security via biometric staff authentication and identity protocols." />
                         <FeatureBullet title="Cloud Security Alliance" desc="Built following CSA guidelines for secure cloud infrastructure and institutional data safety." />
                         <FeatureBullet title="Heritage Protocol" desc="Digital preservation of administrative records in compliance with long-term heritage archival laws." />
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

export default SecurityPage;
