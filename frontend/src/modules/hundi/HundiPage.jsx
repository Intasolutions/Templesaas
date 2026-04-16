import { useMemo, useState, useEffect } from "react";
import api from "../../shared/api/client";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  Sparkles, 
  X, 
  Plus, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  IndianRupee,
  ShieldCheck,
  History,
  FileSpreadsheet,
  Layers,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Users,
  Calendar,
  ChevronRight,
  ListFilter,
  Check
} from "lucide-react";

const fmtINR = (n) =>
  `₹ ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const HundiPage = () => {
  const { t } = useTranslation();
  const denoms = useMemo(() => [500, 200, 100, 50, 20, 10, 5, 2, 1], []);
  const [counts, setCounts] = useState({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 });

  const [witnesses, setWitnesses] = useState(["Temple Treasurer", "Managing Trustee"]);
  const [witnessModalOpen, setWitnessModalOpen] = useState(false);
  const [witnessName, setWitnessName] = useState("");

  const [sessionName, setSessionName] = useState(`COLLECTION_${new Date().getDate()}${new Date().getMonth()+1}_${new Date().getTime().toString().slice(-4)}`);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [tab, setTab] = useState("audit"); // audit | history
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const total = useMemo(() => {
    return denoms.reduce((sum, d) => sum + d * (Number(counts[d]) || 0), 0);
  }, [counts, denoms]);

  const notesCount = useMemo(() => {
    return denoms.reduce((sum, d) => sum + (Number(counts[d]) || 0), 0);
  }, [counts, denoms]);

  useEffect(() => {
    if (tab === "history") fetchSessions();
  }, [tab]);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const res = await api.get("/hundi/sessions/");
      setSessions(res.data.results || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleCountChange = (denom, qty) => {
    const val = parseInt(qty, 10);
    setCounts((prev) => ({ ...prev, [denom]: Number.isNaN(val) || val < 0 ? 0 : val }));
  };

  const submitSession = async () => {
    setErrorMSG("");
    if (witnesses.length < 2) {
      return setErrorMSG("Minimum two witnesses are required for verification.");
    }
    if (total <= 0) {
      return setErrorMSG("Total amount must be greater than zero.");
    }

    setSubmitLoading(true);
    try {
      await api.post("/hundi/sessions/", {
        name: sessionName,
        opening_date: sessionDate,
        status: "closed",
        denominations: counts,
        total_amount: total,
        witness_names: witnesses,
      });

      setCounts({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 });
      setTab("history");
    } catch (e) {
      setErrorMSG(e.response?.data?.detail || "Failed to submit collection record.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderAudit = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-7 space-y-6"
      >
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                   <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Denomination Counter</h3>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Enter quantity per note/coin</p>
                </div>
             </div>
             <button onClick={() => setCounts({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 })} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-all">
                Clear All
             </button>
          </div>
          
          <div className="p-4 space-y-1">
            {denoms.map((d) => (
              <div key={d} className="flex items-center gap-6 p-4 hover:bg-slate-50/50 rounded-xl transition-all group border border-transparent hover:border-slate-100">
                <div className="w-24">
                  <div className="h-11 flex items-center justify-center rounded-lg bg-white border border-slate-200 font-bold text-slate-900 shadow-sm group-hover:border-[#B8860B]/30 transition-all text-sm">
                     <span className="text-[10px] text-slate-400 mr-2 uppercase">₹</span> {d}
                  </div>
                </div>
                <div className="text-slate-300 font-bold">×</div>
                <div className="flex-1 max-w-[140px]">
                  <input
                    type="number"
                    value={counts[d] === 0 ? "" : counts[d]}
                    onChange={(e) => handleCountChange(d, e.target.value)}
                    placeholder="Quantity"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 outline-none focus:bg-white focus:border-slate-900 transition-all font-bold text-slate-900 text-center"
                  />
                </div>
                <div className="flex-1 text-right">
                   <div className="text-xs font-bold text-slate-900 tracking-tight">{fmtINR(d * (counts[d] || 0))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-5 space-y-8"
      >
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden border border-white/5 shadow-xl">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-105 transition-transform"><Lock size={80} /></div>
           <p className="text-[#B8860B] font-bold tracking-widest uppercase text-[10px] mb-6 flex items-center gap-2">
             <ShieldCheck size={14} /> Official Remittance Record
           </p>
           
           <div className="space-y-6 mb-10">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Collection Ref #</label>
                <input 
                  type="text" value={sessionName} onChange={e => setSessionName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 h-12 text-sm font-bold text-white outline-none focus:border-white/30 transition-all"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Opening Date</label>
                <input 
                  type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 h-12 text-sm font-bold text-white outline-none focus:border-white/30 transition-all"
                />
             </div>
           </div>

           <div className="space-y-1 mb-10 border-t border-white/5 pt-8">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Amount Calculated</span>
              <div className="text-3xl font-bold tracking-tight text-white">{fmtINR(total)}</div>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mb-2">Total Items</p>
                 <p className="text-xl font-bold">{notesCount}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                 <CheckCircle2 size={20} className="text-emerald-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest ml-2">Verified</span>
              </div>
           </div>

           {errorMSG && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
                 <AlertCircle size={14} /> {errorMSG}
              </div>
           )}

           <button
             onClick={submitSession} disabled={submitLoading}
             className="w-full h-14 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
           >
             {submitLoading ? <RefreshCw className="animate-spin" size={16} /> : <>Save Collection <ArrowRight size={16} /></>}
           </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#B8860B]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Authorized Witnesses</h4>
              </div>
              <button onClick={() => setWitnessModalOpen(true)} className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                <Plus size={16} />
              </button>
           </div>
           
           <div className="space-y-2">
              {witnesses.length === 0 ? (
                <p className="text-center py-8 text-[11px] font-medium text-slate-300 uppercase tracking-widest">No witnesses assigned</p>
              ) : (
                witnesses.map(w => (
                  <div key={w} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 group">
                     <span className="text-xs font-bold text-slate-700">{w}</span>
                     <button onClick={() => setWitnesses(prev => prev.filter(x => x !== w))} className="text-slate-300 hover:text-red-500 transition-colors">
                        <X size={14} />
                     </button>
                  </div>
                ))
              )}
           </div>
        </div>
      </motion.div>
    </div>
  );

  const renderHistory = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]"
    >
      <div className="overflow-x-auto text-[13px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider">Reference Name</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider">Total Remittance</th>
              <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider">Witnesses</th>
              <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-right">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sessionsLoading ? (
               <tr><td colSpan="4" className="py-20 text-center animate-pulse text-[11px] font-bold text-slate-300 uppercase tracking-widest">Loading collection logs...</td></tr>
            ) : sessions.length === 0 ? (
               <tr><td colSpan="4" className="py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No collection records found</td></tr>
            ) : sessions.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all text-[10px] font-bold">#</div>
                      <span className="font-bold text-slate-900">{s.name || `Session ${s.id}`}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-base font-bold text-slate-900 tracking-tight">{fmtINR(s.total_amount)}</span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-wrap gap-1.5">
                     {s.witnesses?.slice(0, 2).map((w, idx) => (
                       <span key={idx} className="px-2 py-0.5 bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100 rounded-md uppercase tracking-tight">{w.name || w}</span>
                     ))}
                     {s.witnesses?.length > 2 && <span className="text-[10px] font-bold text-slate-300">+{s.witnesses.length - 2} more</span>}
                   </div>
                </td>
                <td className="px-8 py-5 text-right text-[11px] font-bold text-slate-400">
                   {new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(s.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                <Wallet size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hundi Collections</h1>
               <p className="text-xs font-medium text-slate-500 mt-0.5">
                   Record and verify physical box collections with multiple witnesses
               </p>
            </div>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
          <TabButton active={tab === 'audit'} onClick={() => setTab('audit')} label="New Collection" icon={Plus} />
          <TabButton active={tab === 'history'} onClick={() => setTab('history')} label="Collection Log" icon={History} />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {tab === "audit" ? renderAudit() : renderHistory()}
      </AnimatePresence>

      <AnimatePresence>
        {witnessModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setWitnessModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                      <Users size={16} />
                   </div>
                   <h2 className="text-base font-bold text-slate-900">Add Witness</h2>
                </div>
                <button onClick={() => setWitnessModalOpen(false)} className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                const name = witnessName.trim();
                if (name) {
                  setWitnesses(prev => [...prev, name]);
                  setWitnessName("");
                  setWitnessModalOpen(false);
                }
              }} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name / Designation</label>
                   <input autoFocus value={witnessName} onChange={e => setWitnessName(e.target.value)} required className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all text-sm" placeholder="e.g. Temple President" />
                </div>
                <button type="submit" className="w-full h-11 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md">Authorize Witness</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`px-6 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            active ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
        }`}
    >
        <Icon size={14} /> {label}
    </button>
);

export default HundiPage;
