import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Download as DownloadIcon, Plus, Search, RefreshCw, X, Sparkles, AlertCircle, ChevronLeft, ChevronRight, Database, Zap, Layers, ArrowRight, ShieldCheck, Lock
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

/** -------------------- Helpers -------------------- */
function extractDRFError(e) {
  const data = e?.response?.data;
  if (!data) return "Something went wrong.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (typeof data === "object") {
    const k = Object.keys(data)[0];
    const v = data[k];
    if (Array.isArray(v)) return v[0];
    if (typeof v === "string") return v;
  }
  return "Request failed.";
}

async function downloadFile(url, filename) {
  const res = await api.get(url, { responseType: "blob" });
  const blob = new Blob([res.data]);
  const href = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(href);
}

export default function DonationsPage() {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [donations, setDonations] = useState([]);
  const [count, setCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

  const [addOpen, setAddOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(true);

  const [form, setForm] = useState({
    devotee: "",
    payment_mode: "cash",
    amount: "",
    purpose: "",
    is_anonymous: false
  });

  const [devotees, setDevotees] = useState([]);
  const [errorMSG, setErrorMSG] = useState("");
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  useEffect(() => {
    if (checkPermission('donations', 'view')) {
        fetchDonations();
    }
  }, [page, search, ordering, checkPermission]);

  useEffect(() => {
    if (addOpen && devotees.length === 0) {
      api.get("/devotees/?page_size=100").then((res) => {
        setDevotees(Array.isArray(res.data) ? res.data : res.data.results || []);
      });
    }
  }, [addOpen]);

  async function fetchDonations() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ ordering, page, page_size: pageSize });
      if (search) params.append("search", search);

      const res = await api.get(`/donations/?${params}`);
      if (Array.isArray(res.data)) {
        setDonations(res.data);
        setCount(res.data.length);
      } else {
        setDonations(res.data.results || []);
        setCount(res.data.count || 0);
      }
    } catch (e) {
      setError(t('failed_to_load_donations', "Failed to load donations"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    if (e) e.preventDefault();
    setErrorMSG("");
    if (!form.amount || !form.payment_mode) return setErrorMSG(t('amount_mode_required', "Amount and Mode are required."));
    if (!form.is_anonymous && !form.devotee) return setErrorMSG(t('devotee_or_anon_required', "Select a Donor or mark Anonymous."));

    try {
      await api.post("/donations/", form);
      setAddOpen(false);
      setForm({ devotee: "", amount: "", category: "", payment_mode: "cash", purpose: "", is_anonymous: false });
      setPage(1);
      fetchDonations();
    } catch (e) {
      setErrorMSG(extractDRFError(e));
    }
  }

  async function onDownload(type) {
    try {
      if (type === "csv") await downloadFile("/donations/export/csv/", "donations.csv");
      if (type === "excel") await downloadFile("/donations/export/excel/", "donations.xlsx");
      if (type === "pdf") await downloadFile("/donations/export/pdf/", "donations.pdf");
      setDownloadMenuOpen(false);
    } catch (e) {
      setError(t('download_failed', "Download failed. Please try again."));
    }
  }

  const getBadgeStyle = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case 'success': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'pending': return "bg-amber-50 text-amber-600 border-amber-100";
      case 'failed': return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  if (!checkPermission('donations', 'view')) {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
            <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                <Lock size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Access Restricted</h1>
            <p className="max-w-md text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                You do not have the necessary privileges to access the Endowment Hub. 
                Please contact your temple administrator for access.
            </p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Prime Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10">
                    <Heart size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Endowment Hub</h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Database size={10} className="text-primary" /> Philanthropic Capital Registry
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <div className="relative group min-w-[300px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Query Donor Database..." 
                    value={search}
                    onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                    className="w-full h-11 pl-14 pr-6 rounded-xl bg-white border border-slate-100 focus:ring-4 focus:ring-slate-50 outline-none text-[11px] font-bold transition-all shadow-inner"
                />
            </div>
            {checkPermission('donations', 'view') && (
                <div className="relative">
                    <button
                        onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                        className="h-11 px-5 bg-white border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 uppercase tracking-widest shadow-sm"
                    >
                        <DownloadIcon size={14} /> Export
                    </button>
                    <AnimatePresence>
                        {downloadMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-14 w-40 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden z-[100] p-1"
                            >
                                {['csv', 'excel', 'pdf'].map(fmt => (
                                    <button key={fmt} onClick={() => onDownload(fmt)} className="w-full text-left px-4 py-2.5 text-[9px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg uppercase tracking-widest transition-colors">{fmt}</button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
            <button
                onClick={() => setAddOpen(true)}
                className={`h-11 px-6 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95 ${!checkPermission('donations', 'edit') ? 'hidden' : ''}`}
            >
                <Plus size={18} /> New Remittance
            </button>
        </div>
      </header>

      {/* Analytics / Status Ribbon */}
      <AnimatePresence>
        {promoOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            className="mx-4 md:mx-0 bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group border border-white/5"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><Sparkles size={60} /></div>
            <div className="flex items-center gap-6 z-10">
                <div className="h-11 w-11 bg-white/10 rounded-xl flex items-center justify-center text-primary border border-white/10 shadow-inner">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-tighter uppercase">{t('donation_tip', 'Secure Receipts')}</h3>
                    <p className="text-[9px] font-black text-white/40 mt-1 uppercase tracking-widest">{t('donation_tip_desc', 'Every donation is securely recorded with automated professional receipts.')}</p>
                </div>
            </div>
            <button onClick={() => setPromoOpen(false)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors border border-white/5"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Ledger */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group mx-4 md:mx-0">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div>
                <h2 className="text-[10px] font-black text-slate-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                    <Layers size={16} className="text-slate-900" /> Administrative Capital Ledger
                </h2>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Consolidated registry of philanthropic contributions</p>
            </div>
            <button onClick={fetchDonations} className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
                <tr className="bg-white border-b border-slate-50">
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">registry index</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">donor identity</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">remittance</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400">classification</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">audit</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="py-32 text-center text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Syncing Treasury Pipeline...</td></tr>
              ) : donations.length === 0 ? (
                <tr><td colSpan="5" className="py-24 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No capital contributions identified</td></tr>
              ) : donations.map((d) => (
                <tr key={d.id} className="group/row hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-6">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover/row:text-slate-900 transition-colors">#{d.id}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">{d.is_anonymous ? t('anonymous') : d.devotee_name || t('unknown')}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{d.purpose || "GENERAL ENDOWMENT"}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-base font-black text-emerald-600 tracking-tighter">₹{d.amount}</span>
                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{d.payment_mode}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${getBadgeStyle(d.payment_status)}`}>
                        {d.payment_status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => window.open(`${api.defaults.baseURL}/donations/receipt/${d.id}/`, "_blank")}
                      className="h-9 px-4 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/row:opacity-100 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <DownloadIcon size={12} /> Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-10 border-t border-slate-50 bg-slate-50/30">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
            count={count} 
            pageSize={pageSize} 
          />
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {addOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setAddOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col border border-slate-100">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white">
                <div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">New Remittance</h2>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2.5">Authorize manual capital injection</p>
                </div>
                <button onClick={() => setAddOpen(false)} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 active:scale-90">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-10 space-y-8">
                <label className="flex items-center gap-4 p-5 border-2 border-slate-100 bg-slate-50/50 rounded-2xl cursor-pointer hover:border-slate-900 transition-all group">
                  <input type="checkbox" checked={form.is_anonymous} onChange={e => setForm({ ...form, is_anonymous: e.target.checked })} className="w-5 h-5 rounded text-slate-900 focus:ring-slate-900 border-slate-200 transition-all cursor-pointer" />
                  <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-[9px] uppercase tracking-widest">Protocol Anonymity</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5 opacity-60">Identity will be suppressed</span>
                  </div>
                </label>

                <div className="space-y-6">
                    {!form.is_anonymous && (
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Donor Assignment</label>
                        <select value={form.devotee} onChange={e => setForm({ ...form, devotee: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 h-12 transition-all font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 shadow-inner appearance-none cursor-pointer text-xs">
                        <option value="">Search Domain Registry...</option>
                        {devotees.map(d => <option key={d.id} value={d.id}>{d.full_name} ({d.phone})</option>)}
                        </select>
                    </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Capital Magnitude (₹)</label>
                            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 h-12 transition-all font-black text-slate-900 text-sm outline-none focus:bg-white focus:border-slate-900 shadow-inner" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Protocol</label>
                            <select value={form.payment_mode} onChange={e => setForm({ ...form, payment_mode: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 h-12 transition-all font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 shadow-inner appearance-none cursor-pointer text-xs">
                                <option value="cash">CASH DEPOT</option>
                                <option value="upi">DIGITAL (UPI)</option>
                                <option value="bank_transfer">WIRE TRANSFER</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Remarks</label>
                        <textarea placeholder="Specify purpose..." value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 transition-all font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 shadow-inner min-h-[100px] resize-none leading-relaxed text-[11px]"></textarea>
                    </div>
                </div>

                {errorMSG && (
                  <div className="p-6 bg-red-50 text-red-500 border border-red-100 rounded-2xl flex items-start gap-4">
                    <AlertCircle size={24} className="flex-shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{errorMSG}</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button onClick={handleCreate} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                    Commit To Ledger <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
