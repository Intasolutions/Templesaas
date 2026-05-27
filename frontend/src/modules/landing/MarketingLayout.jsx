import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Layers, Menu, X, ArrowRight,
    Shield, Globe, Sparkles, Database, Users, Building2,
    Lock, BookOpen, BarChart3, Clock, Zap, Monitor, Package,
    HeartHandshake, ScrollText, Truck, Banknote, FileText
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MarketingLayout({ children }) {
    const navigate = useNavigate();
    const { isAuthenticated, tenant } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDemo = () => {
        if (isAuthenticated) {
            const restrictedStatuses = ['approved', 'pending_approval', 'expired', 'suspended'];
            if (restrictedStatuses.includes(tenant?.status)) {
                navigate('/billing');
            } else {
                navigate('/dashboard');
            }
        } else {
            navigate('/demo');
        }
    };

    const navItems = [
        {
            label: 'Main Features', dropdown: [
                { title: 'Pooja Bookings', path: '/products/vazhipadu', icon: Zap },
                { title: 'Accounts & Hundi', path: '/products/analytics', icon: Banknote },
                { title: 'Devotee Records', path: '/products/crm', icon: HeartHandshake },
                { title: 'TV Screens', path: '/products/signage', icon: Monitor },
                { title: 'Send Prasadam', path: '/products/shipping', icon: Truck }
            ]
        },
        {
            label: 'Other Tools', dropdown: [
                { title: 'Stock & Store', path: '/solutions/management', icon: Package },
                { title: 'Mass Feeding', path: '/solutions/staff', icon: Clock },
                { title: 'Festival Events', path: '/solutions/events', icon: Layers },
                { title: 'Global Delivery', path: '/solutions/shipping', icon: Globe }
            ]
        },
        { label: 'Pricing', path: '/pricing' },
        {
            label: 'Modules', dropdown: [
                { title: 'Pooja & Rituals', path: '/project-report', icon: Zap },
                { title: 'Finance & Audit', path: '/project-report', icon: BarChart3 },
                { title: 'Logistics & Stock', path: '/project-report', icon: Package },
                { title: 'Full Report', path: '/project-report', icon: FileText }
            ]
        },
        {
            label: 'Help', dropdown: [
                { title: 'User Guides', path: '/docs', icon: BookOpen },
                { title: 'Safe & Secure', path: '/solutions/security', icon: Shield }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-cream font-sans text-wood selection:bg-primary/20">
            {/* ── Navigation ────────────────────────── */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-md h-20 border-b border-wood/5 shadow-sm' : 'bg-transparent h-28'}`}>
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                                <Sparkles size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-tight text-wood leading-none">{tenant?.name || 'TempleSaaS'}</span>
                                <span className="text-[9px] font-bold tracking-widest text-primary uppercase mt-0.5">{tenant ? 'Temple Workspace' : 'Management Software'}</span>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navItems.map((item) => (
                                <div key={item.label} className="relative py-2" onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                                    <button
                                        onClick={() => !item.dropdown && navigate(item.path)}
                                        className="flex items-center gap-1 text-[13px] font-bold text-wood/60 hover:text-primary transition-all uppercase tracking-wider"
                                    >
                                        {item.label}
                                        {item.dropdown && <ChevronDown size={14} className="opacity-40" />}
                                    </button>

                                    <AnimatePresence>
                                        {activeDropdown === item.label && item.dropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-wood/5 p-3 mt-2"
                                            >
                                                {item.dropdown.map((sub) => (
                                                    <div
                                                        key={sub.title}
                                                        onClick={() => { navigate(sub.path); setActiveDropdown(null); }}
                                                        className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-cream transition-all cursor-pointer group/item"
                                                    >
                                                        <div className="h-9 w-9 rounded-lg bg-cream flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                                            <sub.icon size={16} />
                                                        </div>
                                                        <span className="text-[13px] font-bold text-wood/70 group-hover/item:text-wood tracking-tight">{sub.title}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        <button onClick={() => navigate('/login')} className="text-[13px] font-bold text-wood/60 hover:text-primary px-4 py-2 uppercase tracking-wider">Login</button>
                        <button 
                            onClick={handleDemo} 
                            className="h-11 px-7 bg-wood text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-md active:scale-95"
                        >
                            Get Demo
                        </button>
                    </div>

                    <button className="lg:hidden p-2 rounded-lg bg-white border border-wood/10 text-wood" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[60] bg-white p-8 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-lg font-black text-wood">{tenant?.name || 'TempleSaaS'}</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2"><X size={24} /></button>
                        </div>
                        <div className="space-y-10">
                            {navItems.map(item => (
                                <div key={item.label} className="space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{item.label}</p>
                                    <div className="space-y-4 pl-2">
                                        {item.dropdown ? item.dropdown.map(sub => (
                                            <div key={sub.title} onClick={() => { navigate(sub.path); setIsMenuOpen(false); }} className="text-lg font-bold text-wood/80">{sub.title}</div>
                                        )) : <div onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="text-lg font-bold text-wood/80">{item.label}</div>}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-8 space-y-4">
                                <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full h-14 rounded-2xl border border-wood/10 font-bold text-wood">Login</button>
                                <button onClick={() => { handleDemo(); setIsMenuOpen(false); }} className="w-full h-14 rounded-2xl bg-primary font-bold text-white shadow-lg shadow-primary/20">Book Demo</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="relative">{children}</main>

            {/* Footer */}
            <footer className="bg-wood py-24 text-white/90">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                    <Sparkles size={20} />
                                </div>
                                <span className="text-xl font-black tracking-tight uppercase">{tenant?.name || 'TempleSaaS'}</span>
                            </div>
                            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
                                Making temple management simple and clear. The trusted software for modern temple committees.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.3em]">Main Links</h4>
                            <ul className="space-y-5 text-[13px] font-bold text-white/60">
                                <li><button onClick={() => navigate('/products/vazhipadu')} className="hover:text-primary transition-all">Pooja Bookings</button></li>
                                <li><button onClick={() => navigate('/products/analytics')} className="hover:text-primary transition-all">Accounts & Hundi</button></li>
                                <li><button onClick={() => navigate('/pricing')} className="hover:text-primary transition-all">Pricing</button></li>
                                <li><button onClick={() => navigate('/project-report')} className="hover:text-primary transition-all">Project Report</button></li>
                                <li><button onClick={() => navigate('/docs')} className="hover:text-primary transition-all">User Guides</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.3em]">Trust & Legal</h4>
                            <ul className="space-y-5 text-[13px] font-bold text-white/60">
                                <li><button onClick={() => navigate('/solutions/security')} className="hover:text-primary transition-all">Safety & Security</button></li>
                                <li><button onClick={() => navigate('/terms')} className="hover:text-primary transition-all">Terms of Use</button></li>
                                <li><button onClick={() => navigate('/privacy')} className="hover:text-primary transition-all">Privacy Policy</button></li>
                                <li><button onClick={() => navigate('/refund-policy')} className="hover:text-primary transition-all">Refund Policy</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-primary mb-8 uppercase tracking-[0.3em]">Contact</h4>
                            <p className="text-sm font-bold text-white/40 mb-2">Need a free demo?</p>
                            <p className="text-lg font-black text-white mb-6">Call +91 98765 43210</p>
                            <button onClick={handleDemo} className="h-12 px-8 bg-primary rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all">Schedule Call</button>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2026 TEMPLESAAS SOFTWARE. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/10" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
