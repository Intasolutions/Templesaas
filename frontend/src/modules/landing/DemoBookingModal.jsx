import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Phone, Mail, MapPin, Building2, Send, CheckCircle2, User } from 'lucide-react';
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
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-10 md:p-12">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="mb-10 text-center">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Book a Demo</h3>
                                    <p className="text-slate-500 text-sm">Fill out the form below to see the software in action.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <SimpleInput label="Full Name" placeholder="Your Name" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} />
                                    <SimpleInput label="Temple Name" placeholder="Institution Name" value={formData.temple_name} onChange={(v) => setFormData({...formData, temple_name: v})} />
                                    <SimpleInput label="Phone Number" placeholder="+91 XXXX XXX XXX" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                                    <SimpleInput label="Email Address" placeholder="email@example.com" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                                    <SimpleInput label="Location" placeholder="City, Kerala" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />

                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Request'}
                                        {!isSubmitting && <Send size={16} />}
                                    </button>
                                </form>
                                {error && <p className="mt-4 text-center text-xs font-semibold text-red-500">{error}</p>}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Request Sent!</h3>
                                <p className="text-slate-500 text-sm">We will contact you shortly to schedule your demo.</p>
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
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
            <input
                type={type}
                required
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-medium text-slate-900 text-sm placeholder:text-slate-300"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default DemoBookingModal;
