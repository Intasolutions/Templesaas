import { motion } from 'framer-motion';
import { BookOpen, Search, Check, ArrowRight, Zap, Code, Shield, Terminal, HelpCircle, FileText } from 'lucide-react';
import MarketingLayout from './MarketingLayout';

const DocsPage = () => {
    return (
        <MarketingLayout>
            
            {/* ── Hero ── */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                        <BookOpen size={16} className="text-primary" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Help Center</span>
                    </div>
                    <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8 uppercase">
                        How to Use <br />
                        <span className="text-primary font-serif italic">TempleSaaS.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                        Simple, step-by-step guides for temple staff. Learn how to book poojas, manage accounts, and use the dashboard in minutes.
                    </p>
                </div>
            </section>

            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <DocCard 
                            icon={Zap} 
                            title="Quick Start" 
                            desc="How to log in and print your first pooja receipt in less than 5 minutes." 
                        />
                        <DocCard 
                            icon={FileText} 
                            title="Daily Accounts" 
                            desc="Learn how to check your daily income and download account reports for the committee." 
                        />
                        <DocCard 
                            icon={Shield} 
                            title="Staff Setup" 
                            desc="How to add staff members and give them permission to use the temple counter." 
                        />
                        <DocCard 
                            icon={HelpCircle} 
                            title="Common Questions" 
                            desc="Find answers to the most common questions asked by temple office managers." 
                        />
                        <DocCard 
                            icon={Search} 
                            title="Finding Records" 
                            desc="How to search for old pooja receipts or devotee history using phone numbers." 
                        />
                        <DocCard 
                            icon={ArrowRight} 
                            title="New Features" 
                            desc="Check out the latest updates we've added to help your temple run even better." 
                        />
                    </div>

                    <div className="mt-32 p-12 rounded-[2.5rem] bg-cream border border-wood/5 text-center">
                        <h3 className="text-2xl font-black text-wood mb-4">Still need help?</h3>
                        <p className="text-wood/60 mb-8 max-w-md mx-auto">Our support team is available 24/7 to help you over a phone call or WhatsApp.</p>
                        <button 
                            onClick={() => window.location.href = 'tel:+919876543210'}
                            className="h-14 px-10 rounded-full bg-wood text-white font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                        >
                            Call Support Now
                        </button>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function DocCard({ icon: Icon, title, desc }) {
    return (
        <div className="p-10 rounded-3xl border border-wood/5 bg-cream/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-8 shadow-sm border border-wood/5 group-hover:bg-primary group-hover:text-white transition-all">
                <Icon size={20} />
            </div>
            <h3 className="text-xl font-black text-wood tracking-tight mb-4 uppercase">{title}</h3>
            <p className="text-wood/70 text-sm leading-relaxed">
                {desc}
            </p>
        </div>
    );
}

export default DocsPage;
