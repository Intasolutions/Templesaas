import { motion } from 'framer-motion';
import { 
    Sparkles, Shield, Zap, BarChart3, Users, Monitor, Package, 
    Database, Globe, Lock, BookOpen, Clock, Layers, Truck, 
    Activity, ArrowRight, CheckCircle2, Server, Code2, 
    Smartphone, Search, Bell, CreditCard, Settings, FileText,
    Key, ClipboardList, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingLayout from './MarketingLayout';

const ProjectReportPage = () => {
    const navigate = useNavigate();
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const moduleGroups = [
        {
            groupTitle: "Pooja & Ritual Operations",
            icon: Zap,
            modules: [
                {
                    title: "Pooja Core",
                    desc: "Master registry of all temple poojas, offerings, and ritual timings.",
                    features: ["Nakshatra-aware timings", "Category management", "Priest assignment"]
                },
                {
                    title: "Panchangam API",
                    desc: "Astronomical calculation engine for star, thithi, and yoga data.",
                    features: ["Daily thithi tracking", "Malayalam/Tamil support", "Solar/Lunar calendars"]
                },
                {
                    title: "Vazhipadu Gateway",
                    desc: "Dedicated counter booking system for fast receipt generation.",
                    features: ["Quick-search devotees", "Batch printing", "Offline mode support"]
                },
                {
                    title: "Bookings & History",
                    desc: "Comprehensive log of every pooja booked across all time.",
                    features: ["Advanced filtering", "Rescheduling tools", "Success tracking"]
                }
            ]
        },
        {
            groupTitle: "Financial & Audit Systems",
            icon: BarChart3,
            modules: [
                {
                    title: "Hundi Management",
                    desc: "Secure protocols for counting and recording Hundi collections.",
                    features: ["Witness logging", "Denomination tracking", "Safe audit trails"]
                },
                {
                    title: "Finance & Accounts",
                    desc: "Centralized daybook and ledger system for all temple income.",
                    features: ["Daily Daybooks", "Expense tracking", "Committee reports"]
                },
                {
                    title: "Donations Module",
                    desc: "Management of large donations and endowment funds.",
                    features: ["Digital 80G receipts", "Cause-based tracking", "Donor recognition"]
                },
                {
                    title: "Razorpay Payments",
                    desc: "Integrated online payment processing for global devotees.",
                    features: ["UPI/Card/Netbanking", "Automatic settlements", "Refund handling"]
                },
                {
                    title: "SaaS Billing",
                    desc: "System for managing temple subscriptions and plan tiers.",
                    features: ["Trial management", "Usage analytics", "Automated invoicing"]
                }
            ]
        },
        {
            groupTitle: "Logistics & Physical Assets",
            icon: Package,
            modules: [
                {
                    title: "Inventory Control",
                    desc: "Tracking of groceries, pooja materials, and stock levels.",
                    features: ["Low-stock alerts", "Purchase history", "Stock adjustments"]
                },
                {
                    title: "Asset Registry",
                    desc: "Digital record of brass vessels, gold, and temple property.",
                    features: ["Photo documentation", "Valuation tracking", "Audit logs"]
                },
                {
                    title: "Shipments (E-Prasadam)",
                    desc: "End-to-end logistics for sending Prasadam to devotees.",
                    features: ["Label printing", "Courier integration", "WhatsApp tracking"]
                },
                {
                    title: "Event Planning",
                    desc: "Management of festivals, utsavam shifts, and special events.",
                    features: ["Resource scheduling", "Volunteer coordination", "Festival budgets"]
                }
            ]
        },
        {
            groupTitle: "Staff & Devotee CRM",
            icon: Users,
            modules: [
                {
                    title: "Devotee Database",
                    desc: "Centralized registry of devotees with family details.",
                    features: ["Star & Gothram tracking", "CRM history", "Search by phone"]
                },
                {
                    title: "Staff & Users",
                    desc: "Management of priests, office staff, and volunteers.",
                    features: ["RBAC permissions", "Profile management", "Activity logs"]
                },
                {
                    title: "Attendance Logs",
                    desc: "Tracking of staff entry, exit, and duty hours.",
                    features: ["Shift management", "Payroll integration", "Duty rosters"]
                },
                {
                    title: "Notifications",
                    desc: "Automated SMS, Email, and WhatsApp alerts.",
                    features: ["Booking alerts", "Birthday wishes", "Festival reminders"]
                }
            ]
        },
        {
            groupTitle: "Digital Experience (TCC)",
            icon: Monitor,
            modules: [
                {
                    title: "TV Display (Signage)",
                    desc: "Dynamic broadcasting for queue and pooja schedules.",
                    features: ["Live token display", "Pooja announcements", "Weather updates"]
                },
                {
                    title: "Integrations Hub",
                    desc: "Connecting third-party services and hardware.",
                    features: ["Thermal printer sync", "Payment gateways", "External APIs"]
                },
                {
                    title: "Analytics Dashboard",
                    desc: "Real-time visual data for temple administrators.",
                    features: ["Revenue charts", "Booking trends", "Stock visualization"]
                },
                {
                    title: "Global Search",
                    desc: "One-search bar to find anything across the system.",
                    features: ["Receipt lookup", "Devotee search", "File retrieval"]
                }
            ]
        },
        {
            groupTitle: "Core Infrastructure",
            icon: Server,
            modules: [
                {
                    title: "Multi-Tenant Core",
                    desc: "The underlying engine that hosts multiple temples securely.",
                    features: ["Data isolation", "Subdomain routing", "Tenant lifecycle"]
                },
                {
                    title: "Auth & Security",
                    desc: "Advanced authentication and session management.",
                    features: ["Secure login", "JWT tokens", "Action logging"]
                },
                {
                    title: "Masters & Settings",
                    desc: "Configuration of global temple rules and master data.",
                    features: ["Timezone settings", "Currency config", "Global constants"]
                },
                {
                    title: "Audit Logs",
                    desc: "A permanent record of every change made in the system.",
                    features: ["Who-did-what tracking", "Forensic analysis", "Compliance ready"]
                }
            ]
        }
    ];

    return (
        <MarketingLayout>
            <div className="pt-32 pb-24 md:pt-48 md:pb-40 bg-cream">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <motion.div {...fadeIn} className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-primary/10 shadow-sm mb-10">
                            <Sparkles size={16} className="text-primary" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Project Module Report</span>
                        </div>
                        <h1 className="text-5xl md:text-[84px] font-black text-wood tracking-tight mb-8 leading-[0.95] uppercase">
                            Every <br /><span className="text-primary font-serif italic">Module.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-wood/60 font-medium leading-relaxed max-w-2xl mx-auto">
                            A complete list of the 27 backend apps and 22 frontend modules that power the TempleSaaS ecosystem.
                        </p>
                    </motion.div>
                </section>

                {/* Modules by Groups */}
                <section className="max-w-7xl mx-auto px-6">
                    {moduleGroups.map((group, gIdx) => (
                        <div key={gIdx} className="mb-32">
                            <div className="flex items-center gap-6 mb-16">
                                <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <group.icon size={24} />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-wood tracking-tight uppercase">{group.groupTitle}</h2>
                                <div className="h-px bg-wood/10 flex-grow hidden md:block" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {group.modules.map((module, mIdx) => (
                                    <motion.div 
                                        key={mIdx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: mIdx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-8 rounded-[2.5rem] bg-white border border-wood/5 hover:shadow-xl transition-all group flex flex-col"
                                    >
                                        <h3 className="text-lg font-black text-wood mb-3 uppercase tracking-tight group-hover:text-primary transition-colors">{module.title}</h3>
                                        <p className="text-sm text-wood/50 leading-relaxed mb-6 flex-grow">{module.desc}</p>
                                        <div className="space-y-2 pt-4 border-t border-wood/5">
                                            {module.features.map((feature, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-2 text-[10px] font-bold text-wood/40 uppercase tracking-widest">
                                                    <CheckCircle2 size={10} className="text-primary/40" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Technical Stats */}
                <section className="max-w-7xl mx-auto px-6 mb-40">
                    <div className="bg-wood rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none"><Activity size={300} className="text-primary" /></div>
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-[0.95] mb-8">
                                    Project <br /><span className="text-primary font-serif italic">Architecture.</span>
                                </h2>
                                <div className="grid grid-cols-2 gap-12 mt-12">
                                    <Metric label="Backend Apps" value="27" />
                                    <Metric label="Frontend Modules" value="22" />
                                    <Metric label="Core APIs" value="150+" />
                                    <Metric label="Security Layer" value="AES-256" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <ProtocolItem icon={Code2} title="Clean Code" desc="Strict adherence to PEP8 and ESLint standards." />
                                <ProtocolItem icon={Smartphone} title="Mobile First" desc="Optimized for phone usage in temple counters." />
                                <ProtocolItem icon={Database} title="Fast Queries" desc="Redis caching for astronomical calculations." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 mb-8">
                        <Bell size={16} className="text-primary animate-bounce" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-wood/80">Start Your Digital Transformation</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-wood tracking-tight uppercase mb-12">
                        Get the Full Experience.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button onClick={() => navigate('/demo')} className="h-16 px-10 rounded-full bg-primary text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-3">
                            Book Free Demo <ArrowRight size={18} />
                        </button>
                        <button onClick={() => navigate('/pricing')} className="h-16 px-10 rounded-full bg-white border border-wood/10 text-wood font-bold text-sm uppercase tracking-widest hover:bg-wood/5 transition-all">
                            View Pricing Plans
                        </button>
                    </div>
                </section>
            </div>
        </MarketingLayout>
    );
};

const Metric = ({ label, value }) => (
    <div>
        <p className="text-5xl font-black text-white tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-2">{label}</p>
    </div>
);

const ProtocolItem = ({ icon: Icon, title, desc }) => (
    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex gap-6 items-start">
        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Icon size={20} />
        </div>
        <div className="text-left">
            <h4 className="text-white font-black text-sm uppercase tracking-tight mb-1">{title}</h4>
            <p className="text-white/40 text-xs font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default ProjectReportPage;
