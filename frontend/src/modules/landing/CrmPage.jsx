import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Shield, Check, ArrowRight, Database, Search } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const CrmPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Relationship Management
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Devotee <br />
                                <span className="text-slate-400">Registry.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Unified family management for sacred institutions. Track ancestry, seva history, and key milestones with military-grade privacy.
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
                                    src="/crm_hero.png" 
                                    alt="Devotee Family Heritage" 
                                    className="w-full h-full object-cover rounded-[5rem] group-hover:scale-105 transition-transform duration-1000"
                                />
                             </div>
                             
                             {/* Family Analytics Overlay */}
                             <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-50 z-20">
                                 <div className="flex items-center gap-4">
                                     <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold">NN</div>
                                     <div>
                                         <p className="text-sm font-bold text-slate-900 leading-none">Narayanan Nair</p>
                                         <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">Registry Active</p>
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
                         <FeatureBullet title="Ancestry Mapping" desc="Trace family lineage and traditional seva history across generations for institutional records." />
                         <FeatureBullet title="Unified Seva Dashboard" desc="Single-view history of all ritual bookings, donations, and institutional interactions." />
                         <FeatureBullet title="Automated Notifications" desc="Keep devotees informed via WhatsApp/SMS about upcoming poojas and key temple dates." />
                         <FeatureBullet title="Encrypted Vault" desc="Devotee data is protected with 256-bit institutional grade encryption protocols." />
                         <FeatureBullet title="Family Grouping" desc="Link multiple devotees to a single family node for simplified booking and communication." />
                         <FeatureBullet title="Heritage Analytics" desc="Gain insights into devotee demographics and participation trends for festival planning." />
                    </div>

                    <div className="mt-40 bg-slate-900 rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden group">
                         <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="relative z-10 max-w-3xl mx-auto">
                              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">Digital <br />Devotee Passport.</h2>
                              <p className="text-xl text-white/50 font-medium mb-16 leasing-relaxed uppercase tracking-widest">
                                  Every devotee interaction, ritual booking, and contribution consolidated into a single, immutable institutional record.
                              </p>
                              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                  <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest">Star Mapping Enabled</div>
                                  <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest">Secure Ancestry Nodes</div>
                              </div>
                         </div>
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

export default CrmPage;
