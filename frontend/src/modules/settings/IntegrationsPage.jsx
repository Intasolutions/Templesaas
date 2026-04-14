import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    CreditCard,
    MessageSquare,
    Settings,
    CheckCircle2,
    ShieldCheck,
    Globe,
    Smartphone,
    Mail,
    ChevronRight,
    KeyRound
} from 'lucide-react';

const INTEGRATIONS = [
    {
        id: 'razorpay',
        name: 'Razorpay Gateway',
        category: 'Payments',
        icon: CreditCard,
        color: 'from-blue-500 to-indigo-600',
        description: 'Accept UPI, Credit/Debit cards & Netbanking for Donations and Pooja Bookings.',
        status: 'connected',
    },
    {
        id: 'stripe',
        name: 'Stripe Global',
        category: 'Payments',
        icon: Globe,
        color: 'from-purple-500 to-pink-600',
        description: 'Accept international payments and NRI donations seamlessly.',
        status: 'available',
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp Cloud API',
        category: 'Messaging',
        icon: MessageSquare,
        color: 'from-emerald-400 to-emerald-600',
        description: 'Send booking confirmations, receipts, and festival reminders via WhatsApp.',
        status: 'available',
    },
    {
        id: 'twilio',
        name: 'Twilio SMS',
        category: 'Messaging',
        icon: Smartphone,
        color: 'from-red-500 to-rose-600',
        description: 'Fallback SMS delivery for OTPs and important alerts.',
        status: 'available',
    },
    {
        id: 'sendgrid',
        name: 'SendGrid Email',
        category: 'Communication',
        icon: Mail,
        color: 'from-cyan-400 to-blue-500',
        description: 'Deliver beautiful HTML receipts and monthly temple newsletters.',
        status: 'connected',
    }
];

export default function IntegrationsPage() {
    const { t } = useTranslation();
    const [selectedInt, setSelectedInt] = useState(null);

    const categories = [...new Set(INTEGRATIONS.map(i => i.category))];
    const [activeTab, setActiveTab] = useState('All');

    const filtered = activeTab === 'All'
        ? INTEGRATIONS
        : INTEGRATIONS.filter(i => i.category === activeTab);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">App Integrations</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            Connect payment gateways and communication tools.
                        </p>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                    {['All', ...categories].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((integration) => {
                            const Icon = integration.icon;
                            const isConnected = integration.status === 'connected';

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={integration.id}
                                    onClick={() => setSelectedInt(integration)}
                                    className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    {/* Futuristic Glow Effect */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${integration.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white shadow-lg`}>
                                            <Icon size={28} />
                                        </div>
                                        {isConnected ? (
                                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                                <CheckCircle2 size={14} />
                                                Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide group-hover:bg-slate-200 transition-colors">
                                                Setup
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{integration.name}</h3>
                                    <p className="text-slate-500 mt-2 text-sm leading-relaxed min-h-[40px]">
                                        {integration.description}
                                    </p>

                                    <div className="mt-8 flex items-center justify-between text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                                        <span>Manage Configuration</span>
                                        <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal for Configuration */}
            <AnimatePresence>
                {selectedInt && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedInt(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className={`h-32 bg-gradient-to-br ${selectedInt.color} p-8 flex items-center gap-4 relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10" />
                                <selectedInt.icon size={48} className="text-white relative z-10 drop-shadow-lg" />
                                <div className="relative z-10 text-white">
                                    <h2 className="text-3xl font-black tracking-tight">{selectedInt.name}</h2>
                                    <p className="font-medium opacity-90">{selectedInt.category} Setup</p>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl mb-6 flex gap-3 text-sm font-medium">
                                    <ShieldCheck className="shrink-0 text-orange-600" />
                                    <p>API Keys are encrypted and stored safely. Never share these credentials with anyone.</p>
                                </div>

                                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSelectedInt(null); }}>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Live API Key</label>
                                        <div className="relative">
                                            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                defaultValue={selectedInt.status === 'connected' ? 'sk_live_xxxxxxxxxxxxxxxxxxxx' : ''}
                                                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 transition-all outline-none font-mono text-slate-800"
                                                placeholder="pk_live_..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Live Secret Key</label>
                                        <div className="relative">
                                            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="password"
                                                defaultValue={selectedInt.status === 'connected' ? 'secret_xxxxxxxxxxxxxxxxxxxx' : ''}
                                                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 transition-all outline-none font-mono text-slate-800"
                                                placeholder="sk_live_..."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedInt(null)}
                                            className="px-6 py-4 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`flex-1 py-4 rounded-2xl font-black text-white shadow-lg transition-all bg-gradient-to-r ${selectedInt.color} hover:brightness-110`}
                                        >
                                            Save Configuration
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
