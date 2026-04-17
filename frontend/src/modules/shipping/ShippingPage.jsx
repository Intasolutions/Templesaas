import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../shared/api/client';
import Pagination from '../../components/common/Pagination';
import { 
    Truck, 
    Search, 
    Filter, 
    Package, 
    Clock, 
    CheckCircle2, 
    ChevronRight,
    MapPin,
    Phone,
    X,
    ExternalLink,
    AlertCircle,
    Save,
    Globe
} from 'lucide-react';
import { cn } from "../../lib/utils";

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    const config = {
        pending: { bg: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
        prepared: { bg: 'bg-blue-50 text-blue-700 border-blue-100' },
        dispatched: { bg: 'bg-orange-50 text-orange-700 border-orange-100' },
        delivered: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        cancelled: { bg: 'bg-red-50 text-red-700 border-red-100' },
    };

    const style = config[status?.toLowerCase()] || config.pending;

    return (
        <span className={cn("px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight flex items-center justify-center gap-2 border", style.bg)}>
            <div className={cn("w-1.5 h-1.5 rounded-full", style.bg.replace('bg-', 'bg-').split(' ')[1])} />
            {t(status?.toLowerCase()) || status}
        </span>
    );
};

export default function ShippingPage() {
    const { t } = useTranslation();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [createForm, setCreateForm] = useState({ recipient_name: '', contact_number: '', shipping_address: '', status: 'pending', courier_partner: '', tracking_id: '' });
    const [updateForm, setUpdateForm] = useState({ status: '', tracking_id: '', courier_partner: '' });

    // Pagination State
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const pageSize = 10;
    const totalPages = Math.ceil(count / pageSize) || 1;

    useEffect(() => {
        fetchShipments();
    }, [page, searchQuery]);

    useEffect(() => {
        if (selectedShipment) {
            setUpdateForm({
                status: selectedShipment.status,
                tracking_id: selectedShipment.tracking_id || '',
                courier_partner: selectedShipment.courier_partner || ''
            });
        }
    }, [selectedShipment]);

    const fetchShipments = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchQuery) params.search = searchQuery;
            
            const res = await api.get('/shipping/shipments/', { params });
            const data = res.data;
            
            if (data.results) {
                setShipments(data.results);
                setCount(data.count);
            } else {
                setShipments(Array.isArray(data) ? data : []);
                setCount(Array.isArray(data) ? data.length : 0);
            }
        } catch (error) {
            console.error("Error fetching shipments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShipment = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await api.post('/shipping/shipments/', createForm);
            fetchShipments();
            setIsCreateOpen(false);
            setCreateForm({ recipient_name: '', contact_number: '', shipping_address: '', status: 'pending', courier_partner: '', tracking_id: '' });
        } catch (error) {
            console.error("Creation Error:", error);
            alert("Failed to create shipment. Please check all fields.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        try {
            await api.patch(`/shipping/shipments/${selectedShipment.id}/`, updateForm);
            fetchShipments();
            setSelectedShipment(null);
        } catch (error) {
            console.error("Update Error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const stats = [
        { label: 'Total Shipments', value: count, icon: Package },
        { label: 'Carrier Network', value: 'DHL_BD_IND', icon: Globe },
        { label: 'To Prepare', value: shipments.filter(s => s.status === 'prepared' || s.status === 'pending').length, icon: Clock },
        { label: 'Delivered', value: shipments.filter(s => s.status === 'delivered').length, icon: CheckCircle2 },
    ];

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center text-primary">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">E-Prasad Shipping</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">Manage and track the fulfillment of prasad items to devotees.</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm">
                        Export List
                    </button>
                    <button 
                        onClick={() => setIsCreateOpen(true)}
                        className="h-11 px-6 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-sm active:scale-95"
                    >
                        New Shipment
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="card-professional p-6 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">{stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <stat.icon size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="card-professional flex items-center px-4 h-14 gap-4 w-full md:w-96">
                        <Search size={16} className="text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="Audit shipments by ID, Name or CID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-900 placeholder-slate-300"
                        />
                    </div>
                    <button className="h-14 px-8 rounded-xl bg-white border border-slate-100 flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors w-full md:w-auto justify-center">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                <div className="card-professional overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Logistics Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Operational Node</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">Registry ID</th>
                                    <th className="px-8 py-5 border-b border-slate-50"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {shipments.map((shipment) => (
                                    <tr key={shipment.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-white transition-colors">
                                                    {shipment.recipient_name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{shipment.recipient_name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                                        <Phone size={8} /> {shipment.contact_number}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <div className="flex items-start gap-2">
                                                <MapPin size={12} className="text-slate-300 mt-0.5" />
                                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 uppercase">{shipment.shipping_address}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <StatusBadge status={shipment.status} />
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{shipment.courier_partner}</span>
                                                <span className="text-[10px] font-bold text-slate-900 select-all tracking-tight">{shipment.tracking_id || "AWAITING_ID"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => setSelectedShipment(shipment)}
                                                className="h-10 w-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-900 hover:border-slate-900 transition-all"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {shipments.map((shipment) => (
                            <div key={shipment.id} className="p-6 bg-white active:bg-slate-50 transition-colors" onClick={() => setSelectedShipment(shipment)}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold">
                                            {shipment.recipient_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm tracking-tight">{shipment.recipient_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{shipment.contact_number}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={shipment.status} />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{shipment.courier_partner || "NO_PARTNER"}</span>
                                        <span className="text-[10px] font-bold text-slate-900 mt-0.5">{shipment.tracking_id || "AWAITING_ID"}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-50">
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={setPage} 
                            count={count} 
                            pageSize={pageSize} 
                        />
                    </div>
                </div>

                {shipments.length === 0 && (
                    <div className="card-professional p-32 text-center border-dashed border-2">
                        <div className="h-16 w-16 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                            <Truck size={24} className="text-slate-200" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">No fulfillment logs detected</h3>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isCreateOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsCreateOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col"
                        >
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Initiate Fulfillment</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">New Logistics Registry Entry</p>
                                </div>
                                <button 
                                    onClick={() => setIsCreateOpen(false)}
                                    className="h-10 w-10 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateShipment} className="p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Recipient Name</label>
                                        <input 
                                            required
                                            type="text"
                                            value={createForm.recipient_name}
                                            onChange={(e) => setCreateForm({ ...createForm, recipient_name: e.target.value })}
                                            placeholder="FULL NAME"
                                            className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-xs uppercase"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
                                        <input 
                                            required
                                            type="text"
                                            value={createForm.contact_number}
                                            onChange={(e) => setCreateForm({ ...createForm, contact_number: e.target.value })}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-xs"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Shipping Address</label>
                                        <textarea 
                                            required
                                            rows={4}
                                            value={createForm.shipping_address}
                                            onChange={(e) => setCreateForm({ ...createForm, shipping_address: e.target.value })}
                                            placeholder="BUILDING, STREET, AREA, CITY, PIN"
                                            className="w-full p-4 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-xs uppercase resize-none"
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 bg-slate-50 border-t border-slate-100">
                                <button 
                                    onClick={handleCreateShipment}
                                    disabled={isUpdating}
                                    className="w-full h-12 rounded-lg bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isUpdating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Truck size={14} /> Create Registry</>}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}

                {selectedShipment && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedShipment(null)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[110] flex flex-col"
                        >
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-20">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Operational Details</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Logistics Clearance & Shipment Protocol</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedShipment(null)}
                                    className="h-10 w-10 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-10 space-y-12 flex-1 overflow-y-auto custom-scrollbar">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Entity Audit</h4>
                                    </div>
                                    <div className="p-8 rounded-xl bg-slate-900 text-white relative overflow-hidden border border-slate-800">
                                        <div className="relative z-10 flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xl border border-white/10">
                                                {selectedShipment.recipient_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white tracking-tight uppercase">{selectedShipment.recipient_name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedShipment.contact_number}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <DetailItem label="Destination Protocol" value={selectedShipment.shipping_address} icon={MapPin} />
                                </section>

                                <section className="space-y-6 pt-10 border-t border-slate-100">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Operational Update</h4>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Logistics Status</label>
                                            <select 
                                                value={updateForm.status}
                                                onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-xs uppercase tracking-widest"
                                            >
                                                <option value="pending">Pending Preparation</option>
                                                <option value="prepared">Prasad Prepared</option>
                                                <option value="dispatched">Dispatched</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Carrier Network</label>
                                            <input 
                                                type="text"
                                                value={updateForm.courier_partner}
                                                onChange={(e) => setUpdateForm({ ...updateForm, courier_partner: e.target.value })}
                                                placeholder="e.g. BLUEDART_PRIORITY"
                                                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-xs uppercase"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Registry Reference (Tracking ID)</label>
                                            <input 
                                                type="text"
                                                value={updateForm.tracking_id}
                                                onChange={(e) => setUpdateForm({ ...updateForm, tracking_id: e.target.value })}
                                                placeholder="AWAITING_ID"
                                                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-xs"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button 
                                    onClick={handleUpdateStatus}
                                    disabled={isUpdating}
                                    className="flex-1 h-12 rounded-lg bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isUpdating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> Commit Changes</>}
                                </button>
                                <button className="h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-colors">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function DetailItem({ label, value, icon: Icon, isStatus, isBold }) {
    return (
        <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
            <div className="flex items-start gap-4">
                {Icon && (
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-300 mt-1">
                        <Icon size={14} />
                    </div>
                )}
                <div className="flex-1">
                    {isStatus ? (
                        <div className="w-fit"><StatusBadge status={value} /></div>
                    ) : (
                        <p className={cn("text-[13px] font-bold text-slate-900 uppercase tracking-tight leading-relaxed", isBold && "font-bold tracking-widest")}>
                            {value}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
