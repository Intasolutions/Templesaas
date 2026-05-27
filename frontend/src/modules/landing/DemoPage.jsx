import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    X, Calendar, Phone, Mail, MapPin, Building2, Send, 
    CheckCircle2, User, Sparkles, ArrowLeft, ShieldCheck, 
    Zap, HeartHandshake, Monitor, ArrowRight, Globe, Eye, EyeOff
} from 'lucide-react';
import api from '../../shared/api/client';
import { useAuth } from '../../context/AuthContext';
import MarketingLayout from './MarketingLayout';

const DemoPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, tenant, loading } = useAuth();
    const plans = [
        { id: 'LITE', name: 'Lite Plan', desc: 'Simple counter software' },
        { id: 'PRO', name: 'Pro Heritage', desc: 'Full pooja & financial audit' },
        { id: 'MAX', name: 'Ultimate Devaswom', desc: 'Multi-temple board control' },
    ];
    const [formData, setFormData] = useState({
        full_name: '',
        temple_name: '',
        phone: '',
        email: '',
        password: '',
        location: '',
        message: '',
        interested_plan: 'PRO'
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');
        if (plan && ['LITE', 'PRO', 'MAX'].includes(plan.toUpperCase())) {
            setFormData(prev => ({ ...prev, interested_plan: plan.toUpperCase() }));
        }
    }, []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && isAuthenticated) {
            // Check if restricted status
            const restrictedStatuses = ['approved', 'pending_approval', 'expired', 'suspended'];
            if (restrictedStatuses.includes(tenant?.status)) {
                navigate('/billing');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, loading, tenant, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // First log the lead
            await api.post('/leads/', { ...formData, trial_requested: true });
            
            // Auto generate slug
            const autoSlug = formData.temple_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
            
            try {
                // Auto provision the tenant
                const res = await api.post('/users/signup/', {
                    temple_name: formData.temple_name,
                    subdomain: autoSlug,
                    email: formData.email,
                    password: formData.password,
                    admin_name: formData.full_name,
                    is_trial: true,
                    plan_name: formData.interested_plan,
                });

                // login directly
                const { access } = res.data;
                if (access) {
                    localStorage.setItem('token', access);
                    // Hard redirect to dashboard
                    window.location.href = '/dashboard';
                    return; // Prevent further execution to allow redirect
                }
            } catch (signupErr) {
                console.error("Auto signup failed", signupErr);
                // Fallback to success UI if signup fails (e.g. email or subdomain exists)
                // They can try again later from the normal signup or login page.
            }

            setIsSuccess(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-xs font-bold text-wood/40 uppercase tracking-widest">Checking Protocol...</p>
                </div>
            </div>
        );
    }

    return (
        <MarketingLayout>
            <section className="min-h-screen pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.04),transparent)]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* Left Side: Content */}
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                                    <Sparkles size={16} className="text-primary" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Experience the Future</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-wood tracking-tight leading-[0.95] mb-8">
                                    See how it works <br />
                                    <span className="text-primary">In Real-Time.</span>
                                </h1>
                                <p className="text-lg text-wood/60 font-medium mb-12 leading-relaxed">
                                    Our team will give you a personalized walkthrough of TempleSaaS. See how we can transform your temple administration, pooja bookings, and financial auditing.
                                </p>

                                <div className="space-y-8">
                                    <BenefitItem icon={ShieldCheck} title="100% Transparent" desc="See how our audit logs prevent errors and build trust with the committee." />
                                    <BenefitItem icon={Zap} title="Instant Setup" desc="We'll show you how to get your temple online in less than 24 hours." />
                                    <BenefitItem icon={HeartHandshake} title="Local Support" desc="Learn about our dedicated support team that understands your traditions." />
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Form */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-wood/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 text-primary rotate-12"><Monitor size={120} /></div>
                                
                                <AnimatePresence mode="wait">
                                    {!isSuccess ? (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="mb-10">
                                                <h3 className="text-2xl font-black text-wood uppercase tracking-tight mb-2">Schedule Your Demo</h3>
                                                <p className="text-sm font-medium text-wood/40">Fill in the details and we'll reach out shortly.</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <SimpleInput label="Full Name" placeholder="John Doe" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} />
                                                    <div className="space-y-2">
                                                        <SimpleInput label="Temple Name" placeholder="Heritage Temple" value={formData.temple_name} onChange={(v) => setFormData({...formData, temple_name: v})} />
                                                        <div className="ml-1">
                                                            <p className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                                                <Globe size={10} />
                                                                Workspace: <span className="text-wood lowercase">{formData.temple_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || '...'}</span>.templesaas.in
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <SimpleInput label="Phone Number" placeholder="+91 XXXX XXX XXX" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                                                    <SimpleInput label="Email Address" type="email" placeholder="email@example.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <SimpleInput label="Temple Location" placeholder="City, State" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
                                                    <SimpleInput label="Set Password" type="password" placeholder="••••••••" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} />
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-wood/40 uppercase tracking-widest ml-1">Interested Plan</label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {['LITE', 'PRO', 'MAX'].map(plan => (
                                                            <button
                                                                key={plan}
                                                                type="button"
                                                                onClick={() => setFormData({...formData, interested_plan: plan})}
                                                                className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                                    formData.interested_plan === plan 
                                                                    ? 'bg-wood text-white border-wood' 
                                                                    : 'bg-cream/50 text-wood/40 border-transparent hover:border-wood/10'
                                                                }`}
                                                            >
                                                                {plan}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mt-8 active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {isSubmitting ? 'Processing...' : 'Send Request'}
                                                    {!isSubmitting && <Send size={18} />}
                                                </button>
                                            </form>
                                            {error && <p className="mt-4 text-center text-[10px] font-bold uppercase text-red-500 tracking-widest">{error}</p>}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-10"
                                        >
                                            <div className="h-24 w-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                                                <CheckCircle2 size={48} />
                                            </div>
                                            <h3 className="text-3xl font-black text-wood uppercase tracking-tight mb-4">Request Sent!</h3>
                                            <p className="text-lg text-wood/60 font-medium mb-10 leading-relaxed">
                                                One of our specialists will call you within 24 hours. 
                                                <br />
                                                <span className="text-sm opacity-60">Can't wait? Start your 3-day free trial immediately.</span>
                                            </p>
                                            <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                                <button
                                                    onClick={() => {
                                                        const params = new URLSearchParams();
                                                        params.set('temple', formData.temple_name);
                                                        params.set('email', formData.email);
                                                        params.set('name', formData.full_name);
                                                        params.set('plan', formData.interested_plan);
                                                        params.set('is_trial', 'true');
                                                        navigate(`/signup?${params.toString()}`);
                                                    }}
                                                    className="h-16 px-10 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                                                >
                                                    Launch 3-Day Trial Now <ArrowRight size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate('/')}
                                                    className="h-14 px-10 bg-wood/5 text-wood/40 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-wood/10 transition-all"
                                                >
                                                    Back to Home
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

function SimpleInput({ label, placeholder, value, onChange, type = "text" }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-wood/40 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <input
                    type={inputType}
                    required
                    className={`w-full h-14 pl-5 ${isPassword ? 'pr-12' : 'pr-5'} rounded-2xl bg-cream/50 border border-wood/5 focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-wood text-sm placeholder:text-wood/20`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-wood/20 hover:text-primary transition-colors px-2"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}

function BenefitItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-wood/5 group-hover:bg-primary group-hover:text-white transition-all">
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-base font-black text-wood uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-[13px] text-wood/50 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default DemoPage;
