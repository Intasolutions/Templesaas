import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    AlertCircle, 
    XCircle, 
    Info, 
    X,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import { useNotificationInternal } from '../../context/NotificationContext';

export default function NotificationSystem() {
    const { toasts, confirmDialog, removeToast } = useNotificationInternal();

    return (
        <>
            {/* Toasts Container */}
            <div className="fixed top-6 right-6 z-[2000] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmDialog && (
                    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={confirmDialog.onCancel}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-slate-100"
                        >
                            <div className="p-8">
                                <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6 border border-amber-100">
                                    <AlertTriangle size={28} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{confirmDialog.title}</h2>
                                <p className="text-slate-500 leading-relaxed font-medium">{confirmDialog.message}</p>
                            </div>
                            
                            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
                                <button
                                    onClick={confirmDialog.onCancel}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    {confirmDialog.cancelText}
                                </button>
                                <button
                                    onClick={confirmDialog.onConfirm}
                                    className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
                                >
                                    {confirmDialog.confirmText} <ArrowRight size={16} className="opacity-50" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

function Toast({ toast, onRemove }) {
    const config = {
        success: {
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100/50',
            accent: 'bg-emerald-500',
            label: 'Success'
        },
        error: {
            icon: XCircle,
            color: 'text-rose-500',
            bg: 'bg-rose-50',
            border: 'border-rose-100/50',
            accent: 'bg-rose-500',
            label: 'Error'
        },
        warn: {
            icon: AlertCircle,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            border: 'border-amber-100/50',
            accent: 'bg-amber-500',
            label: 'Warning'
        },
        info: {
            icon: Info,
            color: 'text-primary',
            bg: 'bg-slate-50',
            border: 'border-slate-100/50',
            accent: 'bg-primary',
            label: 'Update'
        }
    }[toast.type] || config.info;

    const Icon = config.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto relative overflow-hidden group flex items-start gap-4 p-4 rounded-2xl bg-white border ${config.border} shadow-2xl shadow-slate-200/40 backdrop-blur-xl`}
        >
            <div className={`shrink-0 h-10 w-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center border border-current/10`}>
                <Icon size={20} />
            </div>
            
            <div className="flex-1 pt-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">{config.label}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{toast.message}</p>
            </div>

            <button 
                onClick={onRemove}
                className="shrink-0 h-8 w-8 rounded-lg hover:bg-slate-50 text-slate-300 hover:text-slate-500 transition-colors flex items-center justify-center"
            >
                <X size={16} />
            </button>

            {/* Progress Bar */}
            <motion.div 
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${config.accent} opacity-20`}
            />
        </motion.div>
    );
}
