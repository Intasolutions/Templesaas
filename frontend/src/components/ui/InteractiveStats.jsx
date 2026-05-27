import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Animated stat card for the dashboard.
 */
export default function InteractiveStats({ 
    label, 
    value, 
    icon: Icon, 
    trend,
    trendType = 'up',
    className 
}) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={twMerge(
                "bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative",
                className
            )}
        >
            <div className="absolute -top-4 -right-4 p-8 opacity-0 group-hover:opacity-5 transform translate-x-4 -translate-y-4 transition-all duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
                <Icon size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={twMerge(
                        "text-xs font-bold px-3 py-1.5 rounded-full",
                        trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{value}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">
                    {label}
                </p>
            </div>

        </motion.div>
    );
}
