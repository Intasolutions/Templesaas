import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * A highly responsive data table that transforms into elegant cards on mobile.
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of { header, key, render, mobileLabel, hidden }
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.emptyMessage - Message to show when no data
 * @param {Function} props.onRowClick - Click handler for rows/cards
 * @param {string} props.className - Additional table classes
 */
const ResponsiveTable = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No records found",
    onRowClick,
    className
}) => {
    // Filter out hidden columns
    const activeColumns = columns.filter(col => !col.hidden);

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Records...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-sm font-bold text-slate-400 italic">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={twMerge("w-full", className)}>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                            {activeColumns.map((col, idx) => (
                                <th 
                                    key={col.key || idx} 
                                    className={twMerge(
                                        "px-6 py-5 text-[10px] font-black uppercase tracking-widest",
                                        col.align === 'right' ? 'text-right' : ''
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((row, rowIdx) => (
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: rowIdx * 0.03 }}
                                key={row.id || rowIdx} 
                                onClick={() => onRowClick && onRowClick(row)}
                                className={twMerge(
                                    "hover:bg-slate-50/50 transition-colors group cursor-default",
                                    onRowClick ? "cursor-pointer" : ""
                                )}
                            >
                                {activeColumns.map((col, colIdx) => (
                                    <td 
                                        key={col.key || colIdx} 
                                        className={twMerge(
                                            "px-6 py-5 text-sm font-medium text-slate-700",
                                            col.align === 'right' ? 'text-right' : ''
                                        )}
                                    >
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
                {data.map((row, rowIdx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: rowIdx * 0.05 }}
                        key={row.id || rowIdx}
                        onClick={() => onRowClick && onRowClick(row)}
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm active:scale-[0.98] transition-all"
                    >
                        <div className="space-y-4">
                            {activeColumns.map((col, colIdx) => {
                                // First column is usually the "Title" or "Main Identity"
                                if (colIdx === 0) {
                                    return (
                                        <div key={col.key || colIdx} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                {col.render ? col.render(row) : row[col.key]}
                                            </div>
                                        </div>
                                    );
                                }

                                // Handle Actions column separately or skip if it's rendered in a special way
                                if (col.key === 'actions') {
                                    return (
                                        <div key={col.key || colIdx} className="pt-4 border-t border-slate-50 flex justify-end gap-2">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </div>
                                    );
                                }

                                return (
                                    <div key={col.key || colIdx} className="flex flex-col space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            {col.mobileLabel || col.header}
                                        </span>
                                        <div className="text-sm font-bold text-slate-700">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ResponsiveTable;
