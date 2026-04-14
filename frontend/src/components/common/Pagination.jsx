import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ currentPage, totalPages, onPageChange, count, pageSize }) {
    const { t } = useTranslation();
    
    if (totalPages <= 1 && currentPage === 1) return null;

    return (
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-[2rem]">
            <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-500">
                    {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages}
                </span>
                {count > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        {t('showing', 'Showing')} {Math.min(count, (currentPage - 1) * pageSize + 1)}-{Math.min(count, currentPage * pageSize)} {t('of', 'of')} {count} {t('records', 'Records')}
                    </span>
                )}
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                    disabled={currentPage <= 1} 
                    className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all hover:border-primary/30"
                >
                    <ChevronLeft size={16} />
                </button>
                <div className="hidden sm:flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        // Simple page numbers around current page
                        let pageNum = currentPage;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${currentPage === pageNum ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
                <button 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
                    disabled={currentPage >= totalPages} 
                    className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all hover:border-primary/30"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
