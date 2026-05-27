import { motion } from 'framer-motion';
import { Clock, HelpCircle, Check, ArrowRight, Zap, Target, Star, Mail, Phone, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from './MarketingLayout';

const SupportPage = () => {
    const navigate = useNavigate();

    return (
        <MarketingLayout>
            
            {/* ── Hero ── */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                        <MessageSquare size={16} className="text-primary" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Support Team</span>
                    </div>
                    <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                        We are Here <br />
                        <span className="text-primary font-serif italic">to Help.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                        Need help with pooja booking or accounts? Our dedicated support team is available 24/7 to assist your temple staff.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
                        <SupportCard 
                            icon={Phone} 
                            title="Call Support" 
                            desc="Talk directly to our support team for quick help with any temple issue." 
                            action="+91 98765 43210"
                        />
                        <SupportCard 
                            icon={MessageSquare} 
                            title="WhatsApp Us" 
                            desc="Send us a message on WhatsApp for easy guides and video support." 
                            action="+91 98765 43211"
                        />
                    </div>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-black text-wood mb-4">Why Temples Trust Us</h2>
                        <p className="text-wood/60">We don't just provide software; we provide a partnership.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-3xl bg-cream/30 border border-wood/5">
                            <h4 className="text-lg font-black text-wood mb-4 uppercase">24/7 Availability</h4>
                            <p className="text-sm text-wood/60">Temples never sleep, and neither do we. Call us anytime, day or night.</p>
                        </div>
                        <div className="p-10 rounded-3xl bg-cream/30 border border-wood/5">
                            <h4 className="text-lg font-black text-wood mb-4 uppercase">Direct Assistance</h4>
                            <p className="text-sm text-wood/60">No automated voices. Talk directly to a real person who understands your temple.</p>
                        </div>
                        <div className="p-10 rounded-3xl bg-cream/30 border border-wood/5">
                            <h4 className="text-lg font-black text-wood mb-4 uppercase">Safe & Reliable</h4>
                            <p className="text-sm text-wood/60">99.9% system uptime guaranteed so your counters are never down.</p>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 bg-wood rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl text-center"
                    >
                        <div className="absolute top-0 right-0 p-20 opacity-5"><Target size={150} /></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                             <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-8">
                                Trusted by <br />
                                <span className="text-primary font-serif italic">100+ Temples.</span>
                             </h2>
                             <p className="text-lg text-white/50 mb-10">
                                Our support team is highly rated by temple committees for being fast, polite, and professional.
                             </p>
                             <button onClick={() => navigate('/demo')} className="h-14 px-10 rounded-full bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-orange-700 transition-all">
                                Join the Community
                             </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function SupportCard({ icon: Icon, title, desc, action }) {
    return (
        <div className="p-12 bg-white border border-wood/5 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start shadow-sm">
            <div className="h-16 w-16 bg-cream rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all">
                <Icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-wood tracking-tight mb-4 uppercase">{title}</h3>
            <p className="text-sm text-wood/60 leading-relaxed mb-10">
                {desc}
            </p>
            <div className="text-2xl font-black text-primary tracking-tight">
                {action}
            </div>
        </div>
    );
}

export default SupportPage;
