import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Check, ArrowRight, Zap, Code, Shield, Terminal } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const DocsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                             Knowledge Base
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-10 leading-none uppercase">
                            Documentation.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            The complete guide to implementing Devalayam Control Nexus. From initial node setup to advanced fiscal auditing protocols.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <DocCard 
                            icon={Terminal} 
                            title="Quick Start" 
                            desc="Deploy your first temple node in under 10 minutes with our automated setup wizard." 
                        />
                        <DocCard 
                            icon={Code} 
                            title="API Reference" 
                            desc="Scale your institutional operations with our robust REST API and astral telemetry webhooks." 
                        />
                        <DocCard 
                            icon={Shield} 
                            title="Security Standards" 
                            desc="Understanding data isolation, encryption protocols, and heritage compliance benchmarks." 
                        />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function DocCard({ icon: Icon, title, desc }) {
    return (
        <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <Icon size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 uppercase">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed uppercase tracking-tight text-[11px] opacity-70">
                {desc}
            </p>
        </div>
    );
}

export default DocsPage;
