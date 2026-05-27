import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { 
    User, 
    Shield, 
    Clock, 
    Download, 
    Plus, 
    Search, 
    MoreVertical, 
    ShieldCheck, 
    CheckCircle2, 
    AlertTriangle,
    Database,
    Zap,
    Fingerprint,
    Layers,
    ChevronRight,
    MapPin,
    ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SalaryModal from "./SalaryModal";
import { IndianRupee, Activity, CheckCircle2, AlertTriangle, Database, Zap, Fingerprint, Layers, ChevronRight, MapPin, ArrowRight, Save, X as CloseIcon } from "lucide-react";
import ModernInput from "../../components/ui/ModernInput";
import { ValidationUtils } from "../../shared/utils/ValidationUtils";
import { useNotify } from "../../context/NotificationContext";
import ResponsiveTable from "../../components/ui/ResponsiveTable";

const StaffPage = () => {
    const { t } = useTranslation();
    const notify = useNotify();
    const [users, setUsers] = useState([]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showClockIn, setShowClockIn] = useState(false);
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editingWage, setEditingWage] = useState(null);
    const [wageValue, setWageValue] = useState("");
    const [wageError, setWageError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [uRes, aRes, rRes] = await Promise.all([
                api.get("/users/profiles/"),
                api.get("/users/attendance/"),
                api.get("/users/roster/")
            ]);
            setUsers(uRes.data.results || uRes.data || []);
            setAttendanceLogs(aRes.data.results || aRes.data || []);
            setRoster(rRes.data.results || rRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(u => 
        u.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleUpdateWage = async (userId) => {
        const err = ValidationUtils.validators.amount(wageValue);
        if (err) {
            setWageError(err);
            return notify.warn("Invalid wage amount.");
        }

        try {
            await api.patch(`/users/management/${userId}/`, { daily_wage: wageValue });
            fetchData();
            setEditingWage(null);
            notify.success("Wage protocol updated");
        } catch (err) {
            notify.error("Update failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-900 rounded-[1.6rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                            <Fingerprint size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Force Command</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                                <Database size={12} className="text-primary" /> Personnel Registry • Staff Node #001
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Query Unit ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-16 pr-8 bg-white border border-slate-100 rounded-2xl w-64 md:w-80 text-xs font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-50 transition-all placeholder:text-slate-200 shadow-inner"
                        />
                    </div>
                    <button 
                        onClick={() => setShowClockIn(true)}
                        className="h-14 px-6 rounded-2xl border border-slate-100 bg-white text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <ShieldCheck size={18} /> Clock Entry
                    </button>
                    <button className="h-14 px-8 rounded-2xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 flex items-center gap-3 active:scale-95">
                        <Plus size={20} /> Enlist Personnel
                    </button>
                </div>
            </header>

            {/* Force Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <MetricCard label="Active Units" value={filteredUsers.length} icon={ShieldCheck} color="slate" badge="ONLINE" subtext="Deployed Operational Force" />
                <MetricCard label="Shift Variance" value="Normal" icon={Activity} color="emerald" badge="STABLE" subtext="Roster Congruence State" />
                <MetricCard label="Uplink Success" value="100%" icon={Zap} color="primary" badge="VERIFIED" subtext="Authentication Node Accuracy" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 md:px-0 items-start">
                {/* Personnel Registry */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                            <h2 className="text-[10px] font-bold text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                                <Layers size={16} className="text-slate-900" /> Personnel Data Ledger
                            </h2>
                            <button className="text-[9px] font-bold text-slate-300 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2 transition-colors">
                                <Download size={12} /> Export Protocol
                            </button>
                        </div>
                        
                        <ResponsiveTable
                            columns={[
                                {
                                    header: "Unit Identity",
                                    key: "identity",
                                    mobileLabel: "Personnel",
                                    render: (profile) => (
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                                                {profile.user?.username?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors">{profile.user?.username || "Unknown Unit"}</div>
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                                    <Database size={10} className="text-primary/40" /> ID: #{profile.id}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    header: "Sub-Domain",
                                    key: "role",
                                    render: (profile) => (
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200/50">
                                            {profile.role || "Level 1 Cleared"}
                                        </span>
                                    )
                                },
                                {
                                    header: "Daily Wage",
                                    key: "wage",
                                    render: (profile) => (
                                        editingWage === profile.id ? (
                                            <div className="flex items-center gap-2 max-w-[150px]">
                                                <ModernInput 
                                                    type="number" 
                                                    value={wageValue} 
                                                    error={wageError}
                                                    success={parseFloat(wageValue) >= 1}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        setWageValue(val);
                                                        setWageError(ValidationUtils.validators.amount(val));
                                                    }}
                                                    placeholder="0.00"
                                                />
                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateWage(profile.id); }} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-primary transition-all">
                                                    <Save size={14} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setEditingWage(null); }} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-all">
                                                    <CloseIcon size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div 
                                                className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingWage(profile.id);
                                                    setWageValue(profile.daily_wage);
                                                    setWageError(null);
                                                }}
                                            >
                                                <IndianRupee size={12} className="text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                                                    {profile.daily_wage || "0.00"}
                                                </span>
                                            </div>
                                        )
                                    )
                                },
                                {
                                    header: "Operational State",
                                    key: "state",
                                    render: () => (
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Mission Active</span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Actions",
                                    key: "actions",
                                    align: "right",
                                    render: (profile) => (
                                        <div className="flex justify-end items-center gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedStaff({ 
                                                        id: profile.id, 
                                                        user_id: profile.user?.id,
                                                        username: profile.user?.username, 
                                                        daily_wage: profile.daily_wage 
                                                    });
                                                    setShowSalaryModal(true);
                                                }}
                                                className="h-10 px-4 rounded-xl bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                                            >
                                                <IndianRupee size={14} /> Salary
                                            </button>
                                            <button onClick={(e) => e.stopPropagation()} className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    )
                                }
                            ]}
                            data={filteredUsers}
                            loading={loading}
                            emptyMessage="Registry Empty: No Personnel Detected"
                        />
                    </div>
                </div>

                {/* Tactical Overlays */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden border border-slate-800 shadow-2xl shadow-slate-900/40 group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Clock size={80} /></div>
                        <h3 className="text-lg font-bold tracking-tighter uppercase">Active Deployment Roster</h3>
                        
                        <div className="space-y-12 mb-10">
                            {['morning', 'evening', 'full'].map(shiftKey => {
                                const shiftLabel = {
                                    'morning': 'Cycle Alpha (0600 - 1400)',
                                    'evening': 'Cycle Beta (1400 - 2200)',
                                    'full': 'Cycle Gamma (Full Spectrum)'
                                }[shiftKey];
                                
                                const shiftItems = roster.filter(r => r.shift === shiftKey);

                                if (shiftItems.length === 0) return null;

                                return (
                                    <div key={shiftKey} className="space-y-6">
                                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="h-1 w-1 bg-primary rounded-full" /> {shiftLabel}
                                        </div>
                                        <div className="space-y-4">
                                            {shiftItems.map(item => (
                                                <div key={item.id} className="flex justify-between items-start group/item cursor-default">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-white uppercase tracking-tight group-hover/item:text-primary transition-colors">
                                                            {item.username}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">
                                                            {item.role} Node
                                                        </span>
                                                    </div>
                                                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                                       {item.area} Sect
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button className="w-full mt-10 h-14 rounded-2xl bg-white/5 hover:bg-white text-white hover:text-slate-900 border border-white/10 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl group">
                            Recalibrate Duty Map <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-7 border border-amber-100 shadow-inner flex items-start gap-4 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-110 transition-transform"><Shield size={60} /></div>
                        <div className="h-10 w-10 rounded-lg bg-white border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <Shield size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-700">{t('audit_mode_active')}</p>
                            <p className="text-[10px] font-bold text-amber-900/50 uppercase tracking-tight mt-2 leading-relaxed">
                                All attendance vectors are being recorded for geofencing compliance within the spatial node.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <SalaryModal 
                isOpen={showSalaryModal}
                onClose={() => setShowSalaryModal(false)}
                staff={selectedStaff}
                onRefresh={fetchData}
            />
        </div>
    );
};

function MetricCard({ label, value, icon: Icon, color, badge, subtext }) {
    const colors = {
        slate: "bg-slate-100 text-slate-400",
        emerald: "bg-emerald-50 text-emerald-500",
        primary: "bg-primary/10 text-primary"
    };

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group hover:shadow-2xl hover:shadow-slate-100 transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform"><Icon size={48} /></div>
             <div className="relative z-10 flex items-start gap-5">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${colors[color]}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tighter leading-none">{value}</p>
                    <p className="text-[8px] font-bold text-slate-300 mt-3 uppercase tracking-widest flex items-center gap-2">
                        {subtext}
                    </p>
                </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest h-fit ${colors[color]}`}>
                {badge}
            </div>
        </div>
    );
}

export default StaffPage;
