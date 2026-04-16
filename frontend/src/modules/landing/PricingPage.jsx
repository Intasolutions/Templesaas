import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Zap, Shield, Globe, Award, Sparkles } from 'lucide-react';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const PricingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSelectPlan = (plan) => {
        // Redirect to registration with the chosen plan
        navigate(`/register?plan=${plan}`);
    };

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
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
                            icon={Zap}
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
                            icon={Shield}
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
                            icon={Award}
                            onCta={() => handleSelectPlan('PRO_MAX')}
                        />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function PricingCard({ title, price, desc, features, icon: Icon, isFeatured, onCta }) {
    return (
        <div className={`p-12 rounded-[32px] text-left transition-all duration-300 border ${
            isFeatured 
            ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-900/10' 
            : 'bg-white border-slate-100 hover:border-slate-300'
        }`}>
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-10 ${
                isFeatured ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900'
            }`}>
                <Icon size={24} />
            </div>
            
            <h3 className={`text-lg font-bold mb-2 ${isFeatured ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            <div className={`flex items-baseline gap-1 mb-2 ${isFeatured ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-xl font-bold opacity-60">₹</span>
                <span className="text-6xl font-extrabold tracking-tighter">{price}</span>
                {price !== 'Custom' && <span className="text-sm font-bold opacity-60">/mo</span>}
            </div>

            {price !== '0' && (
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-6 ${
                    isFeatured ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'
                }`}>
                    <Sparkles size={10} /> 7-Day Free Trial
                </div>
            )}

            <p className={`text-sm font-medium leading-relaxed mb-10 ${isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>
                {desc}
            </p>

            <div className="space-y-4 mb-12">
                {features.map(f => (
                    <div key={f} className="flex items-center gap-4">
                        <Check size={18} className={`shrink-0 ${isFeatured ? 'text-slate-400' : 'text-slate-400'}`} />
                        <span className={`text-[14px] font-semibold ${isFeatured ? 'text-slate-200' : 'text-slate-600'}`}>{f}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={onCta}
                className={`w-full h-14 rounded-xl font-bold text-sm transition-all ${
                    isFeatured 
                    ? 'bg-white text-slate-900 hover:bg-slate-100' 
                    : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/10'
                }`}
            >
                {price === 'Custom' ? 'Contact Sales' : 'Get Started'}
            </button>
        </div>
    )
}

export default PricingPage;
