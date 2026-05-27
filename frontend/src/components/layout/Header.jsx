import { Bell, Search, Menu, Sparkles } from "lucide-react";
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../shared/api/client';

const resolveFileUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const base = api.defaults.baseURL?.replace(/\/api\/?$/, '') || '';
    return `${base}${url}`;
};

export default function Header({ title, onMenuClick }) {
    const { t } = useTranslation();
    const { tenant, user } = useAuth();
    
    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div className="flex flex-col">
                    <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">{title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Operational</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
                {/* Search Bar */}
                <div className="hidden md:flex relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder', 'Search everything...')}
                        className="h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-100 focus:ring-4 focus:ring-primary/5 outline-none w-80 text-sm font-semibold transition-all"
                    />
                </div>

                <div className="h-8 w-[1.5px] bg-slate-100 mx-2 hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />

                    <button className="relative h-12 w-12 flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                        <Bell size={22} />
                        <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-primary rounded-full ring-4 ring-white"></span>
                    </button>

                    <Link to="/settings" className="flex items-center gap-3 p-1.5 pr-5 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                        <div className="h-10 w-10 rounded-[14px] bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-all">
                            {tenant?.logo ? (
                                <img src={resolveFileUrl(tenant.logo)} alt="User" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-xs font-black text-slate-500">
                                    {user?.username?.substring(0, 1).toUpperCase() || tenant?.name?.substring(0, 1).toUpperCase() || 'SA'}
                                </span>
                            )}
                        </div>
                        <div className="hidden lg:flex flex-col text-left">
                            <span className="text-sm font-bold text-slate-900 leading-none">{user?.username || 'Administrator'}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Account</span>
                        </div>
                    </Link>
                </div>
            </div>

        </header>
    );
}

