import { useState, useEffect } from "react";
import { X, Calendar, DollarSign, Calculator, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../../shared/api/client";
import { motion, AnimatePresence } from "framer-motion";

const SalaryModal = ({ isOpen, onClose, staff, onRefresh }) => {
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (isOpen && staff) {
            calculatePreview();
        } else {
            setPreview(null);
            setStatus(null);
        }
    }, [isOpen, staff, dateRange]);

    const calculatePreview = async () => {
        setLoading(true);
        try {
            // We can reuse the process endpoint with a dry_run flag if we had one, 
            // but for now let's just fetch attendance and calculate locally for preview
            const res = await api.get(`/users/attendance/?user=${staff.user_id}&start=${dateRange.start}&end=${dateRange.end}`);
            const records = res.data.results || res.data || [];
            
            // Filter records for this staff and date range manually if API doesn't filter perfectly
            const filtered = records.filter(r => {
                const rDate = new Date(r.date);
                return r.username === staff.username && rDate >= new Date(dateRange.start) && rDate <= new Date(dateRange.end);
            });

            let total = 0;
            let present = 0;
            let half = 0;

            filtered.forEach(r => {
                if (r.status === "present") {
                    total += parseFloat(staff.daily_wage || 0);
                    present++;
                } else if (r.status === "half_day") {
                    total += parseFloat(staff.daily_wage || 0) / 2;
                    half++;
                }
            });

            setPreview({ total, present, half });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async () => {
        setLoading(true);
        try {
            await api.post("/users/salary/process/", {
                user_id: staff.id,
                start_date: dateRange.start,
                end_date: dateRange.end
            });
            setStatus("success");
            setTimeout(() => {
                onClose();
                if (onRefresh) onRefresh();
            }, 2000);
        } catch (err) {
            setStatus("error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
            >
                <div className="p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                <Calculator size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Salary Protocol</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Processing for {staff.username}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Start</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    <input 
                                        type="date" 
                                        value={dateRange.start}
                                        onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all shadow-inner" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period End</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                    <input 
                                        type="date" 
                                        value={dateRange.end}
                                        onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-primary transition-all shadow-inner" 
                                    />
                                </div>
                            </div>
                        </div>

                        {preview && (
                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5"><DollarSign size={60} /></div>
                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div>
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Estimated Payout</p>
                                        <p className="text-3xl font-black text-white mt-2 tracking-tighter leading-none">₹{preview.total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex flex-col justify-center border-l border-white/10 pl-8">
                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Attendance Vector</p>
                                        <div className="flex gap-4 mt-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-emerald-400">{preview.present}</span>
                                                <span className="text-[7px] font-black text-white/20 uppercase">Full</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-amber-400">{preview.half}</span>
                                                <span className="text-[7px] font-black text-white/20 uppercase">Half</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === "success" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 font-bold text-xs">
                                <CheckCircle2 size={18} /> Protocol Executed: Transaction Logged in Finance.
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-xs">
                                <AlertCircle size={18} /> Uplink Failure: Could not process salary.
                            </motion.div>
                        )}

                        <button 
                            onClick={handleProcess}
                            disabled={loading || !preview || preview.total === 0 || status === "success"}
                            className="w-full h-16 rounded-[1.25rem] bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                            {loading ? "Syncing Logic..." : "Finalize Payout & Log Expense"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SalaryModal;
