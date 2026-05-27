import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
import { useNotify, useConfirm } from "../../context/NotificationContext";
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
import ModernInput from "../../components/ui/ModernInput";
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import { ValidationUtils } from "../../shared/utils/ValidationUtils";

export default function InventoryPage() {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize) || 1;

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
  const [txnForm, setTxnForm] = useState({ item: "", type: "in", qty: "", price: "", note: "", payment_mode: "cash", bank_account: null });
  const [errors, setErrors] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
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
    fetchBankAccounts();
  }, [page, searchTerm, categoryFilter, activeTab]);

  async function fetchBankAccounts() {
    try {
      const res = await api.get('/finance/bank-accounts/');
      setBankAccounts(res.data.results || res.data || []);
    } catch (e) { console.error(e); }
  }

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

  const updateForm = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const updateTxnForm = (key, val) => {
    let err = null;
    if (key === 'qty') err = parseFloat(val) <= 0 ? "Quantity must be positive" : null;
    if (key === 'price') err = ValidationUtils.validators.amount(val);
    if (key === 'bank_account') err = ValidationUtils.validators.bankAccount(txnForm.payment_mode, val);

    setTxnForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: err }));
  };

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
      notify.success(editingItem ? "Item updated" : "Item created");
    } catch (err) {
      const data = err.response?.data;
      setErrorMsg(typeof data === 'object' ? Object.values(data)[0] : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveTransaction(e) {
    if (e) e.preventDefault();
    const qtyErr = parseFloat(txnForm.qty) <= 0 ? "Quantity must be positive" : null;
    const priceErr = txnForm.type === 'in' ? ValidationUtils.validators.amount(txnForm.price) : null;
    const bankErr = ValidationUtils.validators.bankAccount(txnForm.payment_mode, txnForm.bank_account);

    if (qtyErr || priceErr || bankErr) {
        setErrors({ qty: qtyErr, price: priceErr, bank_account: bankErr });
        return notify.warn("Please fix highlighted errors.");
    }

    setSubmitting(true);
    try {
      await api.post("/inventory/transactions/", {
        item: txnForm.item,
        txn_type: txnForm.type,
        quantity: Number(txnForm.qty),
        unit_price: Number(txnForm.price || 0),
        note: txnForm.note,
        payment_mode: txnForm.payment_mode,
        bank_account: txnForm.bank_account
      });
      setIsTxnModalOpen(false);
      setErrors({});
      fetchInventory();
      notify.success('Stock movement recorded successfully');
    } catch (err) {
       notify.error(err.response?.data?.quantity || "Failed to record transaction.");
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
      notify.success('Category added successfully');
    } catch (err) {
      notify.error("Failed to add category.");
    }
  }

  async function handleDelete(id) {
    confirm({
      title: 'Archive Inventory Item',
      message: 'Are you sure you want to archive this item?',
      confirmText: 'Archive Item',
      onConfirm: async () => {
        try {
          await api.delete(`/inventory/items/${id}/`);
          notify.success('Item archived successfully');
          fetchInventory();
        } catch (e) {
          notify.error("Delete failed.");
        }
      }
    });
  }

  const criticalItemsCount = useMemo(() => {
    return items.filter(it => Number(it.current_stock) <= Number(it.reorder_level)).length;
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Box size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Hub</h1>
               <p className="text-xs font-medium text-slate-500 mt-0.5">Maintain temple stocks and supplies</p>
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
          {checkPermission('inventory', 'edit') && (
            <div className="flex gap-2">
              <button onClick={() => setIsCatModalOpen(true)} className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase flex items-center gap-2 hover:bg-slate-50 transition-all">
                <Layers size={14} /> Categories
              </button>
              <button 
                onClick={() => {
                  setTxnForm({ item: "", type: "in", qty: "", price: "", note: "", payment_mode: "cash", bank_account: null });
                  setIsTxnModalOpen(true);
                }} 
                className="h-10 px-4 bg-emerald-600 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-2 shadow-md hover:bg-emerald-700 transition-all"
              >
                  <Plus size={16} /> Stock In
              </button>
              <button onClick={() => { setEditingItem(null); setForm({ name: "", category: "", current_stock: "0", reorder_level: "5", unit: "pcs", location: "Main Store", description: "" }); setIsModalOpen(true); }} className="h-10 px-5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase flex items-center gap-2 shadow-md hover:bg-slate-800 transition-all">
                <Archive size={16} /> Create Item
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="Total Items" value={count} icon={<Database size={18} />} color="slate" />
         <StatCard label="Low Stocks" value={criticalItemsCount} icon={<AlertTriangle size={18} />} color="emerald" trend={criticalItemsCount > 0 ? "Action Required" : "Stable"} />
         <StatCard label="Purchase Val" value={`₹${Number(report.in_val).toLocaleString()}`} icon={<Box size={18} />} color="slate" />
         <StatCard label="Usage Val" value={`₹${Number(report.out_val).toLocaleString()}`} icon={<RefreshCw size={18} />} color="slate" />
      </div>

      <div className="flex border-b border-slate-100">
         <button onClick={() => setActiveTab("items")} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'items' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>Inventory</button>
         <button onClick={() => setActiveTab("history")} className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'history' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>Transactions</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'items' ? (
            <ResponsiveTable
              columns={[
                {
                  header: "Item",
                  key: "name",
                  mobileLabel: "Item Details",
                  render: (item) => (
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[9px] font-bold text-slate-300 uppercase mt-1">#INV-{item.id}</div>
                    </div>
                  )
                },
                {
                  header: "Category",
                  key: "category",
                  render: (item) => <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded-md uppercase">{item.category_name || "Misc"}</span>
                },
                {
                  header: "Stock",
                  key: "stock",
                  align: "center",
                  render: (item) => (
                    <span className={`text-sm font-bold ${Number(item.current_stock) <= Number(item.reorder_level) ? 'text-rose-500' : 'text-slate-900'}`}>
                      {item.current_stock} <span className="text-[10px] text-slate-400">{item.unit}</span>
                    </span>
                  )
                },
                {
                  header: "Location",
                  key: "location",
                  render: (item) => <span className="text-xs font-bold text-slate-500">{item.location}</span>
                },
                {
                  header: "Actions",
                  key: "actions",
                  align: "right",
                  render: (item) => (
                    <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditingItem(item); setForm({ ...item, category: item.category?.id || item.category }); setIsModalOpen(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Edit size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  )
                }
              ]}
              data={items}
              loading={loading}
              emptyMessage="No items found."
            />
          ) : (
            <ResponsiveTable
              columns={[
                {
                  header: "Date",
                  key: "date",
                  render: (txn) => <span className="text-xs font-bold text-slate-900">{new Date(txn.created_at).toLocaleDateString()}</span>
                },
                {
                  header: "Item",
                  key: "item",
                  mobileLabel: "Item & Stock",
                  render: (txn) => <span className="font-bold text-slate-900">{txn.item_name}</span>
                },
                {
                  header: "Quantity",
                  key: "quantity",
                  align: "center",
                  render: (txn) => (
                    <span className={`font-bold ${txn.txn_type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {txn.txn_type === 'in' ? '+' : '-'}{txn.quantity}
                    </span>
                  )
                },
                {
                  header: "Value",
                  key: "value",
                  align: "right",
                  render: (txn) => <span className="font-bold text-slate-900">₹{(txn.quantity * txn.unit_price).toLocaleString()}</span>
                }
              ]}
              data={transactions}
              loading={loading}
              emptyMessage="No transactions found."
            />
          )}
        </div>
        <div className="p-8 border-t border-slate-50">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} count={count} pageSize={pageSize} />
        </div>
      </div>

      {/* Main Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">{editingItem ? 'Update Item' : 'New Inventory Item'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X size={20} /></button>
               </div>
               <form onSubmit={handleSubmit} className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <ModernInput label="Name" value={form.name} onChange={e => updateForm('name', e.target.value)} icon={Package} />
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select value={form.category} onChange={e => updateForm('category', e.target.value)} className="w-full h-13 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 shadow-inner appearance-none cursor-pointer text-xs">
                           <option value="">Select Category</option>
                           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <ModernInput type="number" label="Stock" value={form.current_stock} onChange={e => updateForm('current_stock', e.target.value)} icon={Database} />
                    <ModernInput type="number" label="Alert" value={form.reorder_level} onChange={e => updateForm('reorder_level', e.target.value)} icon={AlertTriangle} />
                    <ModernInput label="Unit" value={form.unit} onChange={e => updateForm('unit', e.target.value)} icon={Info} />
                  </div>
                  <ModernInput label="Location" value={form.location} onChange={e => updateForm('location', e.target.value)} icon={MapPin} />
                  <button type="submit" className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 transition-all">
                    {editingItem ? "Finalize Updates" : "Initialize Item"}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Modal */}
      <AnimatePresence>
        {isTxnModalOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsTxnModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Stock Movement</h2>
                  <button onClick={() => setIsTxnModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X size={20} /></button>
               </div>
               <form onSubmit={handleSaveTransaction} className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                      <button type="button" onClick={() => setTxnForm({...txnForm, type: 'in'})} className={`h-11 rounded-xl text-[10px] font-bold uppercase transition-all ${txnForm.type === 'in' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}>Stock In</button>
                      <button type="button" onClick={() => setTxnForm({...txnForm, type: 'out'})} className={`h-11 rounded-xl text-[10px] font-bold uppercase transition-all ${txnForm.type === 'out' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'}`}>Stock Out</button>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Item</label>
                        <select required value={txnForm.item} onChange={e => updateTxnForm('item', e.target.value)} className="w-full h-13 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 shadow-inner appearance-none cursor-pointer text-xs">
                           <option value="">Select...</option>
                           {items.map(it => <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <ModernInput label="Quantity" type="number" value={txnForm.qty} error={errors.qty} onChange={e => updateTxnForm('qty', e.target.value)} icon={Database} />
                        {txnForm.type === 'in' && <ModernInput label="Unit Price" type="number" value={txnForm.price} error={errors.price} onChange={e => updateTxnForm('price', e.target.value)} icon={Archive} />}
                    </div>
                    <ModernInput label="Note" value={txnForm.note} onChange={e => updateTxnForm('note', e.target.value)} />
                  </div>
                  <button type="submit" className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 transition-all">Record Transaction</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal Mini */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-8 space-y-6">
               <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tighter">Add Category</h2>
               <ModernInput label="Category Name" value={catForm.name} onChange={val => setCatForm({ name: val })} />
               <div className="flex gap-4">
                  <button onClick={() => setIsCatModalOpen(false)} className="flex-1 h-12 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">Cancel</button>
                  <button onClick={handleSaveCategory} className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">Save</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color }) {
    const colors = {
        slate: 'bg-slate-100 text-slate-400',
        emerald: 'bg-emerald-50 text-emerald-500',
    };
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${colors[color] || 'bg-slate-100'}`}>{icon}</div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
                    {trend && <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">{trend}</span>}
                </div>
            </div>
        </div>
    );
}
