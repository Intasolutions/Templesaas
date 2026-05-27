import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../shared/api/client';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info, ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2,
    ChevronRight, User, ArrowRight, Sparkles, ShieldCheck, Zap, Database, Box,
    ChevronLeft, Heart, CreditCard, Truck
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import PremiumButton from '../../components/ui/PremiumButton';
import ModernInput from '../../components/ui/ModernInput';
import { useNotify } from '../../context/NotificationContext';
import { ValidationUtils } from '../../shared/utils/ValidationUtils';

const PoojaBookingPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const poojaId = searchParams.get('id');
    const dateParam = searchParams.get('date');
    const notify = useNotify();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        devoteeName: '',
        phone: '',
        nakshatra: '',
        date: dateParam || new Date().toISOString().split('T')[0],
        poojaType: poojaId || '',
        includeShipping: false,
        shippingName: '',
        shippingAddress: '',
        shippingPhone: '',
        paymentStatus: 'pending',
        paymentMode: 'cash',
        bankAccount: null
    });

    const [poojas, setPoojas] = useState([]);
    const [prasads, setPrasads] = useState([]);
    const [nakshatras, setNakshatras] = useState([]);
    const [slots, setSlots] = useState([]);
    const [panchangData, setPanchangData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authMode, setAuthMode] = useState(dateParam ? 'ritual' : null); 
    const [recurrence, setRecurrence] = useState({
        type: 'one-time',
        durationMonths: 1
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [poojaRes, nakRes, prasadRes] = await Promise.all([
                    api.get('/pooja/'),
                    api.get('/devotees/nakshatra/', { params: { page_size: 100 } }),
                    api.get('/shipping/prasadam-items/')
                ]);
                setPoojas(poojaRes.data.results || poojaRes.data || []);
                setNakshatras(nakRes.data.results || nakRes.data || []);
                setPrasads(prasadRes.data.results || prasadRes.data || []);
            } catch (err) {
                console.error('Failed to load data:', err);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (formData.date) {
            api.get(`/panchangam/daily/?date=${formData.date}`)
                .then(res => setPanchangData(res.data))
                .catch(err => console.error(err));
        }
    }, [formData.date]);

    useEffect(() => {
        if (formData.poojaType && authMode === 'ritual') {
            const selectedPooja = poojas.find(p => p.id === parseInt(formData.poojaType));
            if (selectedPooja && selectedPooja.time_slots) {
                setSlots(selectedPooja.time_slots);
            } else {
                api.get(`/pooja/slots/?pooja=${formData.poojaType}`)
                    .then(res => setSlots(res.data.results || res.data || []))
                    .catch(e => console.error(e));
            }
        }
    }, [formData.poojaType, poojas, authMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalVal = value;
        let err = null;

        if (name === 'phone') {
            finalVal = ValidationUtils.formatters.phone(value);
            err = ValidationUtils.validators.phone(finalVal);
        } else if (name === 'devoteeName') {
            err = ValidationUtils.validators.name(value);
        } else if (name === 'date' && authMode === 'ritual') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) err = "Past dates are not allowed for rituals";
        }

        setFormData(prev => ({ ...prev, [name]: finalVal }));
        setErrors(prev => ({ ...prev, [name]: err }));
    };

    const isStepValid = () => {
        if (step === 1) {
            return !ValidationUtils.validators.name(formData.devoteeName) && 
                   !ValidationUtils.validators.phone(formData.phone);
        }
        if (step === 2) {
            const dateErr = authMode === 'ritual' && new Date(formData.date) < new Date().setHours(0,0,0,0);
            return !!formData.poojaType && !!formData.date && !dateErr;
        }
        return true;
    };

    const nextStep = () => {
        if (!isStepValid()) {
            return notify.warn(t('complete_fields', "Please fill all required fields correctly before continuing."));
        }
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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

            const payload = {
                devotee: devoteeId,
                status: formData.paymentStatus === 'success' ? 'confirmed' : 'pending',
                payment_status: formData.paymentStatus,
                payment_mode: formData.paymentMode,
                booking_date: formData.date,
                source: authMode === 'prasadam' ? 'online' : 'offline',
                shipping_details: formData.includeShipping ? {
                    recipient_name: formData.shippingName || formData.devoteeName,
                    shipping_address: formData.shippingAddress,
                    contact_number: formData.shippingPhone || formData.phone
                } : null
            };

            if (authMode === 'prasadam') {
                payload.prasadam_item = formData.poojaType;
            } else {
                payload.pooja = formData.poojaType;
                payload.slot = formData.slotId || null;
            }

            const res = await api.post('/bookings/', payload);
            setSuccess(t('booking_success', 'Booking completed successfully!'));
            setTimeout(() => navigate(`/bookings/success?id=${res.data.id}`), 1000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!authMode) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-16">
                <header className="space-y-4">
                    <h1 className="text-5xl font-bold text-slate-900 tracking-tight">{t('booking_portal', 'Temple Booking Portal')}</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">{t('select_service_type', 'Choose a Service to Begin')}</p>
                </header>

                <div className="flex flex-wrap justify-center gap-10">
                    <SelectionCard 
                        title="Ritual Booking" 
                        desc="Schedule Poojas, Vazhipadu & Custom Ceremonies" 
                        icon={<Sparkles size={40} />} 
                        onClick={() => setAuthMode('ritual')}
                        color="saffron"
                    />
                    <SelectionCard 
                        title="Prasadam Store" 
                        desc="Order E-Prasadam and Blessed Items for Home Delivery" 
                        icon={<Box size={40} />} 
                        onClick={() => setAuthMode('prasadam')}
                        color="slate"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
                <button onClick={() => { if(step === 1) setAuthMode(null); else prevStep(); }} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-all group">
                    <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronLeft size={18} />
                    </div>
                    {step === 1 ? t('back_to_selection', 'Change Service') : t('previous_step', 'Previous')}
                </button>
                <div className="flex gap-2">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-slate-100'}`} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {step === 1 && (
                                <GlassCard className="p-10 space-y-10" hover={false}>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('devotee_details', 'Devotee Details')}</h2>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('identify_devotee', 'Who is this booking for?')}</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <ModernInput 
                                            label="Full Name" 
                                            placeholder="Enter devotee name" 
                                            name="devoteeName" 
                                            value={formData.devoteeName} 
                                            error={errors.devoteeName}
                                            success={formData.devoteeName.length > 2}
                                            onChange={handleChange}
                                            icon={User}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ModernInput 
                                                label="Phone Number" 
                                                placeholder="+91 XXXXX XXXXX" 
                                                name="phone" 
                                                value={formData.phone} 
                                                error={errors.phone}
                                                success={formData.phone.replace(/\D/g, '').length === 10}
                                                onChange={handleChange}
                                                icon={Clock}
                                            />
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nakshatra (Star)</label>
                                                <select 
                                                    name="nakshatra" value={formData.nakshatra} onChange={handleChange}
                                                    className="w-full h-13 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select Star</option>
                                                    {nakshatras.map(n => <option key={n.id} value={n.id}>{n.name_ml || n.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <PremiumButton className="w-full" onClick={nextStep}>{t('continue', 'Next Step')}</PremiumButton>
                                </GlassCard>
                            )}

                            {step === 2 && (
                                <GlassCard className="p-10 space-y-10" hover={false}>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{authMode === 'ritual' ? t('service_selection', 'Select Ritual') : t('product_selection', 'Select Product')}</h2>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('choose_ritual', 'What would you like to schedule?')}</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                                                {authMode === 'ritual' ? 'Ritual Name' : 'Product Name'}
                                            </label>
                                            <select 
                                                name="poojaType" required value={formData.poojaType} onChange={handleChange}
                                                className="w-full h-13 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Select Option</option>
                                                {authMode === 'ritual' ? 
                                                    poojas.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} — ₹{p.amount || '0.00'}</option>
                                                    )) :
                                                    prasads.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ModernInput 
                                                label="Booking Date" 
                                                type="date" 
                                                name="date" 
                                                value={formData.date} 
                                                error={errors.date}
                                                success={formData.date && !errors.date}
                                                onChange={handleChange}
                                                icon={CalendarIcon}
                                            />
                                            {authMode === 'ritual' && slots.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Available Slot</label>
                                                    <select 
                                                        name="slotId" value={formData.slotId} onChange={handleChange}
                                                        className="w-full h-13 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Any Time</option>
                                                        {slots.map(s => <option key={s.id} value={s.id}>{s.start_time.slice(0, 5)}</option>)}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <PremiumButton className="w-full" onClick={nextStep}>{t('continue', 'Payment Details')}</PremiumButton>
                                </GlassCard>
                            )}

                            {step === 3 && (
                                <GlassCard className="p-10 space-y-10" hover={false}>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('payment_logistics', 'Payment & Delivery')}</h2>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('finalize_booking', 'Complete the final details')}</p>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Payment Status</label>
                                                <select 
                                                    name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}
                                                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="pending">Pay Later (Pending)</option>
                                                    <option value="success">Paid Now</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Payment Method</label>
                                                <select 
                                                    name="paymentMode" value={formData.paymentMode} onChange={handleChange}
                                                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="cash">Cash</option>
                                                    <option value="upi">UPI / QR</option>
                                                    <option value="card">Card</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Truck size={20} className="text-primary" />
                                                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Need Shipping?</span>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setFormData(prev => ({ ...prev, includeShipping: !prev.includeShipping }))}
                                                    className={`h-9 px-5 rounded-xl text-xs font-bold uppercase transition-all ${formData.includeShipping ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-400'}`}
                                                >
                                                    {formData.includeShipping ? 'Yes' : 'No'}
                                                </button>
                                            </div>

                                            {formData.includeShipping && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-slate-200">
                                                    <ModernInput label="Recipient Name" placeholder="Full name" value={formData.shippingName} onChange={e => setFormData({...formData, shippingName: e.target.value})} />
                                                    <textarea 
                                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all min-h-[100px]"
                                                        placeholder="Full shipping address..."
                                                        value={formData.shippingAddress}
                                                        onChange={e => setFormData({...formData, shippingAddress: e.target.value})}
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    <PremiumButton className="w-full" isLoading={loading} onClick={handleSubmit} icon={CheckCircle2}>
                                        {t('confirm_booking', 'Confirm Booking')}
                                    </PremiumButton>
                                </GlassCard>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="space-y-8">
                    {/* Astronomical Audit */}
                    {panchangData && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform"><Database size={80} /></div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-2">
                                <Sparkles size={16} /> Daily Astrology
                            </h3>
                            <div className="space-y-6">
                                <AuditItem label="Nakshatra" value={panchangData.nakshatra_ml || panchangData.nakshatra} />
                                <AuditItem label="Tithi" value={panchangData.tithi} />
                                <AuditItem label="Month" value={panchangData.malayalam_month_ml || panchangData.malayalam_month} />
                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Recommendations</p>
                                    {panchangData.suggestions?.slice(0, 2).map((s, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-white/70">{s.name}</span>
                                            <span className="text-primary">{s.start}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="p-8 rounded-[2.5rem] bg-gold-muted border border-gold/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <Heart size={20} className="text-gold" />
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Temple Notice</h4>
                        </div>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider leading-relaxed">
                            {t('booking_notice', 'All bookings are processed in accordance with temple customs. Please verify all details before confirming.')}
                        </p>
                    </div>

                    {error && (
                        <div className="p-8 rounded-[2.5rem] bg-red-50 border border-red-100 flex items-center gap-4 text-red-600">
                            <Info size={24} />
                            <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function SelectionCard({ title, desc, icon, onClick, color }) {
    const colors = {
        saffron: 'bg-primary text-white hover:bg-primary/90 shadow-primary/20',
        slate: 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
    };

    return (
        <motion.button 
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick} 
            className={`p-12 rounded-[3rem] text-left transition-all shadow-2xl relative overflow-hidden group w-full max-w-sm ${colors[color]}`}
        >
            <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                {icon}
            </div>
            <div className="relative z-10 space-y-8">
                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                    {icon}
                </div>
                <div>
                    <h3 className="text-3xl font-bold tracking-tight mb-4">{title}</h3>
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] pt-4">
                    Get Started <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </motion.button>
    );
}

function AuditItem({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-bold text-white">{value}</span>
        </div>
    );
}

export default PoojaBookingPage;

