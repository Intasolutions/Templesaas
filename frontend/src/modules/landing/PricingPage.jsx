import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Zap, Shield, Globe, Award, Sparkles } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
const PricingPage = () => {
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        // Redirect to registration with the chosen plan
        navigate(`/register?plan=${plan}`);
    };

    return (
        <MarketingLayout>
            
            <section className="pt-48 pb-40 bg-white relative overflow-hidden">
                {/* Subtle Blended Background for Pricing */}
                <div 
                    className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none z-0"
                    style={{
                        background: 'radial-gradient(circle at 70% 30%, transparent 20%, white 90%)'
                    }}
                >
                    <img src="/temple-hero-blended.png" className="w-full h-full object-cover grayscale opacity-50" alt="" />
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-semibold mb-8 border border-slate-100">
                         Institutional Licensing
                    </div>
                    <h1 className="text-5xl md:text-[76px] font-extrabold tracking-tight text-slate-900 mb-8">
                        Predictable pricing for <br />
                        <span className="text-slate-400">Every Heritage Size.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-24 leading-relaxed">
                        No hidden fees. Institutional infrastructure designed for the sanctity of heritage institutions.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <PricingCard 
                            title="Heritage Lite"
                            price="1,500"
                            desc="For local community temples starting their digital journey."
                            features={[
                                "Bilingual Receipt Entry",
                                "Basic Devotee Registry",
                                "Annual Hundi Log",
                                "Standard Email Support"
                            ]}
                            onCta={() => handleSelectPlan('LITE')}
                        />

                        <PricingCard 
                            title="Major Devaswom (PRO)"
                            price="2,500"
                            desc="Infrastructure for institutions with complex sevas & high traffic."
                            features={[
                                "Multi-Counter TCC Display",
                                "Integrated Audit Engine",
                                "Panchangam API Access",
                                "SMS & WhatsApp Alerts",
                                "E-Prasad Logistics Node"
                            ]}
                            isFeatured
                            onCta={() => handleSelectPlan('PRO')}
                        />

                        <PricingCard 
                            title="Institution Max"
                            price="3,000"
                            desc="Customized ecosystem for mega-temples and Boards."
                            features={[
                                "Dedicated Regional Server",
                                "Asset & Property Registry",
                                "Full Compliance Auditing",
                                "24/7 Dedicated Support",
                                "Biometric Staff Tracking"
                            ]}
                            onCta={() => handleSelectPlan('PRO_MAX')}
                        />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function PricingCard({ title, price, desc, features, isFeatured, onCta }) {
    return (
        <div className={`p-10 lg:p-12 rounded-[40px] text-left transition-all duration-300 border ${
            isFeatured 
            ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-900/10 scale-105 z-20' 
            : 'bg-white border-slate-100 hover:border-slate-200 z-10'
        }`}>
            <h3 className={`text-xl font-extrabold mb-4 tracking-tight ${isFeatured ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            
            <div className={`flex items-baseline gap-2 mb-4 ${isFeatured ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-3xl font-bold opacity-80">₹</span>
                <span className="text-7xl font-extrabold tracking-tighter">{price}</span>
                <span className="text-lg font-bold opacity-60">/mo</span>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider mb-8 ${
                isFeatured ? 'bg-orange-600/20 text-orange-500' : 'bg-orange-50 text-orange-600'
            }`}>
                <Sparkles size={12} className="fill-current" /> 3-Day Free Trial
            </div>

            <p className={`text-[15px] font-medium leading-relaxed mb-12 min-h-[48px] ${isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>
                {desc}
            </p>

            <div className="space-y-5 mb-14">
                {features.map(f => (
                    <div key={f} className="flex items-center gap-4">
                        <Check size={20} className={`shrink-0 ${isFeatured ? 'text-slate-500' : 'text-slate-300'}`} />
                        <span className={`text-[15px] font-bold tracking-tight ${isFeatured ? 'text-slate-200' : 'text-slate-700'}`}>{f}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={onCta}
                className={`w-full h-16 rounded-2xl font-black text-[15px] tracking-tight transition-all active:scale-[0.98] ${
                    isFeatured 
                    ? 'bg-white text-slate-900 hover:bg-slate-50 shadow-xl shadow-white/5' 
                    : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/10'
                }`}
            >
                Get Started
            </button>
        </div>
    )
}

export default PricingPage;
