import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../shared/api/client';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Info, ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2, 
    ChevronRight, User, ArrowRight, Sparkles, ShieldCheck, Zap, Database
} from 'lucide-react';

const PoojaBookingPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const poojaId = searchParams.get('id');

    const [formData, setFormData] = useState({
        devoteeName: '',
        phone: '',
        nakshatra: '',
        date: '',
        poojaType: poojaId || ''
    });

    const [poojas, setPoojas] = useState([]);
    const [nakshatras, setNakshatras] = useState([]);
    const [slots, setSlots] = useState([]);
    const [panchangData, setPanchangData] = useState(null);
    const [loadingPanchang, setLoadingPanchang] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [poojaRes, nakRes] = await Promise.all([
                    api.get('/pooja/'),
                    api.get('/devotees/nakshatra/')
                ]);
                setPoojas(poojaRes.data.results || poojaRes.data || []);
                setNakshatras(nakRes.data.results || nakRes.data || []);
            } catch (err) {
                console.error('Failed to load data:', err);
                setError(t('failed_load_form_data', 'Failed to load form data.'));
            }
        };
        loadData();
    }, [t]);

    useEffect(() => {
        if (formData.date) {
            setLoadingPanchang(true);
            api.get(`/panchangam/daily/?date=${formData.date}`)
                .then(res => setPanchangData(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoadingPanchang(false));
        } else {
            setPanchangData(null);
        }
    }, [formData.date]);

    useEffect(() => {
        if (formData.poojaType) {
            const selectedPooja = poojas.find(p => p.id === parseInt(formData.poojaType));
            if (selectedPooja && selectedPooja.time_slots) {
                setSlots(selectedPooja.time_slots);
            } else {
                setSlots([]);
                api.get(`/pooja/slots/?pooja=${formData.poojaType}`)
                    .then(res => setSlots(res.data.results || res.data || []))
                    .catch(e => console.error(e));
            }
        } else {
            setSlots([]);
        }
    }, [formData.poojaType, poojas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            let devoteeId = null;
            const searchRes = await api.get(`/devotees/?search=${formData.phone}`);
            const existingDevotees = searchRes.data.results || searchRes.data || [];

            if (existingDevotees.length > 0) {
                devoteeId = existingDevotees[0].id;
            } else {
                const devoteeRes = await api.post('/devotees/', {
                    full_name: formData.devoteeName,
                    phone: formData.phone,
                    nakshatra: formData.nakshatra || null
                });
                devoteeId = devoteeRes.data.id;
            }

            const bookingRes = await api.post('/bookings/', {
                devotee: devoteeId,
                pooja: formData.poojaType,
                booking_date: formData.date,
                slot: formData.slotId || null,
                status: 'confirmed',
                payment_status: 'pending',
                source: 'offline'
            });

            setSuccess(`Booking initialized for ID: ${bookingRes.data.id}`);
            setTimeout(() => navigate('/bookings'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Protocol transmission failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* High-Fidelity Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div>
                   <button onClick={() => navigate('/pooja')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all mb-4 group">
                       <div className="h-7 w-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                           <ArrowLeft size={12} />
                       </div>
                       Protocol Exit
                   </button>
                   <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Ritual Portal</h1>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 flex items-center gap-2">
                       <Zap size={10} className="text-amber-500" /> Booking Authorization & Service Initialization
                   </p>
                </div>
                <div className="hidden md:flex flex-col items-end">
                    <div className="h-9 px-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                        <ShieldCheck size={12} /> System Secure
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/50">
                        {/* Step 1: Identity Protocol */}
                        <div className="p-10 border-b border-slate-50">
                            <StepHeader number="01" title="Identity Protocol" sub="Verify Devotee Credentials" />
                            <div className="space-y-6 mt-10">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Name (Identifier)</label>
                                    <input 
                                        name="devoteeName" required value={formData.devoteeName} onChange={handleChange}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                                        placeholder="Enter full name..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Uplink</label>
                                        <input 
                                            name="phone" required value={formData.phone} onChange={handleChange}
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                                            placeholder="+91 ..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Astral Node</label>
                                        <select 
                                            name="nakshatra" value={formData.nakshatra} onChange={handleChange}
                                            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner appearance-none cursor-pointer text-xs"
                                        >
                                            <option value="">None Specified</option>
                                            {nakshatras.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Ritual Scheduling */}
                        <div className="p-10">
                            <StepHeader number="02" title="Ritual Scheduling" sub="Service Definition & Timing" />
                            <div className="space-y-6 mt-10">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Node (Type)</label>
                                    <select 
                                        name="poojaType" required value={formData.poojaType} onChange={handleChange}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner appearance-none cursor-pointer text-xs"
                                    >
                                        <option value="">Select Ritual...</option>
                                        {poojas.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} — ₹{p.amount}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Universal Date</label>
                                    <input 
                                        type="date" name="date" required value={formData.date} onChange={handleChange}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all shadow-inner text-xs"
                                    />
                                </div>

                                {slots.length > 0 && (
                                    <div className="pt-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-4 block">Available Time Slots</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {slots.map(s => (
                                                <button
                                                    key={s.id} type="button" onClick={() => setFormData({ ...formData, slotId: s.id })}
                                                    className={`h-12 rounded-xl border font-bold text-xs transition-all flex items-center justify-center ${
                                                        formData.slotId === s.id 
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900'
                                                    }`}
                                                >
                                                    {s.start_time.slice(0, 5)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Authorization Footer */}
                        <div className="p-10 bg-slate-50/50 border-t border-slate-50">
                            <button 
                                type="submit" disabled={loading}
                                className="w-full h-14 rounded-xl bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Authorize Booking <ArrowRight size={16} /></>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Side Intelligence Panel */}
                <div className="space-y-8">
                    {/* Success/Error Alerts */}
                    <AnimatePresence>
                        {success && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-8 bg-emerald-900 text-white rounded-[2rem] shadow-2xl shadow-emerald-900/40">
                                <CheckCircle2 size={32} className="mb-4 text-emerald-400" />
                                <h4 className="text-sm font-bold mb-1 uppercase tracking-widest">Ritual Initialized</h4>
                                <p className="text-[10px] font-medium opacity-60 leading-relaxed uppercase tracking-widest">{success}</p>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-8 bg-red-900 text-white rounded-[2rem] shadow-2xl shadow-red-900/40">
                                <Info size={32} className="mb-4 text-red-400" />
                                <h4 className="text-sm font-bold mb-1 uppercase tracking-widest">Protocol Denied</h4>
                                <p className="text-[10px] font-medium opacity-60 leading-relaxed uppercase tracking-widest">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Panchang Audit Card */}
                    {panchangData ? (
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40 border border-slate-800">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles size={80} />
                            </div>
                            <h3 className="text-sm font-bold mb-10 flex items-center gap-2">
                                <Database size={16} className="text-primary" /> Astronomical Audit
                            </h3>
                            
                            <div className="space-y-8">
                                <AuditItem label="Tithi" value={panchangData.panchang.tithi} />
                                <AuditItem label="Nakshatra" value={panchangData.panchang.nakshatra} />
                                <AuditItem label="Malayalam Month" value={panchangData.panchang.malayalam_masam || "Karkidakam"} />
                                
                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Operational Windows</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {panchangData.suggestions?.slice(0, 2).map((m, i) => (
                                            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center group-hover:bg-white/10 transition-all">
                                                <span className="text-[10px] font-bold text-white/60">{m.name}</span>
                                                <span className="text-[10px] font-black text-primary">{m.start}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
                                <CalendarIcon size={24} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Await Synchronization</h4>
                            <p className="text-[10px] font-medium text-slate-400 mt-2 uppercase leading-relaxed">Select a date to pull astronomical audit data from the registry.</p>
                        </div>
                    )}
                    
                    <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                            <Zap size={14} /> Protocol Notice
                        </h4>
                        <p className="text-[10px] font-medium text-amber-900/60 leading-relaxed uppercase tracking-widest text-justify">
                            All bookings are permanent once committed. Financial ledger reconciliation occurs in real-time. Verify remittance before authorization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

function StepHeader({ number, title, sub }) {
    return (
        <div className="flex items-center gap-5">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] shadow-xl shadow-slate-900/20">
                {number}
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">{title}</h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{sub}</p>
            </div>
        </div>
    );
}

function AuditItem({ label, value }) {
    return (
        <div className="flex justify-between items-center group/item">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover/item:text-white/60 transition-colors">{label}</span>
            <span className="text-xs font-bold tracking-tight text-white/90">{value}</span>
        </div>
    );
}

export default PoojaBookingPage;
