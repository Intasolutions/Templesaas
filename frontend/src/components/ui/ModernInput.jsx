import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * A modern input field with floating label-like behavior, smooth focus states,
 * success/error indicators, and optional character counting.
 */
export default function ModernInput({ 
    label, 
    error, 
    success,
    icon: Icon,
    className,
    containerClassName,
    maxLength,
    value = "",
    ...props 
}) {
    const isError = !!error;
    const isSuccess = !!success && !error;

    return (
        <div className={twMerge("space-y-2 w-full", containerClassName)}>
            <div className="flex justify-between items-end px-1">
                {label && (
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        {label}
                    </label>
                )}
                {maxLength && (
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                        {value.length} / {maxLength}
                    </span>
                )}
            </div>

            <div className="relative group">
                {Icon && (
                    <div className={twMerge(
                        "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                        isError ? "text-rose-400" : isSuccess ? "text-emerald-400" : "text-slate-300 group-focus-within:text-slate-900"
                    )}>
                        <Icon size={18} />
                    </div>
                )}
                
                <input
                    maxLength={maxLength}
                    value={value}
                    className={twMerge(
                        "w-full h-13 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-semibold text-slate-900 outline-none transition-all duration-300",
                        "focus:bg-white focus:shadow-xl focus:shadow-slate-200/40",
                        "placeholder:text-slate-300 placeholder:font-medium",
                        Icon && "pl-12",
                        (isError || isSuccess) && "pr-12",
                        isError && "border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/5",
                        isSuccess && "border-emerald-200 bg-emerald-50/30 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5",
                        !isError && !isSuccess && "focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5",
                        className
                    )}
                    {...props}
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    {isError && (
                        <div className="text-rose-500 animate-in zoom-in duration-300">
                            <AlertCircle size={18} />
                        </div>
                    )}
                    {isSuccess && (
                        <div className="text-emerald-500 animate-in zoom-in duration-300">
                            <CheckCircle2 size={18} />
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-[10px] font-bold text-rose-500 ml-1 animate-in slide-in-from-top-1 duration-300">
                    {error}
                </p>
            )}
        </div>
    );
}

