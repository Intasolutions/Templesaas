import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle, Check, ArrowRight, Zap, Target, Star, Mail, Phone } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const SupportPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                             Institutional Support
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-10 leading-none uppercase">
                            Help Center.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Our support nodes are active 24/7. Get dedicated assistance for technical setups, ritual management, and board-level reporting.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <SupportCard 
                            icon={Mail} 
                            title="Direct Node Support" 
                            desc="Institutional support via email or our internal messaging node." 
                            action="support@devalayam.os"
                        />
                        <SupportCard 
                            icon={Phone} 
                            title="Emergency Override" 
                            desc="24/7 line for critical infrastructure issues such as payment gateways or display outages." 
                            action="+91 1800-DEVALAYAM"
                        />
                    </div>

                    <div className="mt-40 bg-slate-950 rounded-[4rem] p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 opacity-5"><Target size={120} /></div>
                        <div className="max-w-xl relative z-10">
                             <h2 className="text-4xl font-black tracking-tighter uppercase leading-[1.1] mb-10">
                                Global <br /> SLA Protocols.
                             </h2>
                             <p className="text-lg text-white/50 font-medium leading-relaxed mb-12">
                                Every institution is backed by a legally binding Service Level Agreement (SLA) with guaranteed response times and node reliability.
                             </p>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function SupportCard({ icon: Icon, title, desc, action }) {
    return (
        <div className="p-12 bg-slate-50 border border-slate-100 rounded-[3rem] hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm mb-10 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <Icon size={24} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-6 uppercase">{title}</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8 uppercase tracking-tight text-[11px] opacity-70">
                {desc}
            </p>
            <div className="text-xl font-bold text-slate-900 tracking-tighter">
                {action}
            </div>
        </div>
    );
}

export default SupportPage;
