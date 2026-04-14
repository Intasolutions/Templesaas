import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  ListTodo,
  Sparkles,
  Zap,
  ShieldCheck,
  Database,
  Layout,
  Layers,
  Clock
} from 'lucide-react';
import api from '../../shared/api/client';
import ClockInModal from '../users/ClockInModal';

export default function DashboardPage() {
  const { t } = useTranslation();
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
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Establishing Nexus Connection...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Prime Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
                    <Layout size={24} />
                </div>
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Control Nexus</h1>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                       <ShieldCheck size={10} className="text-primary" /> Operational State • Active
                   </p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-100 shadow-inner mr-2">
            <div className="px-4 flex items-center gap-2.5 text-[9px] font-black text-slate-900 uppercase tracking-widest whitespace-nowrap border-r border-slate-200/50 mr-2">
                <Calendar size={12} className="text-primary" /> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
            <div className="px-4 flex items-center gap-2.5 text-[9px] font-black text-primary uppercase tracking-widest whitespace-nowrap">
                {panchang?.malayalam_month || "Karkidakam"} Axis
            </div>
          </div>

          <button onClick={() => setShowClockIn(true)} className="h-11 px-5 rounded-xl border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
             <MapPin size={14} /> Audit
          </button>
          <button onClick={() => window.location.href='/pooja/book'} className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95">
             <Plus size={18} /> Register Seva
          </button>
        </div>
      </header>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
        <MetricCard 
          label="Ritual Frequency" 
          value={stats.metrics.today_poojas} 
          icon={Activity} 
          trend="+12% Delta"
          color="blue"
          subtext="Active Seva Protocols"
        />
        <MetricCard 
          label="Remittance Node" 
          value={`₹${(stats.metrics.today_income || 0).toLocaleString()}`} 
          icon={TrendingUp} 
          trend="99.9% Integrated"
          color="emerald"
          subtext="Total Daily Ledger"
        />
        <MetricCard 
          label="Registry Mass" 
          value={stats.metrics.total_devotees} 
          icon={Users} 
          trend="Unique Identifiers"
          color="orange"
          subtext="Central Hub Records"
        />
        <MetricCard 
          label="Observances" 
          value={stats.upcoming_festivals.length} 
          icon={Calendar} 
          trend="T-30 Day Outlook"
          color="purple"
          subtext="Synchronized Events"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 md:px-0">
        {/* Operations Cluster */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Access Grid */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                <Layers size={16} className="text-slate-900" /> Administrative Logic Clusters
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
               <SimpleAction 
                 icon={Plus} 
                 label="Book Pooja" 
                 href="/pooja/book" 
                 desc="Initialize Seva Protocol" 
                 color="text-orange-500 bg-orange-50"
               />
               <SimpleAction 
                 icon={Wallet} 
                 label="Hundi Audit" 
                 href="/hundi" 
                 desc="Verify Vault Remittance" 
                 color="text-emerald-500 bg-emerald-50"
               />
               <SimpleAction 
                 icon={Search} 
                 label="Find Devotee" 
                 href="/devotees" 
                 desc="Query Identity Database" 
                 color="text-blue-500 bg-blue-50"
               />
               <SimpleAction 
                 icon={Package} 
                 label="Shipping Node" 
                 href="/shipments" 
                 desc="Manage E-Prasad Payloads" 
                 color="text-slate-900 bg-slate-50"
               />
            </div>
          </div>

          {/* Panchangam Data Node */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/30 group">
             <div className="absolute top-0 right-0 p-6 text-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-125 rotate-12">
                <Sparkles size={120} />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                   <div className="space-y-1">
                       <h3 className="text-base font-black tracking-tighter uppercase leading-none">Astral Telemetry</h3>
                       <p className="text-[8px] font-black text-primary uppercase tracking-widest mt-1.5 opacity-60">Real-time Axis</p>
                   </div>
                   <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all shadow-inner">
                      <Sparkles size={16} className="text-white" />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div className="space-y-1.5">
                     <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Nakshatra</p>
                     <p className="text-base font-bold tracking-tight uppercase leading-none">{panchang?.nakshatra || "Anizham"}</p>
                   </div>
                   <div className="space-y-1.5">
                     <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Tithi</p>
                     <p className="text-base font-bold tracking-tight uppercase leading-none">{panchang?.tithi || "Thiruvonam"}</p>
                   </div>
                   <div className="flex gap-6">
                     <div className="space-y-1.5">
                       <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Sunrise</p>
                       <p className="text-[13px] font-black flex items-center gap-1.5 tracking-tighter"><Sun size={10} className="text-amber-500" /> {panchang?.sunrise || "06:15"}</p>
                     </div>
                     <div className="space-y-1.5">
                       <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Sunset</p>
                       <p className="text-[13px] font-black flex items-center gap-1.5 tracking-tighter"><Moon size={10} className="text-blue-300" /> {panchang?.sunset || "06:42"}</p>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Intelligence Peripheral */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group h-full flex flex-col">
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center justify-between mb-8">
                 <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Festival Registry</h4>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1.5">T-30 State Audit</p>
                 </div>
                 <div className="h-9 w-9 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white">
                    <Calendar size={16} />
                 </div>
               </div>
               
               <div className="space-y-5 flex-1">
                 {stats.upcoming_festivals.length === 0 ? (
                   <div className="text-center py-8 border-2 border-dashed border-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-200">No Active Data</p>
                   </div>
                 ) : (
                   stats.upcoming_festivals.map((evt, i) => (
                     <div key={i} className="flex gap-4 group/item">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover/item:bg-slate-900 group-hover/item:text-white transition-all shadow-sm">
                         <span className="text-[13px] font-black leading-none">{new Date(evt.start_date).getDate()}</span>
                         <span className="text-[7px] font-black uppercase opacity-40 mt-1">{new Date(evt.start_date).toLocaleString('default', { month: 'short' })}</span>
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-sm font-black tracking-tight text-slate-900 uppercase truncate group-hover/item:text-primary transition-colors leading-none">{evt.name}</p>
                         <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1.5 flex items-center gap-1.5 leading-none opacity-60">
                            <Clock size={8} className="text-slate-200" /> {evt.start_time || "09:00 AM"} IST
                         </p>
                       </div>
                     </div>
                   ))
                 )}
               </div>

               <button className="w-full mt-8 h-12 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 flex items-center justify-center gap-2.5 active:scale-95 group shadow-sm hover:shadow-md transition-all">
                 Expand Ledger <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-7 border border-amber-100/50 shadow-inner relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-5"><Activity size={80} /></div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-700 mb-4 flex items-center gap-2">
              <ShieldCheck size={12} /> Security Protocol
            </h4>
            <div className="space-y-3">
                <p className="text-[10px] font-black text-amber-900/60 leading-relaxed uppercase tracking-tight">
                    Spatial Node geofencing initialized. Attendance vectors are being cross-referenced with Central Authority coordinates.
                </p>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">Live Encryption Active</span>
                </div>
            </div>
          </div>
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

function MetricCard({ label, value, icon: Icon, trend, color, subtext }) {
  const colors = {
    blue: 'text-blue-500 bg-blue-50',
    emerald: 'text-emerald-500 bg-emerald-50',
    orange: 'text-orange-500 bg-orange-50',
    purple: 'text-purple-500 bg-purple-50',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-slate-100 transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-125 transition-transform text-slate-900"><Icon size={40} /></div>
      <div className="flex items-center gap-3 mb-5">
        <div className={`h-8 w-8 rounded-lg shadow-inner flex items-center justify-center ${colors[color]} transition-transform group-hover:scale-110`}>
          <Icon size={16} />
        </div>
        <div>
           <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
           <p className="text-[8px] font-black text-emerald-500 mt-1 uppercase tracking-widest">{trend}</p>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        <p className="text-[8px] font-black text-slate-300 mt-2.5 uppercase tracking-widest flex items-center gap-1.5 leading-none opacity-60">
           <Database size={8} /> {subtext}
        </p>
      </div>
    </div>
  );
}

function SimpleAction({ icon: Icon, label, desc, href, color }) {
  return (
    <a href={href} className="flex items-center gap-3 p-4 rounded-xl hover:bg-white border-2 border-transparent hover:border-slate-50 transition-all group bg-slate-50/50 hover:shadow-xl hover:shadow-slate-100">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color} group-hover:scale-110 shadow-inner transition-transform`}>
        <Icon size={18} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[13px] font-black text-slate-900 tracking-tight uppercase truncate group-hover:text-primary transition-colors leading-none">{label}</p>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate mt-1.5 leading-none opacity-60">{desc}</p>
      </div>
    </a>
  );
}
