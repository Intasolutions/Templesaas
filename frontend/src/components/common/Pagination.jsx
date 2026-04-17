import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ currentPage, totalPages, onPageChange, count, pageSize = 10 }) {
    const { t } = useTranslation();
    
    if (count === 0) return null;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-6">
            <div className="space-y-1 text-center md:text-left">
                <p className="text-xs font-bold text-slate-800 tracking-tight">
                    {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages || 1}
                </p>
                {count > 0 && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {t('showing', 'Showing')} {Math.min(count, (currentPage - 1) * pageSize + 1)}-{Math.min(count, currentPage * pageSize)} {t('of', 'of')} {count} {t('records', 'Records')}
                    </p>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                    disabled={currentPage <= 1} 
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all active:scale-90"
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-black shadow-lg shadow-slate-900/20">
                    {currentPage}
                </div>
                <button 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
                    disabled={currentPage >= totalPages} 
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all active:scale-90"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
