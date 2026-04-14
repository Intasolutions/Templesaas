import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Layers, Menu, X, ArrowRight,
    Shield, Globe, Sparkles, Database, Users, Building2,
    Lock, BookOpen, BarChart3, Clock, Zap
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MarketingLayout({ children }) {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        {
            label: 'Products', dropdown: [
                { title: 'Vazhipadu CMS', path: '/products/vazhipadu', icon: Layers },
                { title: 'Ritual Analytics', path: '/products/analytics', icon: BarChart3 },
                { title: 'Panchangam API', path: '/products/panchangam', icon: Globe }
            ]
        },
        {
            label: 'Solutions', dropdown: [
                { title: 'Temple Management', path: '/solutions/management', icon: Building2 },
                { title: 'Devotee CRM', path: '/solutions/crm', icon: Users },
                { title: 'Trust Security', path: '/solutions/security', icon: Lock }
            ]
        },
        { label: 'Pricing', path: '/pricing' },
        {
            label: 'Resources', dropdown: [
                { title: 'Documentation', path: '/docs', icon: BookOpen },
                { title: 'Support Center', path: '/support', icon: Clock }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 overflow-hidden">
            {/* ── Standard SaaS Navigation ────────────────────────── */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md h-16 border-b border-slate-100 shadow-sm' : 'bg-transparent h-24'}`}>
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        {/* Professional Logo */}
                        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                                <Layers size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">Devalayam</span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navItems.map((item) => (
                                <div key={item.label} className="relative py-2" onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                                    <button
                                        onClick={() => !item.dropdown && navigate(item.path)}
                                        className="flex items-center gap-1 text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        {item.label}
                                        {item.dropdown && <ChevronDown size={14} className="opacity-40" />}
                                    </button>

                                    <AnimatePresence>
                                        {activeDropdown === item.label && item.dropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-50 p-3 mt-1"
                                            >
                                                {item.dropdown.map((sub) => (
                                                    <div
                                                        key={sub.title}
                                                        onClick={() => navigate(sub.path)}
                                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                                                    >
                                                        <div className="h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-900">
                                                            <sub.icon size={16} />
                                                        </div>
                                                        <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900">{sub.title}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2">Sign in</button>
                        <button onClick={() => navigate('/login')} className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-black transition-all shadow-sm">Get Started</button>
                    </div>

                    <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            <main>{children}</main>

            <footer className="bg-white border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2.5 mb-6">
                                <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                    <Layers size={16} />
                                </div>
                                <span className="text-lg font-bold">Devalayam</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                The modern infrastructure for temple administration. Precision engineering meets sacred tradition.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li><button onClick={() => navigate('/products/vazhipadu')} className="hover:text-slate-900 transition-colors">Vazhipadu CMS</button></li>
                                <li><button onClick={() => navigate('/products/analytics')} className="hover:text-slate-900 transition-colors">Analytics</button></li>
                                <li><button onClick={() => navigate('/products/panchangam')} className="hover:text-slate-900 transition-colors">Panchangam</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li><button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">About Us</button></li>
                                <li><button onClick={() => navigate('/solutions/security')} className="hover:text-slate-900 transition-colors">Compliance</button></li>
                                <li><button onClick={() => navigate('/solutions/management')} className="hover:text-slate-900 transition-colors">Registry</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li><button onClick={() => navigate('/terms')} className="hover:text-slate-900 transition-colors">Terms of Service</button></li>
                                <li><button onClick={() => navigate('/privacy')} className="hover:text-slate-900 transition-colors">Privacy Policy</button></li>
                                <li><button onClick={() => navigate('/partner')} className="hover:text-slate-900 transition-colors">Partner Policy</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
