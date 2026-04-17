import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
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
  ArrowRight,
  Key,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../shared/api/client';
import Pagination from '../../components/common/Pagination';

const APP_MODULES = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'devotees', name: 'Devotees' },
  { id: 'pooja', name: 'Pooja Services' },
  { id: 'bookings', name: 'Bookings' },
  { id: 'donations', name: 'Donations' },
  { id: 'events', name: 'Events' },
  { id: 'hundi', name: 'Hundi' },
  { id: 'inventory', name: 'Inventory' },
  { id: 'finance', name: 'Financial Reports' },
  { id: 'shipments', name: 'E-Prasad Shipping' },
  { id: 'staff', name: 'Staff & Attendance' },
  { id: 'assets', name: 'Asset Registry' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'tv', name: 'TV Display' },
  { id: 'users', name: 'User Management' },
];

const ROLES = [
  { id: 'temple_admin', name: 'Temple Admin', color: 'bg-slate-900 border-slate-900 text-white' },
  { id: 'accountant', name: 'Accountant', color: 'bg-blue-50 border-blue-100 text-blue-600' },
  { id: 'priest', name: 'Priest', color: 'bg-orange-50 border-orange-100 text-orange-600' },
  { id: 'counter_staff', name: 'Counter Staff', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
  { id: 'volunteer', name: 'Volunteer', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
  { id: 'devotee', name: 'Devotee', color: 'bg-slate-50 border-slate-100 text-slate-400' },
];

const ROLE_PERMISSIONS_MAP = {
  temple_admin: APP_MODULES.reduce((acc, mod) => {
    acc[mod.id] = ['view', 'edit', 'delete'];
    return acc;
  }, {}),
  accountant: {
    finance: ['view', 'edit', 'delete'],
    donations: ['view', 'edit', 'delete'],
    hundi: ['view', 'edit', 'delete'],
    inventory: ['view', 'edit'],
    devotees: ['view'],
    bookings: ['view'],
    pooja: ['view'],
    dashboard: ['view'],
    staff: ['view'],
  },
  priest: {
    pooja: ['view', 'edit', 'delete'],
    bookings: ['view', 'edit'],
    events: ['view', 'edit'],
    devotees: ['view'],
    dashboard: ['view'],
    staff: ['view'],
  },
  counter_staff: {
    pooja: ['view', 'edit'],
    bookings: ['view', 'edit'],
    donations: ['view', 'edit'],
    hundi: ['view', 'edit'],
    devotees: ['view', 'edit'],
    dashboard: ['view'],
    inventory: ['view'],
  },
  volunteer: {
    pooja: ['view'],
    bookings: ['view'],
    events: ['view'],
    dashboard: ['view'],
  },
  devotee: {
    dashboard: ['view'],
  }
};

export default function UsersPage() {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
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
    module_permissions: ROLE_PERMISSIONS_MAP['counter_staff']
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
      module_permissions: ROLE_PERMISSIONS_MAP['counter_staff']
    });
    setIsFormOpen(false);
    setErrorMsg('');
    setSubmitting(false);
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
    setSubmitting(true);
    setErrorMsg('');
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
      const data = error.response?.data;
      if (typeof data === 'object') {
        setErrorMsg(Object.values(data)[0]);
      } else {
        setErrorMsg("Failed to save user account.");
      }
    } finally {
      setSubmitting(false);
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Prime Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
                <Users size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
               <p className="text-xs font-medium text-slate-500 mt-0.5">
                   Manage temple administrators, priests, and staff roles
               </p>
            </div>
        </div>

        <div className="flex items-center gap-3">
          {!isFormOpen && checkPermission('users', 'edit') && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="h-10 px-5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <UserPlus size={16} /> New Staff Member
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <UserCog size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {editingUserId ? "Edit User Account" : "Create New Account"}
                    </h2>
                    <p className="text-[10px] font-medium text-slate-400">Enter personal details and assign role-based permissions</p>
                  </div>
               </div>
               <button onClick={resetForm} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all">
                 <X size={18} />
               </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputGroup label="Full Name" value={formData.first_name} onChange={val => setFormData({...formData, first_name: val})} placeholder="e.g. Rahul Sharma" icon={Users} />
                <InputGroup label="Username" value={formData.new_username} onChange={val => setFormData({...formData, new_username: val})} placeholder="rahul_admin" symbol="@" />
                <InputGroup label="Password" type="password" value={formData.password} onChange={val => setFormData({...formData, password: val})} placeholder="••••••••" icon={Key} desc={editingUserId ? "Leave blank to keep current password" : "Minimum 8 characters"} />
                
                <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selection Role</label>
                    <div className="relative">
                      <select 
                        value={formData.role} 
                        onChange={e => {
                          const newRole = e.target.value;
                          const defaultPerms = ROLE_PERMISSIONS_MAP[newRole] || {};
                          setFormData({ 
                            ...formData, 
                            role: newRole,
                            module_permissions: defaultPerms
                          });
                        }}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 font-semibold text-sm text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        {ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                    <p className="text-[9px] font-medium text-amber-600 mt-1 uppercase tracking-widest flex items-center gap-1">
                      <Zap size={10} /> Selecting a role applies standard permission presets
                    </p>
                </div>
                <InputGroup label="Email Address" value={formData.email} onChange={val => setFormData({...formData, email: val})} placeholder="rahul@example.com" icon={Mail} />
                <InputGroup label="Phone Number" value={formData.phone} onChange={val => setFormData({...formData, phone: val})} placeholder="+91 99999 00000" icon={Phone} />
              </div>

              <div className="pt-8 border-t border-slate-100">
                 <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Shield size={16} className="text-[#B8860B]" /> Module Permissions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Control which parts of the application this user can access and modify</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {APP_MODULES.map(mod => (
                        <div key={mod.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-[#B8860B]/20 transition-all">
                           <p className="text-[11px] font-bold text-slate-800 mb-3">{mod.name}</p>
                           <div className="flex gap-1.5">
                              {['view', 'edit', 'delete'].map(perm => {
                                 const active = (formData.module_permissions[mod.id] || []).includes(perm);
                                 return (
                                     <button
                                         type="button"
                                         key={perm}
                                         onClick={() => handleTogglePermission(mod.id, perm)}
                                         className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all ${
                                             active ? 'bg-[#B8860B] border-[#B8860B] text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
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

              {errorMsg && (
                <div className="px-8 pb-4">
                  <div className="p-4 bg-red-50 text-red-500 rounded-xl flex items-center gap-3 border border-red-100 text-xs font-bold uppercase tracking-tight">
                    <AlertCircle size={18} /> {errorMsg}
                  </div>
                </div>
              )}

              <div className="flex justify-end items-center gap-4 pt-8 border-t border-slate-100">
                 <button type="button" onClick={resetForm} className="px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                 <button type="submit" disabled={submitting} className="px-8 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-2">
                    {submitting ? <Zap className="animate-spin" size={14} /> : (editingUserId ? "Save Changes" : "Create Account")}
                 </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="px-8 py-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
               <div className="relative group max-w-sm w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search staff by name or user ID..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-11 pr-4 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 outline-none focus:border-[#B8860B] transition-all"
                  />
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Database size={12} /> {filteredUsers.length} Active Accounts
               </div>
            </div>

            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Access Role</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Privileges</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                       <tr><td colSpan="4" className="py-20 text-center text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">Loading data...</td></tr>
                   ) : filteredUsers.length === 0 ? (
                       <tr><td colSpan="4" className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No users found</td></tr>
                   ) : filteredUsers.map(user => {
                       const role = getRoleConfig(user.role);
                       return (
                           <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                     <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                                        {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                     </div>
                                     <div>
                                        <p className="font-bold text-slate-900">{user.first_name || "User"} {user.last_name}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">@{user.username}</p>
                                     </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${role.color}`}>
                                    {role.name}
                                 </span>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                                    <ShieldCheck size={14} className="text-[#B8860B]" />
                                    {Object.keys(user.module_permissions || {}).length} Access Point(s)
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <div className="flex justify-end items-center gap-2">
                                    {checkPermission('users', 'edit') && (
                                        <button onClick={() => handleEdit(user)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                            <Edit size={14} />
                                        </button>
                                    )}
                                    {checkPermission('users', 'delete') && (
                                        <button className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
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
            </div>

            <div className="p-8 border-t border-slate-50 flex justify-between items-center bg-slate-50/20">
                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Management Ledger v1.0</div>
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
        <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {label}
            </label>
            <div className="relative group">
                {symbol ? (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        {symbol}
                    </div>
                ) : Icon ? (
                    <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                ) : null}
                <input 
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-11 bg-slate-50 border border-slate-200 rounded-xl ${symbol || Icon ? 'pl-11' : 'pl-4'} pr-4 font-semibold text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all`}
                />
            </div>
            {desc && <p className="text-[10px] font-medium text-slate-400 tracking-tight">{desc}</p>}
        </div>
    );
}
