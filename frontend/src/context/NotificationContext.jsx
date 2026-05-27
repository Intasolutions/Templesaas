import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const notify = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const confirm = useCallback(({ title, message, confirmText, cancelText, onConfirm, onCancel }) => {
        setConfirmDialog({
            title,
            message,
            confirmText: confirmText || 'Proceed',
            cancelText: cancelText || 'Cancel',
            onConfirm: () => {
                if (onConfirm) onConfirm();
                setConfirmDialog(null);
            },
            onCancel: () => {
                if (onCancel) onCancel();
                setConfirmDialog(null);
            }
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            toasts, 
            notify: {
                success: (msg) => notify(msg, 'success'),
                error: (msg) => notify(msg, 'error'),
                warn: (msg) => notify(msg, 'warn'),
                info: (msg) => notify(msg, 'info'),
            },
            confirm,
            confirmDialog,
            removeToast: (id) => setToasts(prev => prev.filter(t => t.id !== id))
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotify() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotify must be used within a NotificationProvider');
    return context.notify;
}

export function useConfirm() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useConfirm must be used within a NotificationProvider');
    return context.confirm;
}

export function useNotificationInternal() {
    return useContext(NotificationContext);
}
