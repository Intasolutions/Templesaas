import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Layers, Check, ArrowRight, Zap, Target } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const ManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Sovereign Operations
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Temple <br />
                                <span className="text-slate-400">Governance.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Complete administrative control for temple boards and trusts. Integrated staff permissions and multi-temple node management.
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
                                    src="/management_hero.png" 
                                    alt="Temple Management Operations" 
                                    className="w-full h-full object-cover rounded-[5rem] group-hover:scale-105 transition-transform duration-1000"
                                />
                             </div>
                             
                             {/* Institutional Badge */}
                             <div className="absolute -bottom-10 -left-10 bg-slate-900 p-8 rounded-[40px] shadow-2xl text-white z-20">
                                 <div className="flex items-center gap-4">
                                     <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold"><Layers size={20} /></div>
                                     <div>
                                         <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">Node Status</p>
                                         <p className="text-xl font-extrabold text-white leading-none">Global Ready</p>
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
                         <FeatureBullet title="Multi-Temple Hierarchy" desc="Manage hundreds of temple nodes from a single central registry for Devaswom Boards and Private Trusts." />
                         <FeatureBullet title="Staff RBAC Protocol" desc="Granular Role-Based Access Control to ensure only authorized personnel can access sensitive ledger data." />
                         <FeatureBullet title="Asset & Property Log" desc="Institutional tracking of temple properties, land, and valuable heritage assets with GPS tagging." />
                         <FeatureBullet title="Inventory Automation" desc="Real-time tracking of ritual ingredients, prasad distribution, and construction materials." />
                         <FeatureBullet title="Institutional Comms" desc="Integrated notification system for temple employees and administrators across all regional nodes." />
                         <FeatureBullet title="Legal Tracking" desc="Monitor institutional compliance, board meeting minutes, and local government mandates." />
                    </div>

                    <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Board-Level Oversight</span>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1]">
                                Centralized <br />Trust Command.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Devalayam provides temple boards with unparalleled visibility into regional operations. Monitor counter-level collections, staff attendance, and ritual throughput across all nodes in real-time.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Consolidated Financial Statements</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Regional Node Comparison Analytics</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Check size={14} /></div>
                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Audit-Ready Compliance Logs</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white">
                             <div className="flex items-center justify-between mb-12">
                                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center"><Target size={20} /></div>
                                <span className="text-[10px] uppercase font-black tracking-widest opacity-40">System Node 01</span>
                             </div>
                             <div className="space-y-8">
                                 <div>
                                     <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Total Node Capacity</p>
                                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                         <div className="h-full bg-primary w-[75%]" />
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-2 gap-8">
                                      <div>
                                          <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Active Counters</p>
                                          <p className="text-3xl font-black tracking-tighter text-white uppercase">4 Nodes</p>
                                      </div>
                                      <div>
                                          <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Audit Sync</p>
                                          <p className="text-3xl font-black tracking-tighter text-emerald-400 uppercase">100%</p>
                                      </div>
                                 </div>
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

export default ManagementPage;
