import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, Check, CalendarDays, Monitor, Sparkles, ScrollText, ShieldCheck,
    Truck, Users, HeartHandshake, Banknote, Wallet, Package, PartyPopper,
    ListOrdered, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from './MarketingLayout';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <MarketingLayout>
            {/* ── Hero: Simple & Clear ───────────────────── */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                                <Sparkles size={16} className="text-primary animate-pulse" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Temple Management Software</span>
                            </div>
                            <h1 className="text-5xl md:text-[84px] font-black leading-[0.95] tracking-tight text-wood mb-8">
                                Simple Software <br />
                                <span className="text-primary">For Your Temple.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-wood/70 font-medium leading-relaxed mb-12 max-w-lg">
                                Manage pooja bookings, daily income, and temple activities easily. Built specially for temple committees and office staff.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/demo')}
                                    className="h-16 px-10 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 group active:scale-95"
                                >
                                    Book a Free Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="h-16 px-10 rounded-full bg-white text-wood font-bold text-sm border border-wood/10 hover:bg-wood/5 transition-all flex items-center justify-center"
                                >
                                    See How It Works
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="rounded-[2rem] border-8 border-white shadow-2xl overflow-hidden bg-wood/5 aspect-[4/5] relative">
                                <img
                                    src="/assets/landing/hero.png"
                                    alt="Temple Image"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-wood/60 to-transparent" />

                                {/* Floating Trust Badge */}
                                <div className="absolute bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-primary/10 max-w-[260px] hidden md:block">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-wood/50 tracking-wider">Daily Reports</p>
                                            <p className="text-base font-black text-wood tracking-tight">Accounts Verified</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-wood/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, delay: 0.5 }}
                                            className="h-full bg-green-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Key Metrics ──────────────── */}
            <section className="py-24 bg-wood border-y border-white/10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 divide-x divide-white/10">
                        <MetricCard count="100%" label="Clear Accounts" />
                        <MetricCard count="EASY" label="Simple to Learn" />
                        <MetricCard count="STARS" label="Correct Timings" />
                        <MetricCard count="SAFE" label="Data Security" />
                    </div>
                </div>
            </section>

            {/* ── Ease of Use ────── */}
            <section className="py-32 bg-white overflow-hidden" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
                        <div className="space-y-8">
                            <span className="text-[12px] font-bold text-primary uppercase tracking-widest">Made For Temple Committees</span>
                            <h2 className="text-4xl md:text-5xl font-black text-wood tracking-tight leading-[1.1]">
                                Powerful software.<br />
                                <span className="text-primary font-serif italic">Very easy to use.</span>
                            </h2>
                            <p className="text-lg text-wood/70 leading-relaxed max-w-lg">
                                You don't need computer experts to run this. It is designed so that the main priest, office staff, and volunteers can learn it in one day.
                            </p>
                            <ul className="space-y-6 pt-6">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Check size={14} strokeWidth={3} /></div>
                                    <div>
                                        <p className="text-base font-bold text-wood">Star-Based Pooja Bookings</p>
                                        <p className="text-sm text-wood/60 mt-1">The software automatically checks the correct timings so there are no mistakes.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Check size={14} strokeWidth={3} /></div>
                                    <div>
                                        <p className="text-base font-bold text-wood">Clear Hundi Records</p>
                                        <p className="text-sm text-wood/60 mt-1">Safe and clear records of all Hundi collections to stop confusion and build trust.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="rounded-[2rem] border-[10px] border-cream shadow-xl overflow-hidden bg-white aspect-[4/3] relative">
                                <img
                                    src="/assets/landing/priest.png"
                                    alt="Temple Management Dashboard"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Grid: Features ── */}
                    {/* ── Grid: Features ── */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h3 className="text-3xl font-black text-wood mb-4">Everything Your Temple Needs</h3>
                        <p className="text-wood/60">All the tools to make your daily temple work faster, easier, and perfectly clear.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <FeatureCard
                            title="Pooja Bookings"
                            icon={CalendarDays}
                            desc="Book poojas easily and give printed or WhatsApp receipts to devotees instantly."
                        />
                        <FeatureCard
                            title="Hundi Collections"
                            icon={Banknote}
                            desc="Safely count and record all Hundi money with clear, daily reports."
                        />
                        <FeatureCard
                            title="Accounts & Billing"
                            icon={ScrollText}
                            desc="Automatically handle all income, expenses, and daily accounts (Daybook)."
                        />
                        <FeatureCard
                            title="Special Donations"
                            icon={Wallet}
                            desc="Accept and record large donations for building funds or special causes."
                        />
                        <FeatureCard
                            title="Devotee Details"
                            icon={HeartHandshake}
                            desc="Save names, phone numbers, and star/gothram details of regular devotees."
                        />
                        <FeatureCard
                            title="Annadhanam"
                            icon={Users}
                            desc="Keep track of rice, oil, and grocery stock. Manage daily mass feeding smoothly."
                        />
                        <FeatureCard
                            title="Store & Stock"
                            icon={Package}
                            desc="Keep a clear count of all pooja items, brass vessels, and temple assets."
                        />
                        <FeatureCard
                            title="Temple Festivals"
                            icon={PartyPopper}
                            desc="Plan Utsavams and special festival days, and manage the extra bookings."
                        />
                        {/* <FeatureCard
                            title="Line & Queue Control"
                            icon={ListOrdered}
                            desc="Give out token numbers to manage large crowds easily without confusion."
                        /> */}
                        <FeatureCard
                            title="TV Display Screens"
                            icon={Monitor}
                            desc="Show live token numbers and today's pooja times on TVs in the temple."
                        />
                        <FeatureCard
                            title="Prasadam Delivery"
                            icon={Truck}
                            desc="Take online orders and safely pack and post Prasadam to faraway devotees."
                        />
                        {/* <FeatureCard
                            title="Admin Dashboard"
                            icon={LayoutDashboard}
                            desc="One simple screen for the manager to see today's total collection and work."
                        /> */}
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────── */}
            <section className="py-32 bg-cream">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-wood rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-20 opacity-5"><Sparkles size={150} /></div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
                                Make Your Temple <br />Work Easier Today.
                            </h2>
                            <p className="text-lg text-white/70 mb-12 max-w-xl mx-auto">
                                Join other temples who are already using TempleSaaS to keep their accounts clear and devotees happy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button
                                    onClick={() => navigate('/demo')}
                                    className="h-16 px-12 rounded-full bg-primary text-white font-bold text-sm shadow-xl hover:bg-orange-700 transition-all"
                                >
                                    Call Us for a Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function MetricCard({ count, label }) {
    return (
        <div className="text-center px-4">
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white">{count}</h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">{label}</p>
        </div>
    );
}

function FeatureCard({ title, desc, icon: Icon }) {
    return (
        <div className="p-10 rounded-3xl border border-wood/5 bg-cream/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm border border-wood/5 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={24} />
            </div>
            <h4 className="text-xl font-black text-wood mb-4">{title}</h4>
            <p className="text-wood/70 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

export default LandingPage;