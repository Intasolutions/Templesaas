import { useEffect, useState } from "react";
import api from "../../shared/api/client";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Plus, Filter, Download as DownloadIcon, ChevronLeft, ChevronRight,
  Edit, Trash2, Calendar, MapPin, Sparkles, X, FileText, CheckCircle2, AlertCircle, Clock,
  ArrowUpRight, MoreVertical, ShieldCheck, Mail, Phone, Layout, Database, Verified,
  Zap,
  Globe,
  Fingerprint
} from "lucide-react";
import { useDevotees } from "./application/useDevotees";

const ID_PROOF_CHOICES = [
  { value: "aadhar", key: "aadhar", label: "Aadhar Card" },
  { value: "pan", key: "pan", label: "PAN Card" },
  { value: "voter", key: "voter", label: "Voter ID" },
  { value: "driving_license", key: "driving_license", label: "Driving License" },
  { value: "passport", key: "passport", label: "Passport" },
  { value: "other", key: "other", label: "Other" },
];

function resolveFileUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const base = api?.defaults?.baseURL || "";
  if (!base) return pathOrUrl;
  return base.replace(/\/$/, "") + pathOrUrl;
}

export default function DevoteesPage() {
  const { t } = useTranslation();
  const { state, actions } = useDevotees();

  useEffect(() => {
    actions.fetchDevotees();
    actions.fetchMasters();
  }, [state.page, state.search, state.ordering, state.dateFilter, state.searchField, state.tab]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Cinematic Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
               <Fingerprint size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Devotee Hub</h1>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                 <Database size={10} className="text-primary" /> Central Intelligence Repository
               </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-5 rounded-xl border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
            <DownloadIcon size={14} /> Export
          </button>
          <button
            onClick={actions.onAddClick}
            className="h-11 px-6 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95"
          >
            <Plus size={18} /> Register
          </button>
        </div>
      </header>

      {/* Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-0">
         <StatsCard label="Total Registry" value={state.count || state.devotees.length} icon={Users} color="slate" />
         <StatsCard label="Verified Identities" value={state.proofsCount} icon={ShieldCheck} color="emerald" />
         <StatsCard label="Recent Onboarding" value="12" icon={Clock} color="orange" trend="+24%" />
         <StatsCard label="Astral Nodes" value={state.nakshatras.length} icon={Globe} color="blue" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4 md:px-0">
          <div className="flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-100 w-fit shadow-inner">
            <TabButton active={state.tab === "devotees"} onClick={() => actions.setTab("devotees")} label="Central Registry" />
            <TabButton active={state.tab === "nakshatras"} onClick={() => actions.setTab("nakshatras")} label="Nakshatra Masters" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm h-11 focus-within:ring-4 focus-within:ring-slate-50 transition-all">
                <select 
                    value={state.searchField} 
                    onChange={e => actions.setSearchField(e.target.value)}
                    className="pl-4 pr-2 bg-transparent text-[9px] font-black uppercase tracking-widest text-slate-400 outline-none border-r border-slate-50 cursor-pointer hover:text-slate-900 transition-colors"
                >
                    <option value="all">Global</option>
                    <option value="phone">Phone</option>
                </select>
                <div className="relative flex items-center px-4 w-60 group">
                   <Search size={14} className="text-slate-200 group-focus-within:text-slate-900 transition-colors" />
                   <input 
                      type="text"
                      value={state.search}
                      onChange={e => actions.setSearch(e.target.value)}
                      placeholder="Audit Registry Identifiers..."
                      className="w-full h-full bg-transparent border-none outline-none pl-3 text-[11px] font-bold text-slate-900 placeholder:text-slate-200"
                   />
                </div>
             </div>
             
             <button 
                onClick={() => actions.setDateFilter(prev => prev === 'last_30' ? 'all' : 'last_30')}
                className={`h-11 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2.5 ${
                    state.dateFilter === 'last_30' ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900'
                }`}
             >
                <Calendar size={14} /> {state.dateFilter === 'last_30' ? "Last 30 Days" : "Full History"}
             </button>
          </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0">
        {state.tab === "nakshatras" ? (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Master Identifier</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">System Alias</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {state.nakshatras.map(item => (
                       <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                          <td className="px-12 py-8">
                              <span className="text-lg font-bold text-slate-900 tracking-tight uppercase">{item.name}</span>
                          </td>
                          <td className="px-12 py-8">
                              <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">NK-NODE-0{item.id}</span>
                          </td>
                          <td className="px-12 py-8 text-right">
                             <div className="flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <button onClick={() => { actions.setEditingId(item.id); actions.setMasterForm({ name: item.name }); actions.setMasterOpen(true); }} className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                                   <Edit size={16} />
                                </button>
                                <button onClick={() => actions.deleteMaster(item.id)} className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                   ))}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Devotee Identifier</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Connectivity</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Astral Node</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Validation</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {state.loading ? (
                    <tr><td colSpan="5" className="py-32 text-center text-[11px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Accessing Primary Datastore...</td></tr>
                 ) : state.devotees.map(d => (
                    <tr key={d.id} className="group hover:bg-slate-50/30 transition-colors">
                       <td className="px-10 py-5">
                          <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                 {d.full_name?.[0].toUpperCase()}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900 tracking-tight uppercase leading-none">{d.full_name}</p>
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1.5 leading-none">
                                    <Database size={10} className="text-primary/40" /> ID: #{d.id}
                                 </p>
                              </div>
                          </div>
                       </td>
                       <td className="px-10 py-5">
                           <div className="space-y-1.5">
                              <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5 tracking-tight">
                                 <Phone size={10} className="text-slate-300" /> {d.phone}
                              </p>
                              <p className="text-[8px] font-bold text-slate-400 lowercase tracking-widest flex items-center gap-1.5 leading-none">
                                 <Mail size={10} className="text-slate-200" /> {d.email || "node.local"}
                              </p>
                           </div>
                       </td>
                       <td className="px-10 py-5">
                           {d.nakshatra_name ? (
                               <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                   <Sparkles size={10} />
                                   {d.nakshatra_name}
                               </div>
                           ) : <span className="text-slate-200 text-[9px] font-black uppercase tracking-widest">—</span>}
                       </td>
                       <td className="px-10 py-5">
                           {d.id_proof_type ? (
                               <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm">
                                     <Verified size={20} />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black uppercase text-slate-900 tracking-tight leading-none">{d.id_proof_type}</p>
                                     <p className="text-[10px] font-bold text-slate-400 mt-1 tracking-[0.2em]">{d.id_proof_number?.slice(-4).padStart(12, '•')}</p>
                                  </div>
                               </div>
                           ) : (
                               <div className="flex items-center gap-3 text-slate-200">
                                  <div className="h-10 w-10 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center">
                                     <AlertCircle size={18} />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
                               </div>
                           )}
                       </td>
                       <td className="px-10 py-5 text-right">
                          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                             <button onClick={() => actions.onEditClick(d)} className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                                <Edit size={14} />
                             </button>
                             <button onClick={() => actions.openHistory(d)} className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                                <FileText size={14} />
                             </button>
                             <button onClick={() => actions.deleteDevotee(d.id)} className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                                <Trash2 size={14} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-12 py-10 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
           <Pagination 
              currentPage={state.page} 
              totalPages={state.totalPages} 
              onPageChange={actions.setPage} 
              count={state.count} 
              pageSize={10} 
           />
        </div>
      </div>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {state.addOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => actions.setAddOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }} className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
              <div className="p-12 md:p-16 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                <div className="space-y-4">
                   <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                      <Zap size={24} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{state.editingId ? "Update Identity" : "New Registration"}</h2>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2 flex items-center gap-2">
                        <Fingerprint size={14} className="text-primary" /> Registry Authentication Protocol
                      </p>
                   </div>
                </div>
                <button onClick={() => actions.setAddOpen(false)} className="h-14 w-14 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                  <X size={28} />
                </button>
              </div>
              
              <div className="p-12 md:p-16 overflow-y-auto space-y-16 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <InputGroup label="Full Legal Identifier" value={state.form.full_name} onChange={val => actions.setForm({...state.form, full_name: val})} placeholder="e.g. Adithya Varma" icon={Users} />
                   <InputGroup label="Mobile Secure Uplink" value={state.form.phone} onChange={val => actions.setForm({...state.form, phone: val})} placeholder="+91 90000 00000" icon={Phone} />
                   <InputGroup label="Satellite Email" value={state.form.email} onChange={val => actions.setForm({...state.form, email: val})} placeholder="user@domain.com" icon={Mail} />
                   
                   <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Astral Node (Nakshatra)</label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none" />
                        <select 
                          value={state.form.nakshatra} 
                          onChange={e => actions.setForm({ ...state.form, nakshatra: e.target.value })} 
                          className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[1.5rem] pl-16 pr-8 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all cursor-pointer appearance-none shadow-inner"
                        >
                          <option value="">Awaiting Alignment...</option>
                          {state.nakshatras.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                        </select>
                      </div>
                   </div>
                </div>

                <div className="p-12 bg-slate-900 rounded-[3rem] border border-slate-800 space-y-10">
                    <div className="flex items-center gap-4">
                       <ShieldCheck size={24} className="text-primary" />
                       <h3 className="text-xl font-bold text-white tracking-tight uppercase">Identity Validation Protocol</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Document Classification</label>
                           <select 
                             value={state.form.id_proof_type} 
                             onChange={(e) => actions.setForm({ ...state.form, id_proof_type: e.target.value })} 
                             className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none font-bold text-white transition-all focus:border-primary appearance-none cursor-pointer"
                           >
                              <option value="" className="text-slate-900">Select Document Model</option>
                              {ID_PROOF_CHOICES.map((c) => <option key={c.value} value={c.value} className="text-slate-900">{t(c.key, c.label)}</option>)}
                           </select>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Secure Identifier Token</label>
                           <input 
                              value={state.form.id_proof_number} 
                              onChange={(e) => actions.setForm({ ...state.form, id_proof_number: e.target.value })} 
                              placeholder="e.g. 0000 0000 0000 0000" 
                              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none font-bold text-white transition-all focus:border-primary tracking-widest" 
                           />
                        </div>
                    </div>
                </div>
              </div>

              <div className="p-12 md:p-16 border-t border-slate-50 bg-slate-50/50 flex justify-end items-center gap-8">
                 <button onClick={() => actions.setAddOpen(false)} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-red-500 transition-colors">Abort Registry</button>
                 <button onClick={actions.saveDevotee} className="h-16 px-16 rounded-[1.8rem] bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                    {state.editingId ? "Commit Record Update" : "Finalize Official Registration"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color, trend }) {
    const colors = {
        slate: 'bg-slate-100 text-slate-400',
        emerald: 'bg-emerald-50 text-emerald-500',
        orange: 'bg-orange-50 text-orange-500',
        blue: 'bg-blue-50 text-blue-500'
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-xl hover:shadow-slate-100 transition-all group">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                   <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
                   {trend && <span className="text-[9px] font-black text-emerald-500">{trend}</span>}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }) {
    return (
        <button 
           onClick={onClick} 
           className={`px-8 h-12 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
               active ? 'bg-white text-slate-900 shadow-xl border border-slate-200' : 'text-slate-400 hover:text-slate-900'
           }`}
        >
          {label}
        </button>
    );
}

function InputGroup({ label, value, onChange, placeholder, icon: Icon, type="text" }) {
    return (
        <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">
                {label}
            </label>
            <div className="relative group">
                <Icon size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-slate-900 transition-colors" />
                <input 
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[1.8rem] pl-16 pr-8 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner"
                />
            </div>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange, count, pageSize }) {
    return (
       <div className="flex w-full items-center justify-between">
           <div className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">
              Primary Registry Node • {count} ENTRIES
           </div>
           <div className="flex items-center gap-3">
                <button 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                    disabled={currentPage <= 1} 
                    className="h-11 w-11 flex items-center justify-center border border-slate-100 rounded-xl bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-20 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="h-11 min-w-[44px] px-3 flex items-center justify-center bg-slate-900 rounded-xl text-white text-sm font-black shadow-lg shadow-slate-900/20">
                    {currentPage}
                </div>
                <button 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
                    disabled={currentPage >= totalPages} 
                    className="h-11 w-11 flex items-center justify-center border border-slate-100 rounded-xl bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-20 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
           </div>
       </div>
    );
}
