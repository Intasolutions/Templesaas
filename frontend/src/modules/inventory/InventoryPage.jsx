import React, { useState, useEffect, useMemo } from "react";
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
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit,
  Info,
  Building2,
  Archive
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
    location: "Main Store",
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
      location: "Main Store",
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
      location: item.location || "Main Store",
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
      setErrorMsg(typeof data === 'object' ? Object.values(data)[0] : "Request failed");
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
    if (!window.confirm("Archive this item from inventory?")) return;
    try {
      await api.delete(`/inventory/items/${id}/`);
      fetchInventory();
    } catch (e) {
      alert("Delete failed.");
    }
  }

  const criticalItemsCount = useMemo(() => {
    return items.filter(it => Number(it.current_stock) <= Number(it.reorder_level)).length;
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                <Box size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
               <p className="text-xs font-medium text-slate-500 mt-0.5">
                   Maintain records of temple stocks, supplies, and ritual materials
               </p>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-64 bg-white border border-slate-200 rounded-lg pl-11 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-[#B8860B] transition-all"
              placeholder="Search items..."
            />
          </div>
          <button onClick={() => setIsCatModalOpen(true)} className="h-10 px-4 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Layers size={14} /> Categories
          </button>
          <button onClick={handleOpenAdd} className="h-10 px-5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-slate-800 active:scale-95 transition-all">
            <Plus size={18} /> Add New Item
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <StatCard label="Total Stock Items" value={count} icon={<Database size={18} />} color="slate" />
         <StatCard label="Low Stock Alerts" value={criticalItemsCount} icon={<AlertTriangle size={18} />} color="emerald" trend={criticalItemsCount > 0 ? "Requires Attention" : "All Stable"} />
         <StatCard label="Item Categories" value={categories.length} icon={<Layers size={18} />} color="blue" />
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
         <button onClick={() => setCategoryFilter("all")} className={`px-5 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${categoryFilter === "all" ? 'bg-[#B8860B] text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}>All Items</button>
         {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={`px-5 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm whitespace-nowrap ${categoryFilter === cat.id ? 'bg-[#B8860B] text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}>{cat.name}</button>
         ))}
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="py-24 text-center text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">
            Loading inventory records...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto text-[13px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Item Name</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Remaining Stock</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Storage Location</th>
                  <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.length === 0 ? (
                  <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No items found</td></tr>
                ) : items.map(item => {
                  const isLow = Number(item.current_stock) <= Number(item.reorder_level);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-900 truncate max-w-[200px]">{item.name}</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-0.5">Ref: #INV-{item.id}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="px-2.5 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-full border border-slate-100 uppercase tracking-tight">
                            {item.category?.name || "Uncategorized"}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <div className="flex flex-col items-center gap-1">
                            <div className="flex items-baseline gap-1.5">
                               <span className={`text-lg font-bold tracking-tight ${isLow ? 'text-red-500' : 'text-slate-900'}`}>{item.current_stock}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                            </div>
                            {isLow && (
                               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-500 rounded-full border border-red-100 animate-pulse">
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
                                </div>
                            )}
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                               <MapPin size={14} />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">{item.location || "Main Store"}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-1">
                            <button onClick={() => handleOpenEdit(item)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <Edit size={14} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-slate-50 bg-slate-50/20">
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

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="bg-white rounded-2xl shadow-2xl relative z-10 w-full max-w-2xl flex flex-col overflow-hidden border border-slate-100">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                     <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <Box size={20} />
                     </div>
                     <div>
                        <h2 className="text-base font-bold text-slate-900">{editingItem ? 'Edit Inventory Item' : 'New Inventory Record'}</h2>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">Fill in the item details and stock levels</p>
                     </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                     <X size={20} />
                  </button>
               </div>

               <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white">
                  <form id="inv-form" onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Item Name" value={form.name} onChange={val => setForm({...form, name: val})} placeholder="e.g. Ghee / Coconut" icon={Package} />
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Category</label>
                            <div className="relative">
                                <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none cursor-pointer">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup type="number" label="Current Stock" value={form.current_stock} onChange={val => setForm({...form, current_stock: val})} placeholder="0" icon={Database} />
                        <InputGroup type="number" label="Low Stock Alert Level" value={form.reorder_level} onChange={val => setForm({...form, reorder_level: val})} placeholder="5" icon={AlertTriangle} />
                        <InputGroup label="Unit of Measure" value={form.unit} onChange={val => setForm({...form, unit: val})} placeholder="kg / pcs / ltr" icon={Info} />
                     </div>

                     <InputGroup label="Storage Location" value={form.location} onChange={val => setForm({...form, location: val})} placeholder="e.g. Main Kitchen / Store Room" icon={MapPin} />

                     <div className="space-y-2.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Notes / Description</label>
                        <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all resize-none text-sm" placeholder="Additional details or handling instructions..." />
                     </div>

                     {errorMsg && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 border border-red-100 text-xs font-bold">
                           <AlertCircle size={18} /> {errorMsg}
                        </div>
                     )}
                  </form>
               </div>

               <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                  <button form="inv-form" disabled={submitting} className="px-8 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                     {submitting ? <RefreshCw className="animate-spin" size={16} /> : (editingItem ? 'Update Item' : 'Add Item')}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-sm flex flex-col overflow-hidden border border-slate-100">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Manage Categories</h2>
                  <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
               </div>
               <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
                  <InputGroup label="New Category Name" value={catForm.name} onChange={val => setCatForm({ name: val })} placeholder="e.g. Pooja Items" icon={Layers} />
                  <button type="submit" className="w-full h-11 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all">Add Category</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color }) {
    const colors = {
        slate: 'bg-slate-50 text-slate-400',
        emerald: 'bg-emerald-50 text-emerald-500',
        blue: 'bg-blue-50 text-blue-500'
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-[#B8860B]/20 transition-all group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${colors[color] || 'bg-slate-50'}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
                   {trend && <span className="text-[9px] font-bold text-emerald-600">{trend}</span>}
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, placeholder, icon: Icon, type="text" }) {
    return (
        <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                {label}
            </label>
            <div className="relative group">
                {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />}
                <input 
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-11 bg-slate-50 border border-slate-200 rounded-xl ${Icon ? 'pl-11' : 'pl-4'} pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all`}
                />
            </div>
        </div>
    );
}
