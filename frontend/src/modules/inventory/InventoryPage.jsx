import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  Box, 
  Zap, 
  Layers, 
  Database, 
  X, 
  RefreshCw, 
  MapPin,
  ArrowRight,
  ChevronRight,
  History,
  ShieldCheck
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

export default function InventoryPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination State
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize) || 1;

  // Form / Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    current_stock: "0",
    reorder_level: "5",
    unit: "pcs",
    location: "Main Depot",
    description: "",
  });
  const [catForm, setCatForm] = useState({ name: "" });

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, [page, searchTerm, categoryFilter]);

  async function fetchCategories() {
    try {
      const res = await api.get("/inventory/categories/");
      setCategories(res.data.results || res.data || []);
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  }

  async function fetchInventory() {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const res = await api.get("/inventory/items/", { params });
      const data = res.data;
      if (data.results) {
        setItems(data.results);
        setCount(data.count);
      } else {
        setItems(Array.isArray(data) ? data : []);
        setCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (e) {
      console.error("Failed to fetch inventory", e);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setForm({
      name: "",
      category: categories[0]?.id || "",
      current_stock: "0",
      reorder_level: "5",
      unit: "pcs",
      location: "Main Depot",
      description: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(item) {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category?.id || item.category || "",
      current_stock: item.current_stock,
      reorder_level: item.reorder_level,
      unit: item.unit,
      location: item.location || "Main Depot",
      description: item.description || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      const payload = {
        ...form,
        category: form.category || null,
        current_stock: Number(form.current_stock),
        reorder_level: Number(form.reorder_level)
      };
      if (editingItem) {
        await api.patch(`/inventory/items/${editingItem.id}/`, payload);
      } else {
        await api.post("/inventory/items/", payload);
      }
      setIsModalOpen(false);
      fetchInventory();
    } catch (err) {
      const data = err.response?.data;
      setErrorMsg(typeof data === 'object' ? Object.values(data)[0] : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveCategory(e) {
    if (e) e.preventDefault();
    try {
      await api.post("/inventory/categories/", catForm);
      setIsCatModalOpen(false);
      setCatForm({ name: "" });
      fetchCategories();
    } catch (err) {
      alert("Failed to add category.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Archive this asset from registry?")) return;
    try {
      await api.delete(`/inventory/items/${id}/`);
      fetchInventory();
    } catch (e) {
      alert("Deactivation failed.");
    }
  }

  const criticalItemsCount = useMemo(() => {
    return items.filter(it => Number(it.current_stock) <= Number(it.reorder_level)).length;
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                <Box size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Supply Chain</h1>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                   <ShieldCheck size={10} className="text-primary" /> Core Resource Registry
                </p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={14} />
            <input 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 w-64 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner"
              placeholder="Query Database..."
            />
          </div>
          <button onClick={() => setIsCatModalOpen(true)} className="h-11 px-5 bg-white border border-slate-100 text-slate-900 rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Layers size={16} className="text-slate-400" /> Domain
          </button>
          <button onClick={handleOpenAdd} className="h-11 px-6 bg-slate-900 text-white rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2.5 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 active:scale-95 transition-all">
            <Plus size={18} /> Catalog Asset
          </button>
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
         <StatCard label="Live Inventory Node" value={count} subtext="Cataloged Assets" icon={<Database size={20} />} />
         <StatCard label="Critical Depletion" value={criticalItemsCount} subtext="Below Threshold" icon={<AlertTriangle size={20} />} color="text-red-500" />
         <StatCard label="Category Clusters" value={categories.length} subtext="Logical Groups" icon={<Layers size={20} />} />
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center gap-4 px-4 md:px-0">
         <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
            <button onClick={() => setCategoryFilter("all")} className={`px-6 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${categoryFilter === "all" ? 'bg-white text-slate-900 shadow-md border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}>Omnibus</button>
            {categories.slice(0, 4).map(cat => (
               <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={`px-6 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${categoryFilter === cat.id ? 'bg-white text-slate-900 shadow-md border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}>{cat.name}</button>
            ))}
         </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-8">
          <div className="w-16 h-16 border-[6px] border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Synchronizing Supply Ledger...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">classification</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Quantifiable State</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Spatial Node</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map(item => {
                  const isLow = Number(item.current_stock) <= Number(item.reorder_level);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-10 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors leading-none">{item.name}</span>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1.5 opacity-60 leading-none">ID: #INV-{item.id.toString().padStart(4, '0')}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="px-3 py-1 bg-slate-100 text-[8px] font-black text-slate-500 rounded-lg uppercase tracking-widest inline-block border border-slate-200/50">
                            {item.category?.name || "Unclassified"}
                         </span>
                      </td>
                      <td className="px-10 py-5 text-center">
                         <div className="flex flex-col items-center gap-1">
                            <div className="flex items-baseline gap-2">
                               <span className={`text-xl font-black tracking-tighter ${isLow ? 'text-red-500' : 'text-slate-900'}`}>{item.current_stock}</span>
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.unit}</span>
                            </div>
                            {isLow && (
                               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-lg border border-red-100/50">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                  <span className="text-[8px] font-black uppercase tracking-widest">Depleted State</span>
                               </motion.div>
                            )}
                         </div>
                      </td>
                      <td className="px-10 py-5">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                               <MapPin size={14} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-none">{item.location || "Central Depot"}</span>
                               <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Base coordinate</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-5 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                            <button onClick={() => handleOpenEdit(item)} className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 active:scale-90 transition-all"><Zap size={14} /></button>
                            <button onClick={() => handleDelete(item.id)} className="h-9 w-9 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 rounded-xl flex items-center justify-center active:scale-90 transition-all"><X size={16} /></button>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-slate-50 bg-slate-50/30">
             <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
                count={count} 
                pageSize={pageSize} 
             />
          </div>
        </div>
      )}

      {/* Asset Recalibration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !submitting && setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-2xl flex flex-col overflow-hidden border border-slate-100">
               <div className="p-10 border-b border-slate-50 bg-white flex justify-between items-center">
                  <div>
                     <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-100 mb-3">
                        <History size={10} /> Administrative Override
                     </div>
                     <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-4 leading-none">
                        {editingItem ? 'Asset Recalibration' : 'Supply Acquisition'}
                     </h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 border border-transparent hover:border-slate-100 transition-all active:scale-90">
                     <X size={20} />
                  </button>
               </div>

               <div className="p-10 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white">
                  <form id="inv-form" onSubmit={handleSubmit} className="space-y-10">
                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Asset Designation</label>
                           <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner placeholder:text-slate-300" placeholder="e.g. Ghee / Oil / Cloth" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Domain Classification</label>
                           <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner appearance-none cursor-pointer">
                              <option value="">Select Domain</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-10">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Current Balance</label>
                           <div className="relative">
                              <input type="number" required value={form.current_stock} onChange={e => setForm({...form, current_stock: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 text-xl outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" />
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">{form.unit}</div>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Safety Threshold</label>
                           <input type="number" required value={form.reorder_level} onChange={e => setForm({...form, reorder_level: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Measurement Unit</label>
                           <input required value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" placeholder="kg / pcs / ltr" />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Spatial Node (Storage Zone)</label>
                        <div className="relative">
                           <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                           <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl pl-16 pr-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" placeholder="Main Godown / Ritual Hall / Kitchen" />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Asset Technical Specifications</label>
                        <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner resize-none leading-relaxed text-xs" placeholder="Detailed remarks or handling instructions..." />
                     </div>

                     {errorMsg && (
                        <div className="p-6 bg-red-50 text-red-500 rounded-2xl flex items-center gap-4 border border-red-100/50">
                           <AlertTriangle size={24} />
                           <span className="text-[11px] font-black uppercase tracking-[0.1em]">{errorMsg}</span>
                        </div>
                     )}
                  </form>
               </div>

               <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Abort Cycle</button>
                  <button form="inv-form" disabled={submitting} className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all group active:scale-95">
                     {submitting ? <RefreshCw className="animate-spin text-primary" size={18} /> : (editingItem ? 'Update Registry' : 'Commit to Database')}
                     {!submitting && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Domain Creation Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[3rem] shadow-2xl relative z-10 w-full max-w-sm flex flex-col overflow-hidden border border-slate-50">
               <div className="p-10 border-b border-slate-50 bg-white flex justify-between items-center">
                  <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">New Domain</h2>
                  <button onClick={() => setIsCatModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
               </div>
               <form onSubmit={handleSaveCategory} className="p-10 space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Domain Name</label>
                     <input autoFocus required value={catForm.name} onChange={e => setCatForm({ name: e.target.value })} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner" placeholder="e.g. Textiles" />
                  </div>
                  <button type="submit" className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">Establish Domain</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, subtext, icon, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-125 group-hover:opacity-[0.05] transition-all duration-700 text-slate-900">
         {icon && <div className="scale-[3]">{icon}</div>}
      </div>
      <div className="flex items-center gap-2.5 mb-5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
         <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
            {icon ? React.cloneElement(icon, { size: 14 }) : null}
         </div>
         {label}
      </div>
      <div className={`text-2xl font-black tracking-tighter mb-1 leading-none ${color}`}>{value}</div>
      <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 opacity-60">
         {subtext} <ArrowRight size={8} className="text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
