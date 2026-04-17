import { useEffect, useState } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Plus, Filter, Download as DownloadIcon, ChevronLeft, ChevronRight,
  Edit, Trash2, Calendar, MapPin, Sparkles, X, FileText, CheckCircle2, AlertCircle, Clock,
  ArrowUpRight, MoreVertical, ShieldCheck, Mail, Phone, Layout, Database, Verified,
  Zap,
  Globe,
  Fingerprint,
  Moon,
  IdCard
} from "lucide-react";
import { useDevotees } from "./application/useDevotees";
import Pagination from "../../components/common/Pagination";

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
  const { checkPermission } = useAuth();
  const { state, actions } = useDevotees();

  useEffect(() => {
    actions.fetchDevotees();
    actions.fetchMasters();
  }, [state.page, state.search, state.ordering, state.dateFilter, state.searchField, state.tab]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                <Users size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Devotee Directory</h1>
               <p className="text-xs font-medium text-slate-500 mt-0.5">
                   Maintain records of devotees and their birth details
               </p>
            </div>
        </div>

        <div className="flex items-center gap-3">
          {checkPermission('devotees', 'view') && (
            <button 
              onClick={() => actions.onDownload('csv')}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
                <DownloadIcon size={14} /> Export CSV
            </button>
          )}
          {checkPermission('devotees', 'edit') && (
            <button
                onClick={actions.onAddClick}
                className="h-10 px-5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
                <Plus size={18} /> Add New Devotee
            </button>
          )}
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsCard label="Registered Devotees" value={state.stats.count || 0} icon={Users} color="slate" />
         <StatsCard label="Identity Verified" value={state.stats.verified || 0} icon={Verified} color="emerald" />
         <StatsCard label="Joined this Month" value={state.stats.this_month || 0} icon={Clock} color="orange" trend={`${state.stats.trend >= 0 ? '+' : ''}${state.stats.trend}%`} />
         <StatsCard label="Nakshatra Groups" value={state.nakshatras.length} icon={Moon} color="blue" />
      </div>

      {/* Filter & View Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
            <TabButton active={state.tab === "devotees"} onClick={() => actions.setTab("devotees")} label="Devotee List" />
            <TabButton active={state.tab === "nakshatras"} onClick={() => actions.setTab("nakshatras")} label="Nakshatra Management" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-10 w-full md:w-auto focus-within:border-primary transition-all">
                <select 
                    value={state.searchField} 
                    onChange={e => actions.setSearchField(e.target.value)}
                    className="pl-3 pr-1 bg-transparent text-[11px] font-bold uppercase tracking-wider text-slate-500 outline-none border-r border-slate-100 cursor-pointer"
                >
                    <option value="all">Search All</option>
                    <option value="phone">Phone #</option>
                </select>
                <div className="relative flex items-center px-3 group flex-1 md:w-60">
                   <Search size={14} className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                   <input 
                      type="text"
                      value={state.search}
                      onChange={e => actions.setSearch(e.target.value)}
                      placeholder="Find by name or ID..."
                      className="w-full h-full bg-transparent border-none outline-none pl-2 text-xs font-semibold text-slate-900 placeholder:text-slate-300"
                   />
                </div>
             </div>
             
             <button 
                onClick={() => actions.setDateFilter(prev => prev === 'last_30' ? 'all' : 'last_30')}
                className={`h-10 px-4 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                    state.dateFilter === 'last_30' ? 'bg-primary border-primary text-white shadow-md shadow-yellow-900/10' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
             >
                <Calendar size={14} /> {state.dateFilter === 'last_30' ? "Last 30 Days" : "All Records"}
             </button>
          </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {state.tab === "nakshatras" ? (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nakshatra Name</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">System Code</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                       {checkPermission('devotees', 'edit') && (
                            <button 
                                onClick={actions.onAddMasterClick}
                                className="h-8 px-3 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2 float-right shadow-sm"
                            >
                                <Plus size={14} /> Add New
                            </button>
                       )}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {state.nakshatras.map(item => (
                       <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-5">
                              <span className="text-sm font-bold text-slate-900">{item.name}</span>
                          </td>
                          <td className="px-8 py-5">
                              <span className="text-[10px] font-mono text-slate-400">NK-{String(item.id || '').padStart(3, '0')}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex justify-end items-center gap-2">
                                {checkPermission('devotees', 'edit') && (
                                    <button onClick={() => { actions.setEditingId(item.id); actions.setMasterForm({ name: item.name }); actions.setMasterOpen(true); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                        <Edit size={14} />
                                    </button>
                                )}
                                {checkPermission('devotees', 'delete') && (
                                    <button onClick={() => actions.deleteMaster(item.id)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                             </div>
                          </td>
                       </tr>
                   ))}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-[13px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Devotee</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Contact</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Birth Details</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID Verification</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {state.loading ? (
                    <tr><td colSpan="5" className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading records...</td></tr>
                 ) : state.devotees.map(d => (
                    <tr key={d.id} className="group hover:bg-slate-50/50 transition-all">
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                              <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                                 {d.full_name?.[0] || '?'}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">{d.full_name}</p>
                                 <p className="text-[10px] font-medium text-slate-400 mt-0.5">ID: #{d.id}</p>
                              </div>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                           <div className="space-y-1">
                              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                                 <Phone size={12} className="text-slate-300" /> {d.phone}
                              </p>
                              {d.email && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-1.5 lowercase">
                                   <Mail size={12} className="text-slate-300" /> {d.email}
                                </p>
                              )}
                           </div>
                       </td>
                       <td className="px-8 py-5">
                           {d.nakshatra_name ? (
                               <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10">
                                   <Moon size={12} />
                                   {d.nakshatra_name}
                               </div>
                           ) : <span className="text-slate-200">—</span>}
                       </td>
                       <td className="px-8 py-5">
                           {d.id_proof_type ? (
                               <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                     <IdCard size={16} />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-bold uppercase text-slate-800 tracking-tight">{d.id_proof_type}</p>
                                     <p className="text-[10px] font-medium text-slate-400 mt-0.5">{d.id_proof_number?.slice(-4).padStart(12, '•')}</p>
                                  </div>
                               </div>
                           ) : (
                               <span className="text-[10px] font-bold text-slate-300 uppercase letter-wider">Not Provided</span>
                           )}
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex justify-end items-center gap-1">
                             {checkPermission('devotees', 'edit') && (
                                <button onClick={() => actions.onEditClick(d)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                    <Edit size={14} />
                                </button>
                             )}
                             <button onClick={() => actions.openHistory(d)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-yellow-50 transition-all">
                                <FileText size={14} />
                             </button>
                             {checkPermission('devotees', 'delete') && (
                                <button onClick={() => actions.deleteDevotee(d.id)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                    <Trash2 size={14} />
                                </button>
                             )}
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-8 py-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/20">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Temple Registry System</span>
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => actions.setAddOpen(false)} />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                      <Plus size={20} />
                   </div>
                   <div>
                      <h2 className="text-base font-bold text-slate-900">{state.editingId ? "Update Information" : "New Devotee Record"}</h2>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">Please fill all mandatory fields correctly</p>
                   </div>
                </div>
                <button onClick={() => actions.setAddOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputGroup label="Full Name" value={state.form.full_name} onChange={val => actions.setForm({...state.form, full_name: val})} placeholder="e.g. Ramesh Kumar" icon={Users} />
                   <InputGroup label="Phone Number" value={state.form.phone} onChange={val => actions.setForm({...state.form, phone: val})} placeholder="e.g. +91 99999 00000" icon={Phone} />
                   <InputGroup label="Email Address" value={state.form.email} onChange={val => actions.setForm({...state.form, email: val})} placeholder="optional" icon={Mail} />
                   
                   <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Nakshatra</label>
                      <div className="relative">
                        <Moon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <select 
                          value={state.form.nakshatra} 
                          onChange={e => actions.setForm({ ...state.form, nakshatra: e.target.value })} 
                          className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all cursor-pointer appearance-none"
                        >
                          <option value="">Select Nakshatra...</option>
                          {state.nakshatras.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                        </select>
                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={16} className="text-primary" />
                       <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">ID Verification Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                           <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider">Document Type</label>
                           <select 
                             value={state.form.id_proof_type} 
                             onChange={(e) => actions.setForm({ ...state.form, id_proof_type: e.target.value })} 
                             className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 outline-none font-semibold text-sm text-slate-900 transition-all focus:border-primary appearance-none"
                           >
                              <option value="">Select Document</option>
                              {ID_PROOF_CHOICES.map((c) => <option key={c.value} value={c.value}>{t(c.key, c.label)}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2.5">
                           <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 tracking-wider">Document Number</label>
                           <input 
                              value={state.form.id_proof_number} 
                              onChange={(e) => actions.setForm({ ...state.form, id_proof_number: e.target.value })} 
                              placeholder="e.g. ID Number / Aadhar" 
                              className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 outline-none font-semibold text-sm text-slate-900 transition-all focus:border-primary" 
                           />
                        </div>
                    </div>
                </div>

                {state.error && (
                   <div className="mt-6 p-4 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 border border-red-100 text-xs font-bold uppercase tracking-tight">
                      <AlertCircle size={18} /> {state.error}
                   </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-4">
                 <button onClick={() => actions.setAddOpen(false)} className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                 <button onClick={actions.saveDevotee} className="px-8 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all">
                    {state.editingId ? "Update Record" : "Register Devotee"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Nakshatra Master Modal */}
      <AnimatePresence>
        {state.masterOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => actions.setMasterOpen(false)} />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 overflow-hidden border border-slate-100">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <Moon size={16} />
                     </div>
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{state.editingId ? "Edit" : "Add"} Nakshatra</h3>
                  </div>
                  <button onClick={() => actions.setMasterOpen(false)} className="text-slate-300 hover:text-slate-900"><X size={20} /></button>
               </div>
               
               <div className="p-8 space-y-6">
                  <InputGroup 
                    label="Official Name" 
                    value={state.masterForm.name} 
                    onChange={val => actions.setMasterForm({ name: val })} 
                    placeholder="e.g. Rohini" 
                    icon={Sparkles} 
                  />
                  {state.error && <p className="text-[10px] font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2 tracking-tight"><AlertCircle size={14} /> {state.error}</p>}
               </div>
               
               <div className="px-8 pb-8 flex flex-col gap-3">
                  <button 
                    onClick={actions.saveMaster}
                    className="w-full h-11 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md shadow-slate-900/10"
                  >
                    {state.editingId ? "Save Changes" : "Create Nakshatra"}
                  </button>
                  <button onClick={() => actions.setMasterOpen(false)} className="w-full h-10 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600">Cancel</button>
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
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-primary/20 transition-all group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ${colors[color]}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
                   {trend && <span className="text-[9px] font-bold text-emerald-600">{trend}</span>}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }) {
    return (
        <button 
           onClick={onClick} 
           className={`px-5 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
               active ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
           }`}
        >
          {label}
        </button>
    );
}

function InputGroup({ label, value, onChange, placeholder, icon: Icon, type="text", symbol }) {
    return (
        <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                {label}
            </label>
            <div className="relative group">
                {symbol ? (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{symbol}</div>
                ) : (
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                )}
                <input 
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-11 bg-slate-50 border border-slate-200 rounded-xl ${symbol || Icon ? 'pl-11' : 'pl-4'} pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all`}
                />
            </div>
        </div>
    );
}


