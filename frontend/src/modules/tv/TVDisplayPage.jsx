import { useState, useEffect, useMemo } from "react";
import { 
    Monitor, 
    Clock, 
    Calendar, 
    Sparkles, 
    ChevronRight, 
    Maximize2,
    Volume2,
    Layout,
    Tv,
    Search,
    Play,
    Pause,
    Plus,
    Settings,
    Activity,
    ShieldCheck,
    Zap,
    RefreshCw,
    X,
    Eye,
    Globe,
    CloudRain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../shared/api/client";

const ICON_MAP = { Globe, Volume2, Eye, CloudRain };

export default function TVDisplayPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeSlide, setActiveSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [loading, setLoading] = useState(true);
    const [liveData, setLiveData] = useState([]);
    const [isDeploying, setIsDeploying] = useState(false);
    
    // Interactive State for Broadcast Settings with Persistence
    const [broadcastSettings, setBroadcastSettings] = useState(() => {
        const saved = localStorage.getItem('temple_broadcast_settings');
        return saved ? JSON.parse(saved) : [
            { id: 'subtitles', label: "Malayalam Subtitles", status: true, icon: 'Globe' },
            { id: 'voiceover', label: "Automatic Voiceover", status: false, icon: 'Volume2' },
            { id: 'feed', label: "Live Pooja Feed", status: true, icon: 'Eye' },
            { id: 'weather', label: "Weather Overlay", status: false, icon: 'CloudRain' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('temple_broadcast_settings', JSON.stringify(broadcastSettings));
    }, [broadcastSettings]);

    const toggleSetting = (id) => {
        setBroadcastSettings(prev => prev.map(opt => 
            opt.id === id ? { ...opt, status: !opt.status } : opt
        ));
    };

    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const toggleFullscreen = () => {
        const elem = document.getElementById('tv-display-node');
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleDeploy = () => {
        setIsDeploying(true);
        setTimeout(() => {
            setIsDeploying(false);
            alert("Broadcast protocols synchronized with edge display nodes successfully.");
        }, 1500);
    };

    const fetchLiveBroadcastData = async () => {
        try {
            setLoading(true);
            const eventsRes = await api.get('/events/', { params: { is_active: true } });

            const events = (eventsRes.data.results || []).map(e => ({
                id: `E-${e.id}`,
                title: e.name,
                time: e.start_date,
                location: e.location || "Temple Complex",
                type: "FESTIVAL"
            }));

            const combined = [...events];
            setLiveData(combined);
        } catch (error) {
            console.error("TV Feed Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveBroadcastData();
        const dataInterval = setInterval(fetchLiveBroadcastData, 60000);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        const fsHandler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', fsHandler);
        
        return () => {
            clearInterval(timer);
            clearInterval(dataInterval);
            document.removeEventListener('fullscreenchange', fsHandler);
        };
    }, []);

    useEffect(() => {
        let slideTimer;
        if (isPlaying && liveData.length > 0) {
            slideTimer = setInterval(() => {
                setActiveSlide(prev => (prev + 1) % liveData.length);
            }, 8000);
        }
        return () => {
            if (slideTimer) clearInterval(slideTimer);
        };
    }, [isPlaying, liveData.length]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Prime Header - Hidden in Fullscreen */}
            {!isFullscreen && (
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                                <Monitor size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Signage Node</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-primary" /> Active Broadcast Command
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button 
                            onClick={toggleFullscreen}
                            className={`h-14 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border ${
                                isFullscreen ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white border-slate-100 text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <Maximize2 size={18} className={isFullscreen ? 'text-white' : 'text-slate-400'} /> {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 4K'}
                        </button>
                        <button onClick={handleDeploy} disabled={isDeploying} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 active:scale-95 transition-all">
                            {isDeploying ? <RefreshCw size={20} className="animate-spin text-primary" /> : <Zap size={20} />}
                            {isDeploying ? 'Synchronizing...' : 'Deploy Protocol'}
                        </button>
                    </div>
                </header>
            )}

            <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-12 px-4 md:px-0`}>
                {/* Cinematic Preview Display */}
                <div className={`${isFullscreen ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-8`}>
                    <div id="tv-display-node" className={`aspect-video bg-slate-950 shadow-2xl overflow-hidden relative group transition-all duration-700 ${isFullscreen ? 'border-none rounded-none !max-w-none w-screen h-screen fixed inset-0 z-[500]' : 'rounded-[3.5rem] border-[16px] border-slate-900'}`}>
                        {isFullscreen && (
                            <button 
                                onClick={toggleFullscreen}
                                className="absolute top-10 right-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md flex items-center justify-center z-[600] opacity-0 group-hover:opacity-100 transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        )}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent)]" />
                        
                        {/* Status Overlays */}
                        <div className="absolute top-10 left-10 right-10 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Activity size={24} />
                                </div>
                                <div className="animate-pulse">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] leading-none">Synchronized Node</p>
                                    </div>
                                    <p className="text-sm font-black text-white tracking-[0.2em] uppercase">Edge Display #042</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-white tracking-tighter leading-none">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">
                                    {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Slide Content */}
                        <div className="absolute inset-0 flex items-center justify-center p-20 text-center">
                            {loading ? (
                                <div className="space-y-6">
                                    <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto" />
                                    <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em]">Hydrating Feed...</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeSlide}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                        className="max-w-2xl px-10"
                                    >
                                        <motion.span 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8 rounded-lg"
                                        >
                                            {liveData[activeSlide]?.type}
                                        </motion.span>
                                        <h2 className="text-6xl font-black text-white mb-10 tracking-tighter leading-[1.1] uppercase">
                                            {liveData[activeSlide]?.title}
                                        </h2>
                                        <div className="flex items-center justify-center gap-12">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                                                   <Clock size={18} />
                                                </div>
                                                <span className="text-xl font-bold tracking-tight text-white/80">{liveData[activeSlide]?.time}</span>
                                            </div>
                                            <div className="h-1 w-1 rounded-full bg-white/20" />
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                                                   <Layout size={18} />
                                                </div>
                                                <span className="text-xl font-bold tracking-tight text-white/80">{liveData[activeSlide]?.location}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Broadcast Overlays */}
                        {broadcastSettings.find(s => s.id === 'subtitles' && s.status) && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-16 left-0 right-0 px-20 text-center">
                                <p className="bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-xl inline-block text-[11px] font-bold text-white/90 border border-white/5">
                                    ഇന്നത്തെ പ്രധാന ചടങ്ങുകൾ ഭക്ത്യാദരപൂർവ്വം വീക്ഷിക്കുക.
                                </p>
                            </motion.div>
                        )}

                        {broadcastSettings.find(s => s.id === 'weather' && s.status) && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute bottom-10 left-10 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl">
                                <CloudRain size={16} className="text-blue-400" />
                                <span className="text-[10px] font-black text-white tracking-widest">28°C KER</span>
                            </motion.div>
                        )}

                        {/* Progress Tracker */}
                        <div className="absolute bottom-8 left-16 right-16 flex gap-3">
                            {liveData.map((_, i) => (
                                <div key={i} className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                                     {activeSlide === i && (
                                         <motion.div 
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "0%" }}
                                            transition={{ duration: 8, ease: "linear" }}
                                            className="h-full w-full bg-primary shadow-[0_0_12px_rgba(249,115,22,0.6)]" 
                                         />
                                     )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {!isFullscreen && (
                        <div className="flex items-center justify-between px-6">
                            <div className="flex items-center gap-6">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="h-14 w-14 rounded-[1.2rem] bg-slate-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Playhead Control</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{isPlaying ? 'Continuous Node Rotation' : 'Fixed Protocol Display'}</p>
                            </div>
                            </div>
                            <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Resolution Payload</p>
                            <p className="text-xs font-bold text-slate-900 mt-1 uppercase">Ultra-High Fidelity • 60 FPS</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls & Configuration - Hidden in Fullscreen */}
                {!isFullscreen && (
                    <div className="space-y-10">
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-700">
                           <Settings size={120} />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                           <Settings size={18} strokeWidth={3} /> Override Console
                        </h3>
                        <div className="space-y-4">
                            {broadcastSettings.map((opt) => (
                                <div 
                                    key={opt.id} 
                                    onClick={() => toggleSetting(opt.id)}
                                    className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all cursor-pointer group/opt ${
                                        opt.status ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-900/20' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                                            opt.status ? 'bg-white/10 text-primary' : 'bg-white text-slate-300'
                                        }`}>
                                            {(() => {
                                                const IconComp = ICON_MAP[opt.icon];
                                                return IconComp ? <IconComp size={18} /> : null;
                                            })()}
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                                            opt.status ? 'text-white' : 'text-slate-500'
                                        }`}>{opt.label}</span>
                                    </div>
                                    <div className={`h-6 w-12 rounded-full relative transition-all duration-300 shadow-inner ${opt.status ? 'bg-primary' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-md ${opt.status ? 'right-1' : 'left-1'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/20 blur-[60px] group-hover:bg-primary/40 transition-all duration-700" />
                        <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <Sparkles size={18} /> Heritage Protocol
                        </h4>
                        <p className="text-sm font-medium text-white/50 leading-relaxed mb-10">
                            Serving <span className="text-white font-black">{liveData.length}</span> active notice nodes. All telemetry is aggregated from the core ledger in real-time.
                        </p>
                        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all group/btn">
                            View Deployment Logs <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    
                    <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white flex items-center gap-6 group hover:border-primary/20 transition-all cursor-help">
                       <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                          <Activity size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Latency</p>
                          <p className="text-sm font-black text-slate-900 uppercase">12ms • Optimized</p>
                       </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
