import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, Mail, MapPin, Building2, Send, CheckCircle2, User, Sparkles } from 'lucide-react';
import api from '../../shared/api/client';

const DemoBookingModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        temple_name: '',
        phone: '',
        email: '',
        location: '',
        message: '',
        interested_plan: 'pro'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await api.post('/leads/', formData);
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
                    interested_plan: 'pro'
                });
            }, 3000);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-wood/40 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-wood/5"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-cream transition-colors text-wood/30 hover:text-primary z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="mb-10 text-center">
                                    <div className="h-14 w-14 bg-cream rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 shadow-sm border border-wood/5">
                                        <Sparkles size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black text-wood mb-2 uppercase tracking-tight">Free Demo</h3>
                                    <p className="text-wood/60 text-sm font-medium">We will call you to show how the software works.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SimpleInput label="Your Name" placeholder="Full Name" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} />
                                        <SimpleInput label="Temple Name" placeholder="Temple Name" value={formData.temple_name} onChange={(v) => setFormData({...formData, temple_name: v})} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SimpleInput label="Phone Number" placeholder="+91 XXXX XXX XXX" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                                        <SimpleInput label="Email" placeholder="email@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                                    </div>
                                    <SimpleInput label="Location" placeholder="City, State" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-16 bg-primary text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-orange-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-6 shadow-lg shadow-primary/20"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Schedule Call'}
                                        {!isSubmitting && <Send size={16} />}
                                    </button>
                                </form>
                                {error && <p className="mt-4 text-center text-[10px] font-bold uppercase text-red-500 tracking-widest">{error}</p>}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-cream text-primary flex items-center justify-center mx-auto mb-8 shadow-sm border border-wood/5">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-wood mb-2 uppercase tracking-tight">Request Sent!</h3>
                                <p className="text-wood/60 text-sm font-medium">Our team will call you shortly to schedule your demo.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

function SimpleInput({ label, placeholder, value, onChange, type = "text" }) {
    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-wood/40 uppercase tracking-widest ml-1">{label}</label>
            <input
                type={type}
                required
                className="w-full h-14 px-5 rounded-2xl bg-cream/50 border border-wood/5 focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-wood text-sm placeholder:text-wood/20"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default DemoBookingModal;
