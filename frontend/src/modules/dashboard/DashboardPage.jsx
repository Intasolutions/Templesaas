import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Calendar,
  Wallet,
  ArrowRight,
  Plus,
  Search,
  Activity,
  Package,
  Sun,
  Moon,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  Zap,
  LayoutDashboard,
  Clock,
  ShieldCheck
} from 'lucide-react';
import api from '../../shared/api/client';
import ClockInModal from '../users/ClockInModal';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { tenant } = useAuth();
  const [stats, setStats] = useState({
    metrics: { today_poojas: 0, today_income: 0, total_bookings: 0, low_stock_count: 0, total_devotees: 0 },
    upcoming_festivals: []
  });
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClockIn, setShowClockIn] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchPanchang();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/reports/dashboard/');
      setStats({
        metrics: { ...stats.metrics, ...(res.data.metrics || {}) },
        upcoming_festivals: res.data.upcoming_festivals || []
      });
    } catch (err) {
      console.error("Dashboard Error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPanchang = async () => {
    try {
      const res = await api.get('/panchangam/');
      setPanchang(res.data);
    } catch (err) {
      console.error("Panchangam Error", err);
    }
  };

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-[6px] border-slate-100 border-t-slate-900 rounded-full animate-spin shadow-inner"></div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Loading Dashboard...</p>
    </div>
  );

  const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 md:px-0">
      {/* ── Upgrade Banner ────────────────── */}
      {tenant?.is_trial && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden group shadow-2xl border border-white/5"
        >
          <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-110 transition-transform duration-700">
            <Zap size={180} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl">
                <Sparkles size={28} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Premium Trial Active</h2>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2 justify-center md:justify-start">
                   {trialDaysLeft} Days Remaining • Upgrade to unlock all features
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/billing'}
              className="px-8 h-12 bg-white text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary transition-all active:scale-95 whitespace-nowrap shadow-xl"
            >
              Upgrade Now
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
        <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <LayoutDashboard size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Temple Dashboard</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1 flex items-center gap-2">
                    <ShieldCheck size={12} className="text-primary" /> Administrative Portal • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <button onClick={() => setShowClockIn(true)} className="h-11 px-5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
                <Clock size={16} /> Staff Attendance
            </button>
            <button onClick={() => window.location.href='/bookings'} className="h-11 px-6 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95">
                <Plus size={18} /> New Booking
            </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem label="Daily Poojas" value={stats.metrics.today_poojas} color="text-blue-600 bg-blue-50" icon={Activity} />
        <StatItem label="Vazhipadu Income" value={`₹${(stats.metrics.today_income || 0).toLocaleString()}`} color="text-emerald-600 bg-emerald-50" icon={TrendingUp} />
        <StatItem label="Registered Devotees" value={stats.metrics.total_devotees} color="text-orange-600 bg-orange-50" icon={Users} />
        <StatItem label="Special Events" value={stats.upcoming_festivals.length} color="text-purple-600 bg-purple-50" icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Tasks */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 px-2 flex items-center gap-2">
                <Zap size={14} className="text-primary" /> Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <ActionLink title="Pooja Booking" icon={Plus} href="/bookings" desc="Register ritual for devotee" color="bg-orange-50 text-orange-600" />
                <ActionLink title="Hundi Collections" icon={Wallet} href="/hundi" desc="Record collection batches" color="bg-emerald-50 text-emerald-600" />
                <ActionLink title="Devotee Directory" icon={Search} href="/devotees" desc="Search records & history" color="bg-blue-50 text-blue-600" />
                <ActionLink title="Prasad Shipping" icon={Package} href="/shipments" desc="Manage active deliveries" color="bg-slate-50 text-slate-900" />
            </div>
          </div>

          {/* Simple Panchangam */}
          <div className="bg-slate-900 rounded-2xl p-8 text-white relative shadow-xl overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 text-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <Sparkles size={80} />
             </div>
             <div className="relative z-10 h-full flex flex-col justify-between overflow-x-auto custom-scrollbar">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                   <Moon size={14} /> Daily Panchangam
                </h4>
                <div className="flex gap-10 lg:gap-16">
                    <PanchangItem label="Nakshatram" value={panchang?.nakshatra || "Anizham"} />
                    <PanchangItem label="Tithi" value={panchang?.tithi || "Thiruvonam"} />
                    <PanchangItem label="Sunrise" value={panchang?.sunrise || "06:15 AM"} />
                    <PanchangItem label="Sunset" value={panchang?.sunset || "06:42 PM"} />
                </div>
             </div>
          </div>
        </div>

        {/* Festival List */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm h-full flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-8 px-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Upcoming Festivals</h4>
                <Calendar size={18} className="text-slate-200" />
            </div>
            
            <div className="flex-1 space-y-6">
                {stats.upcoming_festivals.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-slate-100 rounded-xl flex flex-col items-center gap-3">
                        <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                           <Calendar size={16} />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No events scheduled</p>
                    </div>
                ) : (
                    stats.upcoming_festivals.map((evt, i) => (
                        <div key={i} className="flex gap-4 items-center group cursor-pointer hover:translate-x-1 transition-all">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="text-sm font-bold leading-none">{new Date(evt.start_date).getDate()}</span>
                                <span className="text-[8px] font-bold uppercase opacity-60">{new Date(evt.start_date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold tracking-tight text-slate-900 truncate mb-0.5">{evt.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 opacity-60">
                                   <Clock size={8} /> {evt.start_time || "All Day"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <button className="w-full mt-8 h-10 bg-slate-50 hover:bg-slate-100 transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-100 flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                View Calendar <ChevronRight size={14} />
            </button>
        </div>
      </div>

      <ClockInModal 
        isOpen={showClockIn} 
        onClose={() => setShowClockIn(false)} 
        onRefresh={fetchDashboard} 
      />
    </div>
  );
}

function StatItem({ label, value, color, icon: Icon }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all shadow-sm group">
            <div className={`h-9 w-9 mb-4 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${color}`}>
                <Icon size={16} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">{value}</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        </div>
    );
}

function ActionLink({ title, desc, icon: Icon, href, color }) {
    return (
        <a href={href} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-50 hover:border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color} group-hover:scale-105 transition-transform`}>
                <Icon size={20} />
            </div>
            <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 tracking-tight mb-1">{title}</p>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest truncate opacity-60">{desc}</p>
            </div>
        </a>
    );
}

function PanchangItem({ label, value }) {
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold tracking-tight uppercase">{value}</p>
        </div>
    );
}
