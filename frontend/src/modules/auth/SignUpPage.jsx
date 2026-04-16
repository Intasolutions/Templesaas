import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Building2, Globe, Mail, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../shared/api/client';

const SignUpPage = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('temple') || '';
        const autoSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
        
        return {
            templeName: name,
            subdomain: autoSlug,
            adminName: params.get('name') || '',
            email: params.get('email') || '',
            password: '',
            isTrial: !!params.get('email'), 
            plan: params.get('plan') || 'LITE', // Default to LITE if none provided
        };
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Auto-generate subdomain slug from temple name (only fills if user hasn't typed one)
    const handleTempleNameChange = (e) => {
        const name = e.target.value;
        const autoSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
        setFormData(f => ({
            ...f,
            templeName: name,
            subdomain: f.subdomain ? f.subdomain : autoSlug,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (step === 1) {
            const stepErrors = {};
            if (!formData.templeName.trim()) stepErrors.templeName = 'Temple name is required.';
            if (!formData.subdomain.trim()) stepErrors.subdomain = 'Workspace URL is required.';
            else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) stepErrors.subdomain = 'Only lowercase letters, numbers, and hyphens allowed.';
            if (Object.keys(stepErrors).length) { setErrors(stepErrors); return; }
            setStep(2);
            return;
        }

        // Step 2 — real backend call
        setIsLoading(true);
        try {
            const res = await api.post('/users/signup/', {
                temple_name: formData.templeName,
                subdomain: formData.subdomain,
                email: formData.email,
                password: formData.password,
                admin_name: formData.adminName,
                is_trial: formData.isTrial,
                plan_name: formData.plan, // Send the selected plan
            });

            const { token } = res.data;
            if (token) localStorage.setItem('token', token);
            // Hard redirect so AuthContext re-initialises with the new token
            window.location.href = '/dashboard';
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ non_field: 'Something went wrong. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] relative z-10"
            >
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2].map(s => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-amber-500' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl shadow-lg mb-6 transform -rotate-6">
                            🚩
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                            {step === 1 ? 'Your Temple Details' : 'Create Admin Account'}
                        </h2>
                        <p className="text-slate-400 font-medium text-sm">
                            {step === 1 ? 'Set up your unique workspace identity.' : 'Secure credentials for the temple admin.'}
                        </p>
                    </div>

                    {/* Global / non-field error */}
                    <AnimatePresence>
                        {errors.non_field && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
                            >
                                <AlertCircle size={16} className="text-red-400 shrink-0" />
                                <span className="text-sm font-semibold text-red-300">{errors.non_field}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                <FormField
                                    label="Temple Name"
                                    icon={Building2}
                                    type="text"
                                    placeholder="e.g. Mahadeva Temple"
                                    value={formData.templeName}
                                    onChange={handleTempleNameChange}
                                    error={errors.templeName}
                                    required
                                />

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Workspace URL</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-amber-500">
                                            <Globe size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className={`w-full h-14 pl-12 pr-36 rounded-2xl bg-slate-900/50 border ${errors.subdomain ? 'border-red-500' : 'border-slate-700'} focus:border-amber-500 outline-none font-bold text-white placeholder-slate-600`}
                                            placeholder="my-temple"
                                            value={formData.subdomain}
                                            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                        />
                                        <div className="absolute inset-y-0 right-4 flex items-center text-slate-500 font-bold text-xs">.templesaas.in</div>
                                    </div>
                                    {errors.subdomain && <p className="text-xs text-red-400 ml-1 font-semibold">{errors.subdomain}</p>}
                                </div>

                                <button type="submit" className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group mt-2">
                                    Next Step <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        ) : (
                            <>
                                <FormField label="Your Full Name (Admin)" icon={User} type="text" placeholder="e.g. Ramesh Kumar" value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} error={errors.adminName} />
                                <FormField label="Admin Email" icon={Mail} type="email" placeholder="admin@temple.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} required />
                                <FormField label="Password (min 8 chars)" icon={Lock} type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} required />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 mt-2"
                                >
                                    {isLoading
                                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <><Sparkles size={18} /> Launch Your Temple Platform</>
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setErrors({}); }}
                                    className="w-full text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    ← Back to Temple Details
                                </button>
                            </>
                        )}
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Already have an account?</p>
                        <a href="/login" className="text-amber-500 font-black hover:text-amber-400 transition-colors mt-1 inline-block">Sign In Instead</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

function FormField({ label, icon: Icon, type, placeholder, value, onChange, error, required }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-amber-500">
                    <Icon size={18} />
                </div>
                <input
                    type={type}
                    required={required}
                    className={`w-full h-14 pl-12 pr-5 rounded-2xl bg-slate-900/50 border ${error ? 'border-red-500' : 'border-slate-700'} focus:border-amber-500 outline-none font-bold text-white placeholder-slate-600`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
            {error && <p className="text-xs text-red-400 ml-1 font-semibold">{error}</p>}
        </div>
    );
}

export default SignUpPage;
