import { motion } from 'framer-motion';
import { Clock, Phone, Mail, MessageSquare, Check, ArrowRight, Shield } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const SupportPage = () => {
    return (
        <MarketingLayout>
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 24/7 Availability
                            </div>
                            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">Support Center</h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">Dedicated technical lineage support for Kerala's sacred institutions.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
                             <div className="relative w-full aspect-video group">
                                <div 
                                    className="absolute inset-0 z-10"
                                    style={{
                                        background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(255,255,255,1) 90%), linear-gradient(to top, white 5%, transparent 30%)'
                                    }}
                                />
                                <img 
                                    src="/resources-hero.png" 
                                    alt="Institutional Support Center" 
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                             </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <SupportMethod title="Crisis Line" contact="+91 471 234 5678" desc="Immediate assistance for critical node failures." icon={Phone} />
                         <SupportMethod title="Technical Core" contact="support@devalayam.os" desc="Configuration and API integration assistance." icon={Mail} />
                         <SupportMethod title="Live Relay" contact="@DevalayamNode" desc="Real-time status updates and quick troubleshooting." icon={MessageSquare} />
                    </div>

                    <div className="mt-32 p-16 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Institutional SLA</h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-xl">Every 'Major Devaswom' and 'Royal Heritage' license includes guaranteed 15-minute response times for critical administrative events.</p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">99.9% Uptime SLA</div>
                                <div className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest">Priority Node Support</div>
                            </div>
                        </div>
                        <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 opacity-50" />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

const SupportMethod = ({ title, contact, desc, icon: Icon }) => (
    <div className="p-10 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
        <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mx-auto mb-8 font-bold">
            <Icon size={24} />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-900 font-extrabold text-lg mb-4">{contact}</p>
        <p className="text-slate-500 text-sm font-medium">{desc}</p>
    </div>
);

export default SupportPage;
