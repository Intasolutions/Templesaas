import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { 
    Shield, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Database, 
    Search,
    Filter,
    ArrowUpRight,
    IndianRupee,
    MessageSquare,
    ChevronRight,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResponsiveTable from "../../components/ui/ResponsiveTable";

const SubscriptionRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get("/core/subscription-requests/");
            setRequests(res.data.results || res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, action) => {
        setProcessingId(id);
        const admin_notes = window.prompt(`Enter notes for ${action}:`);
        try {
            await api.patch(`/core/subscription-requests/${id}/approve/`, { action, admin_notes });
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.error || "Action failed");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredRequests = Array.isArray(requests) ? requests.filter(r => 
        r.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Mission Control Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
                            <Lock size={32} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Subscription Nexus</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                <Database size={12} className="text-primary" /> SaaS Owner Node • Authorization Level: Omega
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[320px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Query Tenant Request ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 pl-16 pr-8 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-slate-50 outline-none text-xs font-bold transition-all shadow-inner"
                        />
                    </div>
                </div>
            </header>

            {/* Request Ledger */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group mx-4 md:mx-0">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                    <div>
                        <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                            <Clock size={16} className="text-slate-900" /> Pending Authorization Queue
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <button className="h-10 px-6 rounded-xl border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
                            <Filter size={12} /> Priority Filter
                        </button>
                    </div>
                </div>

                <ResponsiveTable
                    columns={[
                        {
                            header: "Tenant Identity",
                            key: "tenant",
                            mobileLabel: "Tenant Info",
                            render: (req) => (
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-sm uppercase">
                                        {req.tenant_name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">{req.tenant_name}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                                            <Clock size={10} /> Req: {new Date(req.requested_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )
                        },
                        {
                            header: "Target Protocol",
                            key: "plan",
                            render: (req) => (
                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                    req.plan_name === 'PRO_MAX' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 text-slate-500 border-slate-200/50'
                                }`}>
                                    {req.plan_name} Plan
                                </span>
                            )
                        },
                        {
                            header: "Financial Value",
                            key: "value",
                            render: (req) => (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 text-sm font-black text-slate-900 tracking-tight">
                                        <IndianRupee size={12} /> {req.amount}
                                    </div>
                                    <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                                        Cycle: {req.billing_cycle}
                                    </div>
                                </div>
                            )
                        },
                        {
                            header: "Auth Status",
                            key: "status",
                            render: (req) => (
                                <>
                                    {req.status === 'pending' && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-widest">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
                                        </span>
                                    )}
                                    {req.status === 'approved' && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={12} /> Approved
                                        </span>
                                    )}
                                    {req.status === 'rejected' && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black uppercase tracking-widest">
                                            <XCircle size={12} /> Rejected
                                        </span>
                                    )}
                                    {req.status === 'paid' && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-[9px] font-black uppercase tracking-widest">
                                            <ArrowUpRight size={12} className="text-primary" /> Active
                                        </span>
                                    )}
                                </>
                            )
                        },
                        {
                            header: "Actions",
                            key: "actions",
                            align: "right",
                            render: (req) => (
                                <>
                                    {req.status === 'pending' ? (
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleApproval(req.id, 'approve'); }}
                                                disabled={processingId === req.id}
                                                className="h-10 px-5 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleApproval(req.id, 'reject'); }}
                                                disabled={processingId === req.id}
                                                className="h-10 px-5 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-3 text-slate-300">
                                            {req.admin_notes && (
                                                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                                                    <MessageSquare size={12} /> Logged
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )
                        }
                    ]}
                    data={filteredRequests}
                    loading={loading}
                    emptyMessage="No active requests detected in local sector"
                />
            </div>
        </div>
    );
};

export default SubscriptionRequestsPage;
