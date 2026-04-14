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
  Database
} from "lucide-react";

const fmtINR = (n) =>
  `₹ ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const HundiPage = () => {
  const { t } = useTranslation();
  const denoms = useMemo(() => [500, 200, 100, 50, 20, 10, 5, 2, 1], []);
  const [counts, setCounts] = useState({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 });

  const [witnesses, setWitnesses] = useState(["Temple Treasurer", "Chief Priest"]);
  const [witnessModalOpen, setWitnessModalOpen] = useState(false);
  const [witnessName, setWitnessName] = useState("");

  const [sessionName, setSessionName] = useState(`AUDIT_NODE_${new Date().getTime().toString().slice(-6)}`);
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
      return setErrorMSG("Validation Protocol: At least two witnesses are required.");
    }
    if (total <= 0) {
      return setErrorMSG("Input Error: Total remittance must exceed zero.");
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
      setErrorMSG(e.response?.data?.detail || "Submission Error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderAudit = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-7 space-y-4"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                   <FileSpreadsheet size={16} />
                </div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Denomination Ledger</h3>
             </div>
             <button onClick={() => setCounts({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 })} className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-all">
                Reset
             </button>
          </div>
          
          <div className="p-3 space-y-0.5">
            {denoms.map((d) => (
              <div key={d} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all group">
                <div className="w-20">
                  <div className="h-10 flex items-center justify-center rounded-lg bg-white border border-slate-100 font-bold text-slate-900 shadow-sm group-hover:border-slate-300 transition-all text-sm">
                     <span className="text-[9px] text-slate-400 mr-1.5 uppercase tracking-widest">₹</span> {d}
                  </div>
                </div>
                <div className="text-slate-200 font-bold">×</div>
                <div className="flex-1 max-w-[120px]">
                  <input
                    type="number"
                    value={counts[d] === 0 ? "" : counts[d]}
                    onChange={(e) => handleCountChange(d, e.target.value)}
                    placeholder="0"
                    className="w-full h-10 bg-slate-100 border border-transparent rounded-lg px-4 outline-none focus:bg-white focus:border-slate-900 transition-all font-black text-slate-900 text-center text-sm"
                  />
                </div>
                <div className="flex-1 text-right">
                   <div className="text-[9px] font-black text-slate-900 tracking-tight">{fmtINR(d * (counts[d] || 0))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-5 space-y-4"
      >
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden border border-slate-800 shadow-2xl shadow-slate-900/40">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Lock size={48} /></div>
           <p className="text-primary font-black tracking-[0.3em] uppercase text-[8px] mb-6">Financial Audit Protocol</p>
           
           <div className="space-y-4 mb-8">
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Registry Node</label>
                <input 
                  type="text" value={sessionName} onChange={e => setSessionName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 h-10 text-[11px] font-bold text-white outline-none focus:border-white/30 transition-all"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Auth Date</label>
                <input 
                  type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 h-10 text-[11px] font-bold text-white outline-none focus:border-white/30 transition-all"
                />
             </div>
           </div>

           <div className="space-y-0.5 mb-8">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Remittance Total</span>
              <div className="text-3xl font-bold tracking-tighter text-white">{fmtINR(total)}</div>
           </div>

           <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                 <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">Objects</p>
                 <p className="text-lg font-bold mt-0.5">{notesCount}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 <span className="text-[7px] font-black uppercase tracking-widest ml-1.5">Verified</span>
              </div>
           </div>

           {errorMSG && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest leading-relaxed">
                 {errorMSG}
              </div>
           )}

           <button
             onClick={submitSession} disabled={submitLoading}
             className="w-full h-12 bg-white text-slate-900 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {submitLoading ? <RefreshCw className="animate-spin" size={14} /> : <>Commit Vault <ArrowRight size={14} /></>}
           </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Validation Witnesses</h4>
              <button onClick={() => setWitnessModalOpen(true)} className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                <Plus size={14} />
              </button>
           </div>
           
           <div className="space-y-2">
              {witnesses.length === 0 ? (
                <p className="text-center py-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">Awaiting Validation</p>
              ) : (
                witnesses.map(w => (
                  <div key={w} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-lg border border-slate-100 group">
                     <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{w}</span>
                     <button onClick={() => setWitnesses(prev => prev.filter(x => x !== w))} className="text-slate-200 hover:text-red-500 transition-colors">
                        <X size={12} />
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
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-50">
              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest">Session Hash</th>
              <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest">Remittance</th>
              <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest">Auth By</th>
              <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sessionsLoading ? (
               <tr><td colSpan="4" className="py-20 text-center"><div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin mx-auto"></div></td></tr>
            ) : sessions.length === 0 ? (
               <tr><td colSpan="4" className="py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-widest">No vault records detected</td></tr>
            ) : sessions.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-10 py-4">
                   <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all font-mono text-[9px]">#</div>
                      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{s.name || `SESSION_${s.id}`}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="text-base font-black text-slate-900 tracking-tighter">{fmtINR(s.total_amount)}</span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-wrap gap-1.5">
                     {s.witnesses?.slice(0, 2).map((w, idx) => (
                       <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded uppercase tracking-widest">{w.name || w}</span>
                     ))}
                     {s.witnesses?.length > 2 && <span className="text-[8px] font-black text-slate-300">+{s.witnesses.length - 2}</span>}
                   </div>
                </td>
                <td className="px-10 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   {new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                <Wallet size={18} />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Vault Audit</h1>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Zap size={10} className="text-primary" /> Hundi Remittance & Physical Counting Node
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setTab('audit')}
            className={`px-6 h-9 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${tab === 'audit' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShieldCheck size={12} /> New Audit
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-6 h-9 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${tab === 'history' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <History size={12} /> Vault Log
          </button>
        </div>
      </header>

      {tab === "audit" ? renderAudit() : renderHistory()}

      <AnimatePresence>
        {witnessModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setWitnessModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white w-full max-w-xs rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Validator</h2>
                <button onClick={() => setWitnessModalOpen(false)} className="h-8 w-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={20} /></button>
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
                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                   <input autoFocus value={witnessName} onChange={e => setWitnessName(e.target.value)} required className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs" placeholder="Name / Role" />
                </div>
                <button type="submit" className="w-full h-11 bg-slate-900 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest">Authorize</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HundiPage;
