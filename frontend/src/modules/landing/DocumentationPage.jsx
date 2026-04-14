import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Check, ArrowRight, Zap, Target, Star, Layers, Shield } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const DocumentationPage = () => {
    return (
        <MarketingLayout>
            <section className="pt-48 pb-32 bg-white font-['Plus_Jakarta_Sans',sans-serif]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                 Technical Resources
                            </div>
                            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">Documentation</h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">Everything you need to configure and manage your Devalayam OS institutional deployment.</p>
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
                                    alt="Technical Documentation Resources" 
                                    className="w-full h-full object-cover rounded-3xl"
                                />
                             </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <DocCard title="Getting Started" desc="Quick setup guide for new temple registrations and counter configuration." icon={Zap} />
                         <DocCard title="Vazhipadu CMS" desc="Detailed instructions on ritual booking, receipting, and TCC integration." icon={Layers} />
                         <DocCard title="Audit & Accounts" desc="Configuring financial logs, Hundi tracking, and institutional reports." icon={Shield} />
                    </div>

                    <div className="mt-20 p-12 bg-slate-50 rounded-[40px] border border-slate-100 text-center">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Need personalized assistance?</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Our technical support engineers are available 24/7 for critical heritage system assistance.</p>
                        <button className="h-14 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-black transition-all active:scale-95">Contact Support Center</button>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

const DocCard = ({ title, desc, icon: Icon }) => (
    <div className="p-10 bg-white border border-slate-100 rounded-3xl hover:border-slate-300 transition-all duration-300 group cursor-pointer shadow-sm">
        <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <Icon size={20} />
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-4">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
);

export default DocumentationPage;
