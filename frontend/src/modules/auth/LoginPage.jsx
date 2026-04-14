import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogIn, Award, AlertCircle, Shield, Layers, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [showUpsell, setShowUpsell] = useState(false);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setShowUpsell(false);

        const result = await login({ username, password });
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
            setIsLoading(false);
            // If it's a 401 and the error is about user not existing (heuristic)
            if (result.error.toLowerCase().includes('invalid') || result.error.toLowerCase().includes('found')) {
                setShowUpsell(true);
            }
        }
    };

    const handleSocialLogin = (provider) => {
        if (provider === 'Google') {
            window.location.href = 'http://127.0.0.1:8000/accounts/google/login/';
        } else {
            alert(`${provider} login integration coming soon.`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center justify-center p-6 selection:bg-slate-900 selection:text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />

            <div className="absolute top-10 left-10 hidden md:block">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-bold group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[460px] relative z-10"
            >
                {/* Logo Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-14 w-14 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Layers size={28} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Devalayam <span className="text-slate-400">Pro</span></h1>
                    <p className="text-slate-400 font-semibold mt-2 uppercase tracking-[0.15em] text-[10px]">Institutional Administration Node</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] relative">
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 overflow-hidden"
                            >
                                <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-center gap-4">
                                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                        <AlertCircle size={16} />
                                    </div>
                                    <span className="text-[11px] font-bold text-red-900 uppercase tracking-widest">{error}</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Registry Identity</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full h-15 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-sm placeholder:text-slate-300 placeholder:font-medium"
                                    value={username}
                                    placeholder="Username or CID"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                             <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Security Clearance</label>
                                <button type="button" className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full h-15 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-slate-900 text-sm placeholder:text-slate-300"
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-15 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-70 !mt-10"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Establish Secure Link</span>
                                    <LogIn size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
                        <div className="h-[1px] flex-1 bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Continue With</span>
                        <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleSocialLogin('Google')}
                            className="h-14 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all flex items-center justify-center gap-3 group"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Google</span>
                        </button>
                        <button 
                            onClick={() => handleSocialLogin('Microsoft')}
                            className="h-14 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all flex items-center justify-center gap-3 group"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Microsoft" />
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Outlook</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {showUpsell && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4"
                            >
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 group">
                                    <p className="text-[11px] font-bold text-indigo-900 leading-relaxed mb-4">
                                        We couldn't detect your Temple in the global registry. Ready to join the future of Heritage Management?
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => navigate('/signup')}
                                            className="w-full h-10 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            Register Temple <Award size={14} />
                                        </button>
                                        <button 
                                            onClick={() => navigate('/pricing')}
                                            className="w-full h-10 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all"
                                        >
                                            Check Pricing Plans
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
                         <Shield size={12} className="text-emerald-500" /> Heritage-Grade Encryption
                    </p>
                    <div className="flex gap-2 opacity-30">
                        <div className="h-1 w-6 rounded-full bg-slate-400" />
                        <div className="h-1 w-1.5 rounded-full bg-slate-400" />
                        <div className="h-1 w-1.5 rounded-full bg-slate-400" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
