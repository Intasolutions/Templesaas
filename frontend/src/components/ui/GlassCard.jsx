import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A premium glassmorphic card component with smooth transitions and hover effects.
 */
export default function GlassCard({ 
    children, 
    className, 
    hover = true, 
    animate = true,
    delay = 0 
}) {
    const Component = animate ? motion.div : 'div';
    
    return (
        <Component
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            whileInView={animate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ 
                duration: 0.6, 
                delay: delay,
                ease: [0.16, 1, 0.3, 1] 
            }}
            className={twMerge(
                "glass rounded-3xl p-6 transition-all duration-500",
                hover && "hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20",
                className
            )}
        >
            {children}
        </Component>
    );
}
