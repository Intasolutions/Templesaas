import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * A high-fidelity button with subtle gradients, micro-interactions, and loading states.
 */
export default function PremiumButton({ 
    children, 
    variant = 'primary', 
    size = 'md',
    className, 
    isLoading = false,
    icon: Icon,
    ...props 
}) {
    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10",
        saffron: "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20",
        gold: "bg-gold text-white hover:bg-gold/90 shadow-xl shadow-gold/20",
        outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    };

    const sizes = {
        sm: "h-10 px-5 text-xs",
        md: "h-13 px-7 text-sm",
        lg: "h-15 px-9 text-base",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                "inline-flex items-center justify-center gap-3 rounded-2xl font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
                    {children}
                </>
            )}
        </motion.button>
    );
}

