import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, Mail, MapPin, Building2, Send, CheckCircle2, Navigation, LocateFixed } from 'lucide-react';
import api from '../../shared/api/client';

const DemoBookingModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        temple_name: '',
        phone: '',
        email: '',
        location: '',
        message: '',
        interested_plan: 'pro',
        latitude: null,
        longitude: null
    });
    const [isTrial, setIsTrial] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = () => setShowSuggestions(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLocationSearch = async (query) => {
        setFormData(prev => ({ ...prev, location: query }));
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        // Debounce search
        const timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`);
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Location search failed", err);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    const handleSelectSuggestion = (suggestion) => {
        setFormData(prev => ({ 
            ...prev, 
            location: suggestion.display_name,
            latitude: parseFloat(suggestion.lat),
            longitude: parseFloat(suggestion.lon)
        }));
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, latitude, longitude }));
                
                // Optional: Reverse Geocoding to get address text
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data.display_name) {
                        setFormData(prev => ({ ...prev, location: data.display_name }));
                    }
                } catch (err) {
                    console.error("Reverse geocoding failed", err);
                } finally {
                    setIsDetecting(false);
                }
            },
            (err) => {
                setError('Could not detect location. Please type manually.');
                setIsDetecting(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await api.post('/leads/', {
                ...formData,
                trial_requested: isTrial
            });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setFormData({
                    full_name: '',
                    temple_name: '',
                    phone: '',
                    email: '',
                    location: '',
                    message: '',
                    interested_plan: 'pro',
                    latitude: null,
                    longitude: null
                });
                setIsTrial(false);
            }, 3000);
        } catch (err) {
            setError('Failed to process request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-400"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div 
                                key="form"
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="mb-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <button 
                                            type="button"
                                            onClick={() => setIsTrial(false)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!isTrial ? 'bg-amber-100 text-amber-600 shadow-sm' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            <Calendar size={12} className="inline mr-1" /> Personalized Demo
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setIsTrial(true)}
                                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isTrial ? 'bg-orange-100 text-orange-600 shadow-sm' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            <CheckCircle2 size={12} className="inline mr-1" /> 7-Day Free Trial
                                        </button>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                        {isTrial ? "Initialize Your Digital Sanctum" : "Establish Heritage Connection"}
                                    </h3>
                                    <p className="text-slate-500 mt-2 font-medium">
                                        {isTrial 
                                            ? "Get full unrestricted access to all premium features for 7 days. No credit card required." 
                                            : "Join 500+ Kerala temples managing heritage with digital excellence."}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput label="Full Name" icon={X} placeholder="Vijay Kumar" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} />
                                    <FormInput label="Temple Name" icon={Building2} placeholder="Mahadeva Temple" value={formData.temple_name} onChange={(v) => setFormData({...formData, temple_name: v})} />
                                    <FormInput label="Phone Number" icon={Phone} placeholder="+91 98XXX XXXX" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                                    <FormInput label="Email Address" icon={Mail} placeholder="admin@temple.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                                    <div className="md:col-span-2 relative">
                                        <FormInput 
                                            label="Temple Location" 
                                            icon={MapPin} 
                                            placeholder="Thrissur, Kerala" 
                                            value={formData.location} 
                                            onChange={handleLocationSearch} 
                                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                            action={{
                                                icon: LocateFixed,
                                                onClick: handleDetectLocation,
                                                isLoading: isDetecting,
                                                tooltip: "Detect Location"
                                            }}
                                        />
                                        
                                        <AnimatePresence>
                                            {showSuggestions && suggestions.length > 0 && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-[110] left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                                                >
                                                    {suggestions.map((s, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => handleSelectSuggestion(s)}
                                                            className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900">{s.display_name.split(',')[0]}</p>
                                                                    <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{s.display_name}</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {formData.latitude && (
                                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                                                <Navigation size={10} /> Precision Coordinates Captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2 mt-4">
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span>{isTrial ? "Start 7-Day Free Trial" : "Confirm Demo Request"}</span>
                                                    <Send size={18} className="translate-x-0 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                {error && <p className="mt-4 text-center text-xs font-bold text-red-500 uppercase tracking-widest">{error}</p>}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-20 text-center flex flex-col items-center gap-6"
                            >
                                <div className="h-24 w-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-lg border border-emerald-100 mb-4">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                    {isTrial ? "Trial Provisioning" : "Nexus Established"}
                                </h3>
                                <p className="text-slate-500 font-medium max-w-sm">
                                    {isTrial 
                                        ? "Your 7-day heritage trial is being provisioned. You will receive an automated email with your login credentials within 5-10 minutes."
                                        : "A Devalayam Heritage consultant will contact you within 24 operational hours to schedule your walkthrough."}
                                </p>
                                
                                {isTrial && (
                                    <button 
                                        onClick={() => window.location.href = `/signup?email=${encodeURIComponent(formData.email)}&temple=${encodeURIComponent(formData.temple_name)}&name=${encodeURIComponent(formData.full_name)}`}
                                        className="mt-4 px-8 h-14 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                    >
                                        Complete Account Setup Now
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

function FormInput({ label, icon: Icon, placeholder, value, onChange, onFocus, action }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-amber-500 transition-colors">
                    <Icon size={16} />
                </div>
                <input
                    type="text"
                    required
                    className={`w-full h-14 pl-12 ${action ? 'pr-14' : 'pr-6'} rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none font-bold text-slate-900 text-sm placeholder:text-slate-300`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                />
                
                {action && (
                    <button
                        type="button"
                        onClick={action.onClick}
                        disabled={action.isLoading}
                        className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-100 hover:shadow-sm transition-all active:scale-95 disabled:opacity-50"
                        title={action.tooltip}
                    >
                        {action.isLoading ? (
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
                        ) : (
                            <action.icon size={18} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default DemoBookingModal;
