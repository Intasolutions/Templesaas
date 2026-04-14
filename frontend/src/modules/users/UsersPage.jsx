import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Edit,
  Trash2,
  Check,
  X,
  Settings,
  Mail,
  Phone,
  UserCog,
  Fingerprint,
  Search,
  Shield,
  ArrowUpRight,
  MoreVertical,
  ChevronRight,
  Database,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../shared/api/client';
import Pagination from '../../components/common/Pagination';

const APP_MODULES = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'tv', name: 'TV Display' },
  { id: 'users', name: 'User Management' },
  { id: 'devotees', name: 'Devotees' },
  { id: 'pooja', name: 'Pooja Services' },
  { id: 'bookings', name: 'Bookings' },
  { id: 'events', name: 'Events' },
  { id: 'hundi', name: 'Hundi' },
  { id: 'inventory', name: 'Inventory' },
  { id: 'donations', name: 'Donations' },
  { id: 'finance', name: 'Financial Reports' },
];

const ROLES = [
  { id: 'temple_admin', name: 'Temple Admin', color: 'bg-slate-900 border-slate-900 text-white' },
  { id: 'accountant', name: 'Accountant', color: 'bg-blue-50 border-blue-100 text-blue-600' },
  { id: 'priest', name: 'Priest', color: 'bg-orange-50 border-orange-100 text-orange-600' },
  { id: 'counter_staff', name: 'Counter Staff', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
  { id: 'volunteer', name: 'Volunteer', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
  { id: 'devotee', name: 'Devotee', color: 'bg-slate-50 border-slate-100 text-slate-400' },
];

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 10;

  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    new_username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'counter_staff',
    phone: '',
    module_permissions: {}
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/management/', { params: { page } });
      const data = res.data;
      
      if (data.results) {
          setUsers(data.results);
          setCount(data.count);
      } else {
          setUsers(Array.isArray(data) ? data : []);
          setCount(Array.isArray(data) ? data.length : 0);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const resetForm = () => {
    setEditingUserId(null);
    setFormData({
      new_username: '',
      password: '',
      first_name: '',
      last_name: '',
      email: '',
      role: 'counter_staff',
      phone: '',
      module_permissions: {}
    });
    setIsFormOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({
      new_username: user.username || '',
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      role: user.role || 'counter_staff',
      phone: user.phone || '',
      module_permissions: user.module_permissions || {}
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingUserId && !payload.password) delete payload.password;

      if (editingUserId) {
        await api.put(`/users/management/${editingUserId}/`, payload);
      } else {
        await api.post('/users/management/', payload);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Form Submit Error:", error);
    }
  };

  const handleTogglePermission = (moduleId, permType) => {
    setFormData(prev => {
      const currentPerms = prev.module_permissions[moduleId] || [];
      const newPerms = currentPerms.includes(permType) 
        ? currentPerms.filter(p => p !== permType) 
        : [...currentPerms, permType];

      return {
        ...prev,
        module_permissions: { ...prev.module_permissions, [moduleId]: newPerms }
      };
    });
  };

  const filteredUsers = Array.isArray(users) ? users.filter(u =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getRoleConfig = (roleId) => ROLES.find(r => r.id === roleId) || ROLES[ROLES.length - 1];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Prime Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                    <ShieldCheck size={24} />
                </div>
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security Matrix</h1>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                       <Database size={10} className="text-primary" /> Authority Node Management
                   </p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="h-11 px-6 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 flex items-center gap-2.5 active:scale-95"
            >
              <UserPlus size={18} /> Register Authority
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
               <div className="space-y-2">
                  <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <UserCog size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">
                      {editingUserId ? "Modify Clearance" : "New Authorization"}
                    </h2>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1.5 flex items-center gap-2">
                      <Fingerprint size={10} className="text-primary" /> Identity Vector Definition
                    </p>
                  </div>
               </div>
               <button onClick={resetForm} className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-300 hover:text-slate-900 transition-all shadow-sm">
                 <X size={18} />
               </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputGroup label="System Identifier" value={formData.new_username} onChange={val => setFormData({...formData, new_username: val})} placeholder="e.g. mahadev_admin" icon={Search} symbol="@" />
                <InputGroup label="Access Token" type="password" value={formData.password} onChange={val => setFormData({...formData, password: val})} placeholder="••••••••" icon={Fingerprint} desc={editingUserId ? "Leave empty to preserve..." : "Required for handshake"} />
                <div className="space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Protocol Role</label>
                    <div className="relative">
                      <select 
                        value={formData.role} 
                        onChange={e => setFormData({ ...formData, role: e.target.value })} 
                        className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-5 pr-6 font-bold text-[11px] text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none cursor-pointer shadow-inner"
                      >
                        {ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3">
                    <Shield size={12} className="text-slate-900" /> Modular Security Restrictions
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {APP_MODULES.map(mod => (
                        <div key={mod.id} className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-300 transition-all group overflow-hidden relative">
                           <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-125 transition-transform"><Layers size={60} /></div>
                           <p className="text-[11px] font-black text-slate-900 mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{mod.name}</p>
                           <div className="flex gap-1.5 relative z-10">
                              {['view', 'edit', 'delete'].map(perm => {
                                 const active = (formData.module_permissions[mod.id] || []).includes(perm);
                                 return (
                                     <button
                                         type="button"
                                         key={perm}
                                         onClick={() => handleTogglePermission(mod.id, perm)}
                                         className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                             active ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-300 hover:border-slate-300'
                                         }`}
                                     >
                                         {perm}
                                     </button>
                                 );
                              })}
                           </div>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="flex justify-end items-center gap-6 pt-8 border-t border-slate-50 mt-10 bg-slate-50/30 -mx-10 -mb-10 p-8">
                 <button type="button" onClick={resetForm} className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors">Abort Clearance</button>
                 <button type="submit" className="h-11 px-10 rounded-xl bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                    {editingUserId ? "Commit Update" : "Finalize Authorization"}
                 </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mx-4 md:mx-0"
          >
            <div className="px-10 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/20">
               <div className="relative group max-w-sm w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Audit personnel identification..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-14 pr-6 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-900 outline-none focus:ring-4 focus:ring-slate-50 transition-all shadow-inner"
                  />
               </div>
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Database size={12} className="text-primary" /> Active Authority Ledger • {filteredUsers.length} Records
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-slate-50">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Personnel Node</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Security Sector</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Permission</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Overrides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                       <tr><td colSpan="4" className="py-32 text-center text-[11px] font-black text-slate-200 uppercase tracking-[0.5em] animate-pulse">Establishing Nexus Connection...</td></tr>
                   ) : filteredUsers.length === 0 ? (
                       <tr><td colSpan="4" className="py-24 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No matching authority protocols detected</td></tr>
                   ) : filteredUsers.map(user => {
                       const role = getRoleConfig(user.role);
                       return (
                           <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-5">
                                     <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform text-sm">
                                        {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                     </div>
                                     <div>
                                        <p className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">{user.first_name || "Nexus"} {user.last_name}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                                           <Fingerprint size={8} className="text-primary/40" /> @{user.username}
                                        </p>
                                     </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${role.color}`}>
                                    {role.name}
                                 </span>
                              </td>
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                    {Object.keys(user.module_permissions || {}).length} Modular Links
                                 </div>
                              </td>
                              <td className="px-10 py-6 text-right">
                                 <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                                    <button onClick={() => handleEdit(user)} className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                                       <Edit size={14} />
                                    </button>
                                    <button className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
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

            <div className="p-10 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Primary Security Ledger Node</div>
                <Pagination currentPage={page} totalPages={Math.ceil(count/pageSize)} onPageChange={setPage} count={count} pageSize={pageSize} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputGroup({ label, value, onChange, placeholder, icon: Icon, symbol, type="text", desc }) {
    return (
        <div className="space-y-2.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {label}
            </label>
            <div className="relative group">
                {symbol ? (
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900 font-black text-xs">
                        {symbol}
                    </div>
                ) : (
                    <Icon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-slate-900 transition-colors" />
                )}
                <input 
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-${symbol ? '10' : '14'} pr-6 font-bold text-[11px] text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner`}
                />
            </div>
            {desc && <p className="text-[8px] font-bold text-slate-300 ml-1 tracking-tight">{desc}</p>}
        </div>
    );
}
