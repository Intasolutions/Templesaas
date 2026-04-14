import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Check, ArrowRight, Target, Zap, BrainCircuit, Sparkles, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MarketingLayout from './MarketingLayout';
import DemoBookingModal from './DemoBookingModal';

const forecastData = [
    { day: 'Mon', actual: 450, forecast: 450 },
    { day: 'Tue', actual: 520, forecast: 500 },
    { day: 'Wed', actual: 480, forecast: 510 },
    { day: 'Thu', actual: 610, forecast: 600 },
    { day: 'Fri', actual: 750, forecast: 740 },
    { day: 'Sat', forecast: 950 },
    { day: 'Sun', forecast: 1200 },
];

const AnalyticsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MarketingLayout>
            <DemoBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            <section className="pt-48 pb-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[13px] font-bold uppercase tracking-wider mb-8 border border-slate-100">
                                <BrainCircuit size={14} className="text-slate-400" /> AI-Driven Intelligence
                            </div>
                            <h1 className="text-6xl md:text-[84px] font-extrabold text-slate-900 tracking-tight mb-10 leading-[0.95]">
                                Ritual <br />
                                <span className="text-slate-400">Forecasting.</span>
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-lg">
                                Move beyond traditional ledgers. Predictive analytics for hundi collections and festival demand optimization.
                            </p>
                            <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95">
                                Book Intelligence Demo <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="relative"
                        >
                            <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em] mb-1">Peak Prediction Engine</p>
                                        <h4 className="text-white text-xl font-bold">Mandalakalm Forecast</h4>
                                    </div>
                                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400">
                                        <Sparkles size={20} />
                                    </div>
                                </div>

                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={forecastData}>
                                            <defs>
                                                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                            <YAxis hide />
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                                                itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                                            />
                                            <Area type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
                                            <Area type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={3} fill="transparent" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-white" /> Actual
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-amber-500" /> AI Forecast
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400">
                                        <TrendingUp size={12} /> 94% Accuracy
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-40 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                         <FeatureBullet 
                            icon={BrainCircuit}
                            title="Predictive Staffing" 
                            desc="Algorithmically determine optimal volunteer and counter staff count based on historic festival peaks." 
                         />
                         <FeatureBullet 
                            icon={Activity}
                            title="Real-time Node Health" 
                            desc="Monitor transaction throughput across all regional temple nodes with zero latency." 
                         />
                         <FeatureBullet 
                            icon={Target}
                            title="Hundi Yield Analysis" 
                            desc="In-depth breakdown of collection styles and regional devotee contributions." 
                         />
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
};

const FeatureBullet = ({ title, desc, icon: Icon }) => (
    <div className="space-y-4">
        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
            <Icon size={20} strokeWidth={2.5} />
        </div>
        <h4 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default AnalyticsPage;
