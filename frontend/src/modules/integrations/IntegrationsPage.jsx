import { useState } from "react";
import { 
    Link2, 
    Smartphone, 
    CreditCard, 
    MessageSquare, 
    Mail, 
    ShieldCheck, 
    AlertCircle,
    CheckCircle2,
    Settings2,
    Lock,
    Search,
    ChevronRight,
    ExternalLink,
    Zap,
    Database,
    Layers,
    ArrowRight,
    Settings,
    FileText,
    Activity,
    Globe
} from "lucide-react";
import { motion } from "framer-motion";

const integrationList = [
    {
        id: "payments",
        name: "Razorpay Checkout",
        description: "Secure payment gateway for online pooja bookings and donations.",
        icon: CreditCard,
        status: "active",
        type: "Payments & Billing",
        color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
        id: "whatsapp",
        name: "WhatsApp API",
        description: "Send automated booking confirmations and digital receipts directly.",
        icon: MessageSquare,
        status: "disabled",
        type: "Messaging Service",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
        id: "email",
        name: "SMTP Gateway",
        description: "Reliable email notification service for staff alerts and reports.",
        icon: Mail,
        status: "active",
        type: "Email Notifications",
        color: "text-[#B8860B] bg-yellow-50 border-yellow-100"
    },
    {
        id: "maps",
        name: "Google Maps API",
        description: "Location services for temple geofencing and address verification.",
        icon: Smartphone,
        status: "active",
        type: "Location Services",
        color: "text-red-600 bg-red-50 border-red-100"
    }
];

export default function IntegrationsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                        <Link2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">External Integrations</h1>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Connect and manage third-party services with your temple management system
                        </p>
                    </div>
                </div>

                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search integrations..." 
                        className="w-full h-10 pl-11 pr-4 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-[#B8860B] transition-all"
                    />
                </div>
            </header>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrationList.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id} 
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-[#B8860B]/20 transition-all flex flex-col justify-between h-full group"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div className={`h-11 w-11 rounded-lg flex items-center justify-center border ${item.color} shadow-sm transition-transform group-hover:scale-105`}>
                                    <item.icon size={20} />
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-all ${
                                    item.status === 'active' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-300'}`} />
                                    {item.status}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#B8860B] transition-colors flex items-center gap-2">
                                    {item.name}
                                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                                </h3>
                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-all">
                                <Settings size={14} /> Configure
                            </button>
                            {item.status === 'active' ? (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                    <CheckCircle2 size={14} /> Connected
                                </div>
                            ) : (
                                <button className="flex items-center gap-2 px-4 h-9 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-900/10">
                                    <Zap size={14} /> Connect
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Security Section */}
            <div className="pt-4">
                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-transform duration-700">
                        <Lock size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                        <div className="h-14 w-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-[#B8860B] transition-all">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                            <h4 className="text-lg font-bold mb-2 tracking-tight">Secure Data Protection</h4>
                            <p className="text-[11px] text-white/50 leading-relaxed font-medium max-w-2xl">
                                We utilize industry-standard AES-256 encryption to secure all API keys and external data links. 
                                Your temple's data integrity and security are processed with strict multi-layer authentication.
                            </p>
                        </div>
                        <button className="h-11 px-6 rounded-lg bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all active:scale-95 shadow-lg">
                            <FileText size={16} /> Security Logs <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
