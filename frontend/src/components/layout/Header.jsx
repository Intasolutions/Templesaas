import { Bell, Search, Menu } from "lucide-react";
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
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-white/50 hover:text-primary transition-colors transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Only show title on mobile or if simplified layout needed */}
                <div className="md:hidden">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
                </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {/* Search Bar */}
                <div className="hidden md:flex relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder', 'Search anything...')}
                        className="h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none w-64 text-sm transition-all"
                    />
                </div>

                <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

                <LanguageSwitcher />

                <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 h-2 w-2 bg-slate-900 rounded-full ring-2 ring-white"></span>
                </button>

                <Link to="/profile" className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors overflow-hidden flex items-center justify-center">
                    {tenant?.logo ? (
                        <img src={resolveFileUrl(tenant.logo)} alt="User" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-black text-slate-500">
                            {user?.username?.substring(0, 1).toUpperCase() || tenant?.name?.substring(0, 1).toUpperCase() || 'SA'}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
