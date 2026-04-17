import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, ArrowRight, Shield, Globe, Layers, MapPin, Search } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const VazhipaduGateway = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-semibold mb-8 border border-slate-100">
                                 Platform Core Module
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Vazhipadu <br />
                                <span className="text-slate-400">Management.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                The industry standard for ritual booking and counter administration. Engineered for high-load festival environments and everyday precision.
                            </p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="h-14 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                Request Live Demo <ArrowRight size={18} />
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
                                    src="/vazhipadu_hero.png" 
                                    alt="Vazhipadu CMS Operations" 
                                    className="w-full h-full object-cover rounded-[5rem] group-hover:scale-105 transition-transform duration-1000"
                                />
                             </div>
                             
                             <div className="absolute -top-6 -right-6 bg-slate-900 p-4 rounded-xl text-white shadow-xl flex items-center gap-3">
                                 <div className="p-2 bg-white/10 rounded-lg">
                                    <Zap size={18} className="text-white" />
                                 </div>
                                 <p className="text-[11px] font-bold uppercase tracking-widest">Instant Sync</p>
                             </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-40 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet 
                            title="Bilingual Unicode" 
                            desc="Automatic translation between English and Malayalam for receipts and internal reports." 
                         />
                         <FeatureBullet 
                            icon={Layers}
                            title="Dual-Source Hub" 
                            desc="Unified management for both physical counter bookings (Offline) and the Devotee Portal (Online)." 
                         />
                         <FeatureBullet 
                            icon={Zap}
                            title="Dynamic Receipts" 
                            desc="Automated sequential receipt issuance with daily serialization and precision timestamps." 
                         />
                         <FeatureBullet 
                            title="Finance Handshake" 
                            desc="Real-time synchronization with the central ledger for every confirmed ritual booking." 
                         />
                         <FeatureBullet 
                            title="QR Verification" 
                            desc="Secure payload generation for Prasadam collection, ensuring zero-fraud ritual fulfillment." 
                         />
                         <FeatureBullet 
                            title="Cloud Resilience" 
                            desc="Offline-first capability ensuring counters remain operational even during internet outages." 
                         />
                         <FeatureBullet 
                            title="Prasad Logistics" 
                            desc="Integrated tracking for E-Prasad shipments with BlueDart and DHL connectivity." 
                         />
                         <FeatureBullet 
                            title="Astral Telemetry" 
                            desc="Booking logic dynamically synchronized with high-precision local lat/long panchangam data." 
                         />
                         <FeatureBullet 
                            title="Loyalty Rewards" 
                            desc="Automated reward point accrual for devotees based on institutional engagement protocols." 
                         />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function FeatureBullet({ title, desc }) {
    return (
        <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                <Check size={20} strokeWidth={3} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    )
}

export default VazhipaduGateway;
