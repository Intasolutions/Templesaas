import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Printer, ArrowRight, Home, Download, Zap } from 'lucide-react';
import api from '../../shared/api/client';
import { useTranslation } from 'react-i18next';

const BookingSuccessPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookingId = searchParams.get('id');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookingId) {
            api.get(`/bookings/${bookingId}/`)
                .then(res => setBooking(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [bookingId]);

    const printReceipt = () => {
        window.open(`${api.defaults.baseURL}/bookings/${bookingId}/pdf/`, '_blank');
    };

    const printPoochariSlip = () => {
        window.open(`${api.defaults.baseURL}/bookings/${bookingId}/poochari-pdf/`, '_blank');
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-slate-200 border-t-slate-900 rounded-full" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-20 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden"
            >
                <div className="bg-slate-900 p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10"><CheckCircle2 size={120} className="text-emerald-400" /></div>
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="h-24 w-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40"
                    >
                        <CheckCircle2 size={48} className="text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase leading-none mb-4">Protocol Success</h1>
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.4em]">Ritual Registry Updated Successfully</p>
                </div>

                <div className="p-16 space-y-12">
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Registry ID</label>
                            <p className="text-xl font-bold text-slate-900">#{booking?.receipt_no || booking?.id}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Timestamp</label>
                            <p className="text-xl font-bold text-slate-900">{booking?.booking_date}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Authorized Ritual</label>
                            <p className="text-xl font-bold text-slate-900 uppercase tracking-tight">{booking?.pooja_name || 'Ritual Service'}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Devotee Identifier</label>
                            <p className="text-xl font-bold text-slate-900">{booking?.devotee_name}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Astral Node (Nakshatra)</label>
                            <p className="text-xl font-bold text-slate-900">{booking?.devotee_nakshatra || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PrintButton 
                            title="Devotee Receipt" 
                            desc="Official transaction record" 
                            icon={<Download size={20} />} 
                            onClick={printReceipt}
                            color="slate"
                        />
                        <PrintButton 
                            title="Poochari Slip" 
                            desc="Priest ritual authorization" 
                            icon={<Printer size={20} />} 
                            onClick={printPoochariSlip}
                            color="emerald"
                        />
                    </div>
                </div>

                <div className="p-10 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <button 
                        onClick={() => navigate('/bookings')}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                        <Home size={14} /> Return to Master Schedule
                    </button>
                    <button 
                        onClick={() => navigate('/pooja/book')}
                        className="h-12 px-8 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-900/20"
                    >
                        New Authorization <ArrowRight size={14} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

function PrintButton({ title, desc, icon, onClick, color }) {
    const colors = {
        slate: "bg-slate-50 border-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white"
    };

    return (
        <button 
            onClick={onClick}
            className={`p-8 rounded-3xl border text-left transition-all group relative overflow-hidden ${colors[color]}`}
        >
            <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center mb-4 border border-current/10 transition-colors group-hover:bg-white/20">
                    {icon}
                </div>
                <h4 className="font-bold text-lg tracking-tight mb-1 uppercase">{title}</h4>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{desc}</p>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-all group-hover:scale-125">
                {icon}
            </div>
        </button>
    );
}

export default BookingSuccessPage;
