import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Calendar,
  Wallet,
  Plus,
  Search,
  Activity,
  Package,
  Moon,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Zap,
  LayoutDashboard,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import api from '../../shared/api/client';
import ClockInModal from '../users/ClockInModal';
import { useAuth } from '../../context/AuthContext';
import InteractiveStats from '../../components/ui/InteractiveStats';
import GlassCard from '../../components/ui/GlassCard';
import PremiumButton from '../../components/ui/PremiumButton';

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
      <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin shadow-inner"></div>
      <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] animate-pulse uppercase">Syncing Workspace</p>
    </div>
  );

  const trialDaysLeft = tenant?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 md:px-0 bg-mesh min-h-screen">

      {/* ── Welcome Header ────────────────── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 bg-white rounded-[2rem] flex items-center justify-center text-slate-900 shadow-xl border border-slate-50 relative overflow-hidden group">
            <LayoutDashboard size={28} className="text-primary relative z-10 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{t('temple_workspace', 'Temple Dashboard')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-2 uppercase tracking-widest">
                <Sparkles size={12} className="text-gold" /> 
                Administrative Hub • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setShowClockIn(true)} className="h-12 px-6 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-slate-600 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all flex items-center gap-2 shadow-sm">
            <Clock size={16} /> Staff Attendance
          </button>
          <PremiumButton onClick={() => window.location.href = '/pooja/book'} variant="primary" icon={Plus}>
            {t('new_booking', 'New Booking')}
          </PremiumButton>
        </div>
      </header>

      {/* ── Quick Insights ────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InteractiveStats label="Poojas Today" value={stats.metrics.today_poojas} icon={Activity} trend="+12%" />
        <InteractiveStats label="Total Revenue" value={`₹${(stats.metrics.today_income || 0).toLocaleString()}`} icon={TrendingUp} trend="+5.4%" />
        <InteractiveStats label="Devotees" value={stats.metrics.total_devotees} icon={Users} trend="+8%" />
        <InteractiveStats label="Special Events" value={stats.upcoming_festivals.length} icon={Calendar} trend="Steady" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* ── Quick Actions ────────────────── */}
          <GlassCard className="p-8">
            <h3 className="text-base font-bold text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
              <Zap size={16} className="text-primary" /> Daily Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ActionLink title="Pooja Booking" icon={Plus} href="/pooja/book" desc="Register ritual for devotee" />
              <ActionLink title="Hundi Records" icon={Wallet} href="/hundi" desc="Manage collection batches" />
              <ActionLink title="Devotee Records" icon={Search} href="/devotees" desc="Search directory & history" />
              <ActionLink title="Logistics" icon={Package} href="/shipments" desc="Manage active deliveries" />
            </div>
          </GlassCard>

          {/* ── Daily Panchangam ────────────────── */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative shadow-2xl overflow-hidden group border border-slate-800"
          >
            <div className="absolute -top-10 -right-10 p-8 text-primary/10 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
              <Moon size={180} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-primary tracking-[0.3em] mb-10 flex items-center gap-3 uppercase">
                <Sparkles size={16} /> Daily Astrology
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                <PanchangItem label="Nakshatra" value={panchang?.nakshatra || "Anizham"} />
                <PanchangItem label="Tithi" value={panchang?.tithi || "Thiruvonam"} />
                <PanchangItem label="Sunrise" value={panchang?.sunrise || "06:15 AM"} />
                <PanchangItem label="Sunset" value={panchang?.sunset || "06:42 PM"} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Events Panel ────────────────── */}
        <GlassCard className="p-8 h-full flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Upcoming Events</h4>
            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Calendar size={18} className="text-slate-400" />
            </div>
          </div>

          <div className="flex-1 space-y-5">
            {stats.upcoming_festivals.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 border border-slate-50 shadow-inner">
                  <Calendar size={24} />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No events scheduled</p>
              </div>
            ) : (
              stats.upcoming_festivals.map((evt, i) => (
                <motion.div 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex gap-5 items-center group cursor-pointer p-4 rounded-2xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/10"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:border-primary group-hover:shadow-primary/5 transition-all">
                    <span className="text-lg font-bold text-slate-900 leading-none">{new Date(evt.start_date).getDate()}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase mt-1">{new Date(evt.start_date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">{evt.name}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1.5 flex items-center gap-2 uppercase tracking-widest">
                      <Clock size={12} /> {evt.start_time || "All Day"}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <PremiumButton variant="outline" size="sm" className="w-full mt-10" onClick={() => window.location.href='/bookings'}>
            View Calendar <ArrowRight size={14} className="ml-1" />
          </PremiumButton>
        </GlassCard>
      </div>

      <ClockInModal
        isOpen={showClockIn}
        onClose={() => setShowClockIn(false)}
        onRefresh={fetchDashboard}
      />
    </div>
  );
}

function ActionLink({ title, desc, icon: Icon, href }) {
  return (
    <motion.a 
        href={href} 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-5 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
    >
      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
        <Icon size={20} />
      </div>
      <div className="overflow-hidden">
        <p className="text-xs font-bold text-slate-900 mb-0.5 tracking-tight uppercase">{title}</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">{desc}</p>
      </div>
    </motion.a>
  );
}

function PanchangItem({ label, value }) {
  return (
    <div className="space-y-4 group/item">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover/item:text-primary transition-colors">{label}</p>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}