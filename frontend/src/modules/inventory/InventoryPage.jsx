import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
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
  Archive,
  AlertCircle
} from "lucide-react";
import Pagination from "../../components/common/Pagination";

export default function InventoryPage() {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
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
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false);
  const [txnForm, setTxnForm] = useState({ item: "", type: "in", qty: "", price: "", note: "" });
  const [activeTab, setActiveTab] = useState("items");
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({ in_val: 0, out_val: 0 });

  useEffect(() => {
    if (activeTab === "items") {
      fetchInventory();
    } else {
      fetchHistory();
    }
    fetchCategories();
    fetchReport();
  }, [page, searchTerm, categoryFilter, activeTab]);

  async function fetchReport() {
    try {
      const res = await api.get("/inventory/report/");
      setReport({
        in_val: res.data.stock_in_value || 0,
        out_val: res.data.stock_out_value || 0
      });
    } catch (e) { console.error(e); }
  }

  async function fetchHistory() {
    setLoading(true);
    try {
      const res = await api.get("/inventory/transactions/", {
        params: { page, page_size: pageSize }
      });
      setTransactions(res.data.results || []);
      setCount(res.data.count || 0);
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSaveTransaction(e) {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/inventory/transactions/", {
        item: txnForm.item,
        txn_type: txnForm.type,
        quantity: Number(txnForm.qty),
        unit_price: Number(txnForm.price || 0),
        note: txnForm.note
      });
      setIsTxnModalOpen(false);
      fetchInventory();
    } catch (err) {
       alert(err.response?.data?.quantity || "Failed to record transaction.");
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
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
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
              className="h-10 w-64 bg-white border border-slate-200 rounded-lg pl-11 pr-4 text-xs font-medium text-slate-900 outline-none focus:border-primary transition-all"
              placeholder="Search items..."
            />
          </div>
          {checkPermission('inventory', 'view') && (
            <button onClick={() => setIsCatModalOpen(true)} className="h-10 px-4 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-50 transition-all">
                <Layers size={14} /> Categories
            </button>
          )}
          {checkPermission('inventory', 'edit') && (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setTxnForm({ item: "", type: "in", qty: "", price: "", note: "" });
                  setIsTxnModalOpen(true);
                }} 
                className="h-10 px-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              >
                  <Plus size={16} /> Stock In
              </button>
              <button onClick={handleOpenAdd} className="h-10 px-5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-slate-800 active:scale-95 transition-all">
                <Archive size={16} /> Create Item
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="Total Items" value={count} icon={<Database size={18} />} color="slate" />
         <StatCard label="Low Stocks" value={criticalItemsCount} icon={<AlertTriangle size={18} />} color="emerald" trend={criticalItemsCount > 0 ? "Check Required" : "Stable"} />
         <StatCard label="Total Purchases" value={`₹ ${Number(report.in_val).toLocaleString()}`} icon={<Box size={18} />} color="blue" trend="Life-time" />
         <StatCard label="Total Consumption" value={`₹ ${Number(report.out_val).toLocaleString()}`} icon={<RefreshCw size={18} />} color="blue" trend="Materials Used" />
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100">
         <button onClick={() => { setActiveTab("items"); setPage(1); }} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'items' ? 'border-primary text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            Master Inventory
         </button>
         <button onClick={() => { setActiveTab("history"); setPage(1); }} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'history' ? 'border-primary text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            Stock Log & Prices
         </button>
      </div>

      {/* Filter Ribbon */}
      {activeTab === 'items' && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
           <button onClick={() => setCategoryFilter("all")} className={`px-5 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${categoryFilter === "all" ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}>All Items</button>
           {categories.map(cat => (
              <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} className={`px-5 h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm whitespace-nowrap ${categoryFilter === cat.id ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}>{cat.name}</button>
           ))}
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="py-24 text-center text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">
            Loading inventory records...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto text-[13px]">
            {activeTab === 'items' ? (
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
                              {item.category_name || "Uncategorized"}
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
                              {checkPermission('inventory', 'edit') && (
                                  <button onClick={() => handleOpenEdit(item)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                      <Edit size={14} />
                                  </button>
                              )}
                              {checkPermission('inventory', 'delete') && (
                                  <button onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                      <Trash2 size={14} />
                                  </button>
                              )}
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date & Ref</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Item</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Qty & Type</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Unit Price</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.length === 0 ? (
                    <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">No transaction history found</td></tr>
                  ) : transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-none">{new Date(txn.created_at).toLocaleDateString()}</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase">ID: TXN-{txn.id}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-none">{txn.item_name}</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase">{txn.item_category}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <div className="flex flex-col items-center gap-1">
                            <span className={`text-base font-bold ${txn.txn_type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                               {txn.txn_type === 'in' ? '+' : '-'}{txn.quantity}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{txn.txn_type === 'in' ? 'Stock In' : 'Usage'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                         <span className="text-xs font-semibold text-slate-600">
                            {txn.unit_price > 0 ? `₹ ${txn.unit_price}` : '-'}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <span className="text-sm font-bold text-slate-900">
                            {txn.unit_price > 0 ? `₹ ${(txn.quantity * txn.unit_price).toLocaleString()}` : '-'}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

      {/* Stock Transaction Modal */}
      <AnimatePresence>
        {isTxnModalOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !submitting && setIsTxnModalOpen(false)} />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-lg flex flex-col overflow-hidden border border-slate-100">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                   <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                         <ShieldCheck size={14} /> Audit Trail Verified
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Record Stock Movement</h2>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Log purchases or material usage</p>
                   </div>
                   <button onClick={() => setIsTxnModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white text-slate-400 border border-transparent hover:border-slate-200 transition-all shadow-sm">
                      <X size={20} />
                   </button>
                </div>

                <form onSubmit={handleSaveTransaction} className="p-10 space-y-8 bg-white">
                   <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                      <button type="button" onClick={() => setTxnForm({...txnForm, type: 'in'})} className={`h-11 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${txnForm.type === 'in' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Stock In (Purchase)</button>
                      <button type="button" onClick={() => setTxnForm({...txnForm, type: 'out'})} className={`h-11 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${txnForm.type === 'out' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Stock Out (Usage)</button>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Inventory Item</label>
                        <select required value={txnForm.item} onChange={e => setTxnForm({...txnForm, item: e.target.value})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none cursor-pointer">
                           <option value="">Select Item...</option>
                           {items.map(it => <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <InputGroup type="number" label="Quantity" value={txnForm.qty} onChange={val => setTxnForm({...txnForm, qty: val})} placeholder="0.00" icon={Database} />
                         {txnForm.type === 'in' && (
                            <InputGroup type="number" label="Unit Price (Cost)" value={txnForm.price} onChange={val => setTxnForm({...txnForm, price: val})} placeholder="₹ 0.00" icon={Archive} />
                         )}
                      </div>

                      {txnForm.type === 'in' && txnForm.qty && txnForm.price && (
                        <div className="p-6 bg-slate-900 rounded-2xl text-white flex justify-between items-center shadow-xl shadow-slate-900/10 transition-all animate-in slide-in-from-bottom-2">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Estimated Spend</span>
                           <div className="text-right">
                              <div className="text-2xl font-bold tracking-tight">₹ {Number(txnForm.qty * txnForm.price).toLocaleString()}</div>
                              <div className="text-[10px] font-medium text-white/30 uppercase tracking-widest mt-0.5">Auto-calculated bill</div>
                           </div>
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Reference / Note</label>
                        <input value={txnForm.note} onChange={e => setTxnForm({...txnForm, note: e.target.value})} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all text-sm" placeholder="e.g. Monthly refill / Store usage" />
                      </div>
                   </div>

                   <button type="submit" disabled={submitting} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                      {submitting ? <RefreshCw className="animate-spin" size={20} /> : (txnForm.type === 'in' ? 'Record Purchase' : 'Record Usage')}
                   </button>
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-primary/20 transition-all group">
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
