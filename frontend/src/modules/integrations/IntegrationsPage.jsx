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
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const integrationList = [
    {
        id: "payments",
        name: "Razorpay Checkout",
        description: "Secure payment gateway for Online Pooja Bookings and Donations.",
        icon: CreditCard,
        status: "active",
        type: "Financial Hub",
        color: "text-blue-500 bg-blue-50 border-blue-100"
    },
    {
        id: "whatsapp",
        name: "WhatsApp API",
        description: "Send automated booking confirmations and digital receipts to devotees.",
        icon: MessageSquare,
        status: "disabled",
        type: "Communication Node",
        color: "text-emerald-500 bg-emerald-50 border-emerald-100"
    },
    {
        id: "email",
        name: "SMTP Gateway",
        description: "System-wide notification service for staff alerts and reports.",
        icon: Mail,
        status: "active",
        type: "Infrastructure Link",
        color: "text-indigo-500 bg-indigo-50 border-indigo-100"
    },
    {
        id: "maps",
        name: "Google Maps API",
        description: "Used for Geofencing verification and Temple location mapping.",
        icon: Smartphone,
        status: "active",
        type: "Spatial Node",
        color: "text-red-500 bg-red-50 border-red-100"
    }
];

export default function IntegrationsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.6rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                            <Link2 size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gateway Portal</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                <Database size={12} className="text-primary" /> API Ecosystem • Unified Endpoints
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative group min-w-[320px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search service nodes..." 
                        className="w-full h-14 pl-16 pr-6 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-slate-50 outline-none text-xs font-bold transition-all shadow-inner"
                    />
                </div>
            </header>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {integrationList.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={item.id} 
                        className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all group relative overflow-hidden flex flex-col justify-between h-full"
                    >
                         <div className="absolute top-0 right-0 p-7 opacity-5 group-hover:scale-110 transition-transform">
                            <item.icon size={60} />
                        </div>

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border-2 ${item.color} shadow-sm group-hover:scale-105 transition-transform duration-500`}>
                                <item.icon size={26} />
                            </div>
                            <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                                item.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-slate-50 text-slate-300 border-slate-100'
                            }`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                {item.status}
                            </div>
                        </div>

                        <div className="relative z-10 overflow-hidden flex-1">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2 block">{item.type}</span>
                            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none group-hover:text-primary transition-colors flex items-center gap-2">
                                {item.name}
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                            </h3>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed line-clamp-2 uppercase tracking-tight">
                                {item.description}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all group/btn">
                                <Settings2 size={12} className="group-hover/btn:rotate-90 transition-transform" /> Protocol
                            </button>
                            {item.status === 'active' ? (
                                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50/20 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <CheckCircle2 size={12} /> Sync
                                </div>
                            ) : (
                                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-white bg-slate-900 hover:bg-slate-800 px-4 h-9 rounded-lg transition-all active:scale-95 shadow-lg shadow-slate-900/10 whitespace-nowrap">
                                    <Zap size={12} /> Connect
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Cryptographic Vault Section */}
            <div className="px-4 md:px-0">
                <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/30 border border-white/5">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                        <Lock size={200} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-12">
                        <div className="h-20 w-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-primary transition-all duration-500">
                            <ShieldCheck size={40} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-2xl font-black mb-4 tracking-tighter uppercase">Secure Handshake Architecture</h4>
                            <p className="text-sm text-white/40 leading-relaxed max-w-2xl font-bold uppercase tracking-tight">
                                All external payloads and API secrets are isolated within a cryptographic vault using AES-256 standards. 
                                Heritage data integrity is guaranteed via persistent HMAC validation and real-time security auditing.
                            </p>
                        </div>
                        <button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-2xl shadow-white/10 group">
                            Audit Vault <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
