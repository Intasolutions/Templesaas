import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    User, Lock, Phone, Mail, Building2, MapPin, 
    Sparkles, ShieldCheck, Zap, ArrowRight, Globe, AlertCircle,
    CheckCircle2, Send, Copy, ExternalLink, PartyPopper, Eye, EyeOff
} from 'lucide-react';
import api from '../../shared/api/client';
import MarketingLayout from '../landing/MarketingLayout';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('temple') || '';
        const autoSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
        
        return {
            templeName: name,
            subdomain: autoSlug,
            adminName: params.get('name') || '',
            email: params.get('email') || '',
            phone: '',
            location: '',
            password: '',
            isTrial: params.get('is_trial') === 'true' || !!params.get('email'), 
            plan: params.get('plan') || 'PRO', 
        };
    });

    const [isSubdomainManual, setIsSubdomainManual] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState(15);
    const [finalSubdomain, setFinalSubdomain] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        let timer;
        if (isSuccess && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (isSuccess && countdown === 0) {
            const dashboardLink = getDashboardLink(finalSubdomain);
            window.location.href = dashboardLink;
        }
        return () => clearInterval(timer);
    }, [isSuccess, countdown, finalSubdomain]);

    const getDashboardLink = (sub) => {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `http://${sub}.localhost:3000/dashboard`;
        }
        return `https://${sub}.templesaas.in/dashboard`;
    };

    const handleCopyLink = () => {
        const link = getDashboardLink(finalSubdomain);
        navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleTempleNameChange = (e) => {
        const name = e.target.value;
        const autoSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
        setFormData(f => ({
            ...f,
            templeName: name,
            subdomain: isSubdomainManual ? f.subdomain : autoSlug,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setErrors({});
        setIsLoading(true);

        try {
            const res = await api.post('/users/signup/', {
                temple_name: formData.templeName,
                subdomain: formData.subdomain,
                email: formData.email,
                password: formData.password,
                admin_name: formData.adminName,
                phone: formData.phone,
                location: formData.location,
                is_trial: formData.isTrial,
                plan_name: formData.plan,
            });

            const { access, tenant } = res.data;
            if (access) localStorage.setItem('token', access);
            setFinalSubdomain(tenant.subdomain);
            setIsSuccess(true);
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
        <MarketingLayout>
            <div className="min-h-screen pt-32 pb-24 bg-cream relative overflow-hidden font-sans">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(230,81,0,0.03),transparent)]" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        
                        {/* Left Side: Branding Content */}
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                                    <Zap size={16} className="text-primary animate-pulse" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Launch Your Digital Temple</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-wood tracking-tight leading-[0.95] mb-8">
                                    Start Your <br />
                                    <span className="text-primary">Heritage Journey.</span>
                                </h1>
                                <p className="text-lg text-wood/60 font-medium mb-12 leading-relaxed">
                                    Join 500+ temples using TempleSaaS to manage their traditions with modern precision. 
                                    Everything you need is just one form away.
                                </p>

                                <div className="space-y-8">
                                    <BenefitItem icon={ShieldCheck} title="Verified Security" desc="Bank-grade encryption for all your temple's financial and devotee records." />
                                    <BenefitItem icon={Sparkles} title="Smart Automation" desc="Automate pooja timings, receipts, and staff attendance in seconds." />
                                    <BenefitItem icon={CheckCircle2} title="Instant Activation" desc="Your dedicated workspace will be ready immediately after signup." />
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Professional Form */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-wood/5 relative">
                                <AnimatePresence mode="wait">
                                    {!isSuccess ? (
                                        <motion.div
                                            key="signup-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <div className="mb-10">
                                                <h3 className="text-2xl font-black text-wood uppercase tracking-tight mb-2">Register Your Temple</h3>
                                                <p className="text-sm font-medium text-wood/40">Enter your official details to establish your workspace.</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <AnimatePresence>
                                                    {errors.non_field && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                            className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
                                                        >
                                                            <AlertCircle size={16} className="text-red-500" />
                                                            <span className="text-xs font-bold text-red-900 uppercase tracking-widest">{errors.non_field}</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <FormField 
                                                            label="Temple Name" 
                                                            icon={Building2} 
                                                            placeholder="Mahadeva Temple" 
                                                            value={formData.templeName} 
                                                            onChange={handleTempleNameChange} 
                                                            error={errors.templeName}
                                                        />
                                                        <div className="ml-1">
                                                            <p className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                                                <Globe size={10} />
                                                                Workspace: <span className="text-wood lowercase">{formData.subdomain || '...'}</span>.templesaas.in
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <FormField 
                                                        label="Admin Full Name" 
                                                        icon={User} 
                                                        placeholder="John Doe" 
                                                        value={formData.adminName} 
                                                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} 
                                                        error={errors.adminName}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField 
                                                        label="Admin Email" 
                                                        icon={Mail} 
                                                        type="email"
                                                        placeholder="admin@temple.com" 
                                                        value={formData.email} 
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                                        error={errors.email}
                                                    />
                                                    <FormField 
                                                        label="Contact Phone" 
                                                        icon={Phone} 
                                                        placeholder="+91 XXXX XXX XXX" 
                                                        value={formData.phone} 
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                                        error={errors.phone}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField 
                                                        label="Secure Password" 
                                                        icon={Lock} 
                                                        type="password"
                                                        placeholder="••••••••" 
                                                        value={formData.password} 
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                                        error={errors.password}
                                                    />
                                                    <FormField 
                                                        label="Temple Location (City, State)" 
                                                        icon={MapPin} 
                                                        placeholder="Trivandrum, Kerala" 
                                                        value={formData.location} 
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                                                        error={errors.location}
                                                    />
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    <label className="text-[10px] font-bold text-wood/40 uppercase tracking-widest ml-1">Select Starting Plan</label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {['LITE', 'PRO', 'MAX'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => setFormData({...formData, plan: p})}
                                                                className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                                                    formData.plan === p 
                                                                    ? 'bg-wood text-white border-wood shadow-lg' 
                                                                    : 'bg-cream/50 text-wood/40 border-transparent hover:border-wood/10'
                                                                }`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full h-16 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3 mt-8 active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {isLoading ? (
                                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            Establish Workspace <ArrowRight size={18} />
                                                        </>
                                                    )}
                                                </button>

                                                <div className="text-center pt-4">
                                                    <p className="text-[10px] font-bold text-wood/30 uppercase tracking-widest">
                                                        Already registered? <a href="/login" className="text-primary hover:underline">Log In</a>
                                                    </p>
                                                </div>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success-message"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-10"
                                        >
                                            <div className="mb-8 flex justify-center">
                                                <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 shadow-sm border border-green-100">
                                                    <PartyPopper size={48} className="animate-bounce" />
                                                </div>
                                            </div>

                                            <h3 className="text-3xl font-black text-wood uppercase tracking-tight mb-4">Temple Established!</h3>
                                            <p className="text-base font-medium text-wood/60 mb-10 max-w-sm mx-auto">
                                                Your digital heritage workspace is ready. We're setting up your sanctuary...
                                            </p>

                                            <div className="bg-cream/50 rounded-3xl p-6 mb-10 border border-wood/5 group relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                                <p className="text-[10px] font-bold text-wood/40 uppercase tracking-widest text-left mb-3 ml-1">Your Workspace URL</p>
                                                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-wood/5">
                                                    <Globe size={18} className="text-primary/40" />
                                                    <span className="flex-1 text-sm font-black text-wood truncate text-left">
                                                        {getDashboardLink(finalSubdomain).replace('http://', '').replace('https://', '')}
                                                    </span>
                                                    <button 
                                                        onClick={handleCopyLink}
                                                        className={`p-2 rounded-xl transition-all ${isCopied ? 'bg-green-500 text-white' : 'hover:bg-cream text-wood/40 hover:text-primary'}`}
                                                    >
                                                        {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg text-primary bg-primary/5">
                                                                Redirecting in {countdown}s
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-primary/5">
                                                        <motion.div 
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: `${(15 - countdown) / 15 * 100}%` }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => window.location.href = getDashboardLink(finalSubdomain)}
                                                    className="w-full h-16 bg-wood text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 group"
                                                >
                                                    Enter Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
};

function FormField({ label, icon: Icon, type = "text", placeholder, value, onChange, error }) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-wood/40 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-wood/20 group-focus-within:text-primary transition-colors">
                    <Icon size={18} />
                </div>
                <input
                    type={inputType}
                    required
                    className={`w-full h-14 pl-14 ${isPassword ? 'pr-12' : 'pr-5'} rounded-2xl bg-cream/50 border ${error ? 'border-red-500' : 'border-wood/5'} focus:bg-white focus:border-primary/20 transition-all outline-none font-bold text-wood text-sm placeholder:text-wood/20`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
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
            {error && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{error}</p>}
        </div>
    );
}

function BenefitItem({ icon: Icon, title, desc }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-wood/5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-base font-black text-wood uppercase tracking-tight mb-1">{title}</h4>
                <p className="text-[13px] text-wood/50 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default SignUpPage;
