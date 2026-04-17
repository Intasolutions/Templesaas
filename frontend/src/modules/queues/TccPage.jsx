import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../shared/api/client';
import {
    MonitorUp,
    Plus,
    UserPlus,
    Play,
    SquareActivity,
    Activity
} from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function TccPage() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newSessionName, setNewSessionName] = useState('');

    const fetchSessions = async () => {
        try {
            const res = await api.get('/queues/sessions/');
            const data = Array.isArray(res.data) ? res.data : res.data.results || [];
            setSessions(data);
            if (!selectedSessionId && data.length > 0) {
                setSelectedSessionId(data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch queue sessions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000);
        return () => clearInterval(interval);
    }, [selectedSessionId]);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        if (!newSessionName.trim()) return;
        try {
            await api.post('/queues/sessions/', { name: newSessionName });
            setNewSessionName('');
            fetchSessions();
        } catch (error) {
            console.error(error);
        }
    };

    const handleGenerateToken = async (session) => {
        try {
            await api.post('/queues/tokens/', {
                session: session.id,
                status: 'waiting'
            });
            fetchSessions();
        } catch (error) {
            console.error(error);
            alert(t('error_generating_token', "Error generating token"));
        }
    };

    const handleCallNext = async (session) => {
        if ((session.current_token_number || 0) >= (session.last_issued_number || 0)) {
            alert(t('no_more_tokens', "No more tokens waiting!"));
            return;
        }
        try {
            await api.post(`/queues/sessions/${session.id}/call-next/`);
            fetchSessions();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to call next token");
        }
    };

    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/30 text-white">
                        <MonitorUp size={22} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
                            {t('tcc_title', 'Token Counter Console')}
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            {t('tcc_subtitle', 'Manage queues, issue tokens, and control the TV display.')}
                        </p>
                    </div>
                </div>
            </header>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Session Management */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/80 backdrop-blur-2xl px-6 py-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10 tracking-tight">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><SquareActivity size={20} /></div>
                            {t('active_queues', 'Active Queues')}
                        </h2>

                        <div className="space-y-4 mb-8 relative z-10 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                            {loading ? (
                                <div className="py-8 flex justify-center"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
                            ) : sessions.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                    {t('no_active_queues', 'No active queues.')}
                                </div>
                            ) : (
                                sessions.map(session => (
                                    <button
                                        key={session.id}
                                        onClick={() => setSelectedSessionId(session.id)}
                                        className={`w-full text-left p-4 rounded-2xl flex justify-between items-center transition-all group border-2 ${selectedSessionId === session.id
                                            ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border-transparent transform scale-[1.02]'
                                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {selectedSessionId === session.id ? <Activity size={18} className="animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400" />}
                                            <span className="font-bold">{session.name}</span>
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-lg font-bold ${selectedSessionId === session.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {session.status}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleCreateSession} className="flex gap-3 relative z-10 pt-6 border-t border-slate-100">
                            <input
                                type="text"
                                value={newSessionName}
                                onChange={(e) => setNewSessionName(e.target.value)}
                                placeholder={t('new_queue_name', 'New Queue Name...')}
                                className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 placeholder-slate-400"
                            />
                            <button
                                type="submit"
                                className="bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center disabled:opacity-50"
                                disabled={!newSessionName.trim()}
                            >
                                <Plus size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column - Active Session Controller */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedSession ? (
                            <motion.div
                                key={selectedSession.id}
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 min-h-[500px] flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12 relative z-10 border-b border-slate-100 pb-8">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800 tracking-tight">
                                            {selectedSession.name}
                                        </h2>
                                        <p className="text-slate-500 mt-2 font-medium">{t('control_token_flow', 'Control token flow for this queue counter.')}</p>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-widest self-start sm:self-auto shadow-sm">
                                        {selectedSession.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 relative z-10 flex-1">
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] p-8 shadow-inner border border-indigo-100 text-center flex flex-col items-center justify-center relative overflow-hidden">
                                        <div className="absolute top-4 left-4 text-indigo-200/50"><Activity size={80} /></div>
                                        <span className="text-indigo-900/40 font-bold mb-3 uppercase tracking-widest text-xs relative z-10">{t('now_serving', 'Now Serving')}</span>
                                        <span className="text-7xl md:text-8xl font-bold text-indigo-600 tracking-tighter relative z-10 drop-shadow-sm">
                                            #{selectedSession.current_token_number || '--'}
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border 2 border-slate-100 text-center flex flex-col items-center justify-center relative overflow-hidden">
                                        <span className="text-slate-400 font-bold mb-3 uppercase tracking-widest text-xs">{t('last_issued', 'Last Issued')}</span>
                                        <span className="text-7xl md:text-8xl font-bold text-slate-800 tracking-tighter">
                                            #{selectedSession.last_issued_number || '--'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-auto relative z-10">
                                    <button
                                        onClick={() => handleGenerateToken(selectedSession)}
                                        className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl py-5 px-6 font-bold text-lg flex items-center justify-center gap-3 transition-colors hover:bg-slate-50 active:scale-[0.98]"
                                    >
                                        <UserPlus size={24} className="text-slate-400" />
                                        {t('generate_token', 'Generate Token')}
                                    </button>
                                    <button
                                        onClick={() => handleCallNext(selectedSession)}
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl py-5 px-6 font-bold text-lg flex items-center justify-center gap-3 transition shadow-xl shadow-orange-500/30 active:scale-[0.98]"
                                    >
                                        <Play size={24} />
                                        {t('call_next_token', 'Call Next Token')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-white/40 backdrop-blur-md border border-white border-dashed p-8 rounded-[2.5rem] h-full flex flex-col items-center justify-center text-slate-400 min-h-[500px]"
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <MonitorUp size={48} className="text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-600 mb-2">{t('no_queue_selected', 'No Queue Selected')}</h3>
                                <p className="text-slate-500 font-medium">{t('select_or_create_queue', 'Select or create a queue session to start managing tokens.')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
