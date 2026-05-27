import { useEffect, useState } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
   Users, Search, Plus, Filter, Download as DownloadIcon, ChevronLeft, ChevronRight,
   Edit, Trash2, Calendar, MapPin, Sparkles, X, FileText, CheckCircle2, AlertCircle, Clock,
   ArrowUpRight, MoreVertical, ShieldCheck, Mail, Phone, Layout, Database, Verified,
   Zap, Globe, Fingerprint, Moon, IdCard
} from "lucide-react";
import { useDevotees } from "./application/useDevotees";
import Pagination from "../../components/common/Pagination";
import ModernInput from "../../components/ui/ModernInput";
import ResponsiveTable from "../../components/ui/ResponsiveTable";

const ID_PROOF_CHOICES = [
   { value: "aadhar", key: "aadhar", label: "Aadhar Card" },
   { value: "pan", key: "pan", label: "PAN Card" },
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
      <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 font-sans">
         {/* Header Section */}
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-2">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-md border border-slate-700">
                  <Users size={24} className="text-teal-400" />
               </div>
               <div>
                  <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Trust Directory</h1>
                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                     Official records of temple trust members and administrators
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               {checkPermission('devotees', 'view') && (
                  <button
                     onClick={() => actions.onDownload('csv')}
                     className="h-10 px-4 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:border-teal-500/30 hover:text-teal-600 transition-colors flex items-center gap-2 shadow-sm"
                  >
                     <DownloadIcon size={16} /> Export CSV
                  </button>
               )}
               {checkPermission('devotees', 'edit') && (
                  <button
                     onClick={actions.onAddClick}
                     className="h-10 px-5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
                  >
                     <Plus size={16} className="text-teal-400" /> Add Member
                  </button>
               )}
            </div>
         </header>

         {/* Stats Summary */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard label="Registered Members" value={state.stats.trust_count || 0} icon={Users} />
            <StatsCard label="Identity Verified" value={state.stats.verified || 0} icon={Verified} />
            <StatsCard label="Joined this Month" value={state.stats.this_month || 0} icon={Clock} trend={`${state.stats.trend >= 0 ? '+' : ''}${state.stats.trend}%`} />
            <StatsCard label="Nakshatra Groups" value={state.nakshatras.length} icon={Moon} />
         </div>

         {/* Filter & View Tabs */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mt-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
               <TabButton active={state.tab === "devotees"} onClick={() => actions.setTab("devotees")} label="Member List" />
               <TabButton active={state.tab === "nakshatras"} onClick={() => actions.setTab("nakshatras")} label="Nakshatra Master" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
               <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-10 w-full md:w-auto focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/20 transition-all shadow-sm">
                  <select
                     value={state.searchField}
                     onChange={e => actions.setSearchField(e.target.value)}
                     className="pl-3 pr-2 h-full bg-slate-50 text-xs font-semibold text-slate-600 outline-none border-r border-slate-200 cursor-pointer"
                  >
                     <option value="all">Search All</option>
                     <option value="phone">Phone #</option>
                  </select>
                  <div className="relative flex items-center px-3 group flex-1 md:w-64">
                     <Search size={16} className="text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                     <input
                        type="text"
                        value={state.search}
                        onChange={e => actions.setSearch(e.target.value)}
                        placeholder="Find by name or ID..."
                        className="w-full h-full bg-transparent border-none outline-none pl-3 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                     />
                  </div>
               </div>

               <button
                  onClick={() => actions.setDateFilter(prev => prev === 'last_30' ? 'all' : 'last_30')}
                  className={`h-10 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 shadow-sm ${state.dateFilter === 'last_30' ? 'bg-slate-900 border-slate-900 text-teal-400' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-500/30 hover:text-teal-600'
                     }`}
               >
                  <Calendar size={16} /> {state.dateFilter === 'last_30' ? "Last 30 Days" : "All Records"}
               </button>
            </div>
         </div>

         {/* Main Table Container */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            {state.tab === "nakshatras" ? (
               <ResponsiveTable
                  columns={[
                     {
                        header: "Nakshatra Name",
                        key: "name",
                        render: (item) => <span className="text-sm font-semibold text-slate-900">{item.name_ml || item.name}</span>
                     },
                     {
                        header: "System Code",
                        key: "code",
                        render: (item) => (
                           <span className="inline-flex px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
                              NK-{String(item.id || '').padStart(3, '0')}
                           </span>
                        )
                     },
                     {
                        header: (
                           checkPermission('devotees', 'edit') ? (
                              <button
                                 onClick={actions.onAddMasterClick}
                                 className="h-8 px-3 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors flex items-center gap-2 border border-teal-200/50"
                              >
                                 <Plus size={14} /> Add New
                              </button>
                           ) : "Actions"
                        ),
                        key: "actions",
                        align: "right",
                        render: (item) => (
                           <div className="flex justify-end items-center gap-2">
                              {checkPermission('devotees', 'edit') && (
                                 <button onClick={(e) => { e.stopPropagation(); actions.setEditingId(item.id); actions.setMasterForm({ name: item.name, name_ml: item.name_ml }); actions.setMasterOpen(true); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center">
                                    <Edit size={16} />
                                 </button>
                              )}
                              {checkPermission('devotees', 'delete') && (
                                 <button onClick={(e) => { e.stopPropagation(); actions.deleteMaster(item.id); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center">
                                    <Trash2 size={16} />
                                 </button>
                              )}
                           </div>
                        )
                     }
                  ]}
                  data={state.nakshatras}
                  loading={state.loading}
               />
            ) : (
               <ResponsiveTable
                  columns={[
                     {
                        header: "Member Profile",
                        key: "profile",
                        mobileLabel: "Member",
                        render: (d) => (
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-semibold text-sm border border-slate-300 shadow-sm">
                                 {d.full_name?.[0] || '?'}
                              </div>
                              <div>
                                 <p className="text-sm font-semibold text-slate-900">{d.full_name}</p>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-xs font-medium text-slate-500">ID: #{d.id}</p>
                                    {d.family_head_name && (
                                       <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-[9px] font-black text-amber-600 border border-amber-100 uppercase tracking-tighter">
                                          Family Link
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>
                        )
                     },
                     {
                        header: "Contact Info",
                        key: "contact",
                        render: (d) => (
                           <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                 <Phone size={14} className="text-slate-400" /> {d.phone}
                              </p>
                              {d.email && (
                                 <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" /> {d.email}
                                 </p>
                              )}
                           </div>
                        )
                     },
                     {
                        header: "Birth Details",
                        key: "birth",
                        render: (d) => (
                           d.nakshatra_name ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
                                 <Moon size={12} />
                                 {d.nakshatra_name_ml || d.nakshatra_name}
                              </div>
                           ) : <span className="text-sm text-slate-300">—</span>
                        )
                     },
                     {
                        header: "ID Verification",
                        key: "verification",
                        render: (d) => (
                           d.id_proof_type ? (
                              <div className="flex items-center gap-2">
                                 <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">
                                    <IdCard size={14} />
                                 </div>
                                 <div>
                                    <p className="text-xs font-semibold text-slate-800 uppercase">{d.id_proof_type}</p>
                                    <p className="text-[11px] font-medium text-slate-500">{d.id_proof_number?.slice(-4).padStart(12, '•')}</p>
                                 </div>
                              </div>
                           ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                 Unverified
                              </span>
                           )
                        )
                     },
                     {
                        header: "Actions",
                        key: "actions",
                        align: "right",
                        render: (d) => (
                           <div className="flex justify-end items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              {checkPermission('devotees', 'edit') && (
                                 <button onClick={(e) => { e.stopPropagation(); actions.onEditClick(d); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center">
                                    <Edit size={16} />
                                 </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); actions.openHistory(d); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center">
                                 <FileText size={16} />
                              </button>
                              {checkPermission('devotees', 'delete') && (
                                 <button onClick={(e) => { e.stopPropagation(); actions.deleteDevotee(d.id); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center">
                                    <Trash2 size={16} />
                                 </button>
                              )}
                           </div>
                        )
                     }
                  ]}
                  data={state.devotees}
                  loading={state.loading}
               />
            )}

            <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
               <span className="text-xs font-medium text-slate-500">Temple Registry System</span>
               {state.tab === "devotees" && (
                  <Pagination
                     currentPage={state.page}
                     totalPages={state.totalPages}
                     onPageChange={actions.setPage}
                     count={state.count}
                     pageSize={10}
                  />
               )}
            </div>
         </div>

         {/* Registration Modal Overlay */}
         <AnimatePresence>
            {state.addOpen && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => actions.setAddOpen(false)} />
                  <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden">

                     {/* Modal Header */}
                     <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 border border-teal-100">
                              <Plus size={24} />
                           </div>
                           <div>
                              <h2 className="text-lg font-semibold text-slate-900">{state.editingId ? "Update Member" : "New Trust Member"}</h2>
                              <p className="text-sm text-slate-500 mt-0.5">Register a new member to the temple trust.</p>
                           </div>
                        </div>
                        <button onClick={() => actions.setAddOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 transition-colors">
                           <X size={20} />
                        </button>
                     </div>

                     {/* Modal Body */}
                     <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">

                        {/* Personal Info Grid */}
                        <div>
                           <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><Users size={16} className="text-teal-500" /> Personal Information</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <ModernInput 
                                 label="Full Name" 
                                 value={state.form.full_name} 
                                 error={state.formErrors.full_name}
                                 success={state.form.full_name.length > 2}
                                 onChange={e => actions.updateForm('full_name', e.target.value)} 
                                 placeholder="e.g. Ramesh Kumar" 
                                 icon={Users} 
                              />
                              <ModernInput 
                                 label="Phone Number" 
                                 value={state.form.phone} 
                                 error={state.formErrors.phone}
                                 success={state.form.phone.replace(/\D/g, '').length === 10}
                                 onChange={e => actions.updateForm('phone', e.target.value)} 
                                 placeholder="+91 XXXXX XXXXX" 
                                 icon={Phone} 
                              />
                              <ModernInput 
                                 label="Email Address" 
                                 value={state.form.email} 
                                 error={state.formErrors.email}
                                 success={state.form.email && !state.formErrors.email}
                                 onChange={e => actions.updateForm('email', e.target.value)} 
                                 placeholder="optional" 
                                 icon={Mail} 
                              />

                              <div className="space-y-2">
                                 <label className="text-xs font-semibold text-slate-700">Nakshatra</label>
                                 <div className="relative group">
                                    <Moon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <select
                                       value={state.form.nakshatra}
                                       onChange={e => actions.setForm({ ...state.form, nakshatra: e.target.value })}
                                       className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                                    >
                                       <option value="">Select Nakshatra...</option>
                                       {state.nakshatras.map(n => <option key={n.id} value={n.id}>{n.name_ml || n.name}</option>)}
                                    </select>
                                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-xs font-semibold text-slate-700">Family Head (Family Link)</label>
                                 <div className="relative group">
                                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <select
                                       value={state.form.family_head}
                                       onChange={e => actions.setForm({ ...state.form, family_head: e.target.value })}
                                       className="w-full h-10 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                                    >
                                       <option value="">This person is Head / Independent</option>
                                       {state.devotees.filter(d => d.id !== state.editingId).map(d => (
                                          <option key={d.id} value={d.id}>{d.full_name} ({d.phone})</option>
                                       ))}
                                    </select>
                                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* ID Verification Section */}
                        <div>
                           <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2"><ShieldCheck size={16} className="text-teal-500" /> Identity Verification</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                 <label className="text-xs font-semibold text-slate-700">Document Type</label>
                                 <select
                                    value={state.form.id_proof_type}
                                    onChange={(e) => actions.setForm({ ...state.form, id_proof_type: e.target.value })}
                                    className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
                                 >
                                    <option value="">Select Document</option>
                                    {ID_PROOF_CHOICES.map((c) => <option key={c.value} value={c.value}>{t(c.key, c.label)}</option>)}
                                 </select>
                              </div>
                              <ModernInput 
                                 label="Document Number" 
                                 value={state.form.id_proof_number} 
                                 error={state.formErrors.id_proof_number}
                                 success={state.form.id_proof_number && !state.formErrors.id_proof_number}
                                 onChange={e => actions.updateForm('id_proof_number', e.target.value)} 
                                 placeholder="e.g. ID Number / Aadhar" 
                                 icon={Fingerprint} 
                              />
                           </div>
                        </div>

                        {state.error && (
                           <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-3 border border-red-100 text-sm font-medium">
                              <AlertCircle size={18} className="shrink-0 mt-0.5" />
                              <p>{state.error}</p>
                           </div>
                        )}
                     </div>

                     {/* Modal Footer */}
                     <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end items-center gap-3">
                        <button onClick={() => actions.setAddOpen(false)} className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                        <button onClick={actions.saveDevotee} className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold text-sm shadow-md hover:bg-teal-500 active:scale-95 transition-all">
                           {state.editingId ? "Save Changes" : "Add to Trust"}
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Nakshatra Master Modal (Polished to match) */}
         <AnimatePresence>
            {state.masterOpen && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => actions.setMasterOpen(false)} />
                  <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-sm rounded-xl shadow-2xl relative z-10 overflow-hidden">
                     <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-base font-semibold text-slate-900">{state.editingId ? "Edit" : "Add"} Nakshatra</h3>
                        <button onClick={() => actions.setMasterOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
                     </div>

                     <div className="p-6 space-y-4">
                        <ModernInput
                           label="System Name (English)"
                           value={state.masterForm.name}
                           error={state.formErrors.name}
                           onChange={val => actions.setMasterForm({ ...state.masterForm, name: val })}
                           placeholder="e.g. Rohini"
                           icon={Globe}
                        />
                        <ModernInput
                           label="Malayalam Name"
                           value={state.masterForm.name_ml}
                           onChange={val => actions.setMasterForm({ ...state.masterForm, name_ml: val })}
                           placeholder="രോഹിണി"
                           icon={Sparkles}
                        />
                        {state.error && <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"><AlertCircle size={16} /> {state.error}</p>}
                     </div>

                     <div className="px-6 pb-6 flex flex-col gap-2">
                        <button
                           onClick={actions.saveMaster}
                           className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md"
                        >
                           {state.editingId ? "Save Changes" : "Create Nakshatra"}
                        </button>
                        <button onClick={() => actions.setMasterOpen(false)} className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Devotee Detail & Family History Modal */}
         <AnimatePresence>
            {state.historyOpen && (
               <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => actions.setHistoryOpen(false)} />
                  <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden border border-slate-100">
                     
                     <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                           <div className="flex items-center gap-6">
                              <div className="h-20 w-20 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center text-3xl font-black border border-teal-100 shadow-inner">
                                 {state.selected?.full_name?.[0] || '?'}
                              </div>
                              <div>
                                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">{state.selected?.full_name}</h2>
                                 <p className="text-slate-500 font-bold flex items-center gap-2 mt-1">
                                    <Phone size={14} className="text-teal-500" /> {state.selected?.phone}
                                 </p>
                              </div>
                           </div>
                           <button onClick={() => actions.setHistoryOpen(false)} className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors">
                              <X size={24} />
                           </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                           {/* Family Links Section */}
                           <div className="lg:col-span-1 space-y-8">
                              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Users size={14} className="text-teal-500" /> Family Links
                                 </h3>
                                 
                                 <div className="space-y-4">
                                    {state.historyLoading ? (
                                       <div className="animate-pulse space-y-3">
                                          <div className="h-12 bg-slate-200 rounded-2xl w-full" />
                                          <div className="h-12 bg-slate-200 rounded-2xl w-2/3" />
                                       </div>
                                    ) : state.history?.family_members?.length > 0 ? (
                                       state.history.family_members.map((member, idx) => (
                                          <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                             <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                                                {member.full_name[0]}
                                             </div>
                                             <div>
                                                <p className="text-sm font-bold text-slate-900">{member.full_name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{member.id === state.selected?.family_head ? 'Family Head' : 'Family Member'}</p>
                                             </div>
                                          </div>
                                       ))
                                    ) : (
                                       <div className="text-center py-6">
                                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No family members linked yet.</p>
                                       </div>
                                    )}
                                    <button onClick={() => { actions.setHistoryOpen(false); actions.onEditClick(state.selected); }} className="w-full h-12 mt-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-teal-500 hover:text-teal-600 text-xs font-bold transition-all flex items-center justify-center gap-2">
                                       <Plus size={14} /> Add Relation
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* History Section */}
                           <div className="lg:col-span-2 space-y-10">
                              <div>
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Zap size={14} className="text-orange-500" /> Recent Pooja Bookings
                                 </h3>
                                 <div className="space-y-3">
                                    {state.history?.bookings?.length > 0 ? (
                                       state.history.bookings.map((b, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 transition-colors">
                                             <div>
                                                <p className="text-sm font-bold text-slate-900">{b.pooja_name}</p>
                                                <p className="text-[11px] font-bold text-slate-400 mt-1">{new Date(b.booking_date).toLocaleDateString()}</p>
                                             </div>
                                             <div className="text-right">
                                                <p className="text-sm font-black text-slate-900">₹{b.amount}</p>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{b.status}</span>
                                             </div>
                                          </div>
                                       ))
                                    ) : <p className="text-xs font-bold text-slate-300 italic">No bookings found.</p>}
                                 </div>
                              </div>

                              <div>
                                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <BarChart3 size={14} className="text-blue-500" /> Donations & Hundi
                                 </h3>
                                 <div className="space-y-3">
                                    {state.history?.donations?.length > 0 ? (
                                       state.history.donations.map((d, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-colors">
                                             <div>
                                                <p className="text-sm font-bold text-slate-900">{d.purpose || 'General Donation'}</p>
                                                <p className="text-[11px] font-bold text-slate-400 mt-1">{new Date(d.donated_at).toLocaleDateString()}</p>
                                             </div>
                                             <div className="text-right">
                                                <p className="text-sm font-black text-slate-900">₹{d.amount}</p>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{d.payment_mode}</span>
                                             </div>
                                          </div>
                                       ))
                                    ) : <p className="text-xs font-bold text-slate-300 italic">No donations found.</p>}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}

// Sub-components updated for the new theme
function StatsCard({ label, value, icon: Icon, trend }) {
   return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-teal-500/30 transition-colors group">
         <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 group-hover:scale-105 transition-transform">
            <Icon size={20} />
         </div>
         <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
               <p className="text-2xl font-semibold text-slate-900 tracking-tight leading-none">{value}</p>
               {trend && <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">{trend}</span>}
            </div>
         </div>
      </div>
   );
}

function TabButton({ active, onClick, label }) {
   return (
      <button
         onClick={onClick}
         className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
      >
         {label}
      </button>
   );
}

function InputGroup({ label, value, onChange, placeholder, icon: Icon, type = "text" }) {
   return (
      <div className="space-y-2">
         <label className="text-xs font-semibold text-slate-700">
            {label}
         </label>
         <div className="relative group">
            {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />}
            <input
               type={type}
               value={value}
               onChange={e => onChange(e.target.value)}
               placeholder={placeholder}
               className={`w-full h-10 bg-white border border-slate-200 rounded-lg ${Icon ? 'pl-10' : 'pl-3'} pr-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-400`}
            />
         </div>
      </div>
   );
}