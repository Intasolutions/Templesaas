import { useState, useEffect } from "react";
import api from "../../shared/api/client";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  Layout,
  Layers,
  Search,
  Zap,
  ShieldCheck
} from "lucide-react";
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, formatDate } from "../../shared/utils/dateUtils";
import Pagination from "../../components/common/Pagination";

const BookingsPage = () => {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
  const [view, setView] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayData, setSelectedDayData] = useState(null);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 12;
  const totalPages = Math.ceil(count / pageSize) || 1;

  useEffect(() => {
    fetchData();
  }, [page, currentDate, view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchParams = view === 'calendar' 
        ? { page: 1, page_size: 1000 } 
        : { page, page_size: pageSize };

      const [bookingsRes, eventsRes] = await Promise.all([
        api.get("/bookings/", { params: fetchParams }),
        api.get("/events/", { params: { is_active: true } })
      ]);
      const bData = bookingsRes.data;
      if (bData.results) {
          setBookings(bData.results);
          setCount(bData.count);
      } else {
          setBookings(Array.isArray(bData) ? bData : []);
          setCount(Array.isArray(bData) ? bData.length : 0);
      }
      setEvents(eventsRes.data.results || eventsRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const todayStr = formatDate(new Date());

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = formatDate(new Date(year, month, d));
    days.push({ day: d, dateStr: dStr });
  }

  const getItemsForDate = (dateStr) => {
    if (!dateStr) return { bookings: [], events: [] };
    return {
      bookings: bookings.filter(b => b.booking_date === dateStr),
      events: events.filter(e => {
        const start = e.start_date;
        const end = e.end_date || e.start_date;
        return dateStr >= start && dateStr <= end;
      })
    };
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'confirmed': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'pending': return "bg-amber-50 text-amber-600 border-amber-100";
      case 'cancelled': return "bg-red-50 text-red-500 border-red-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  const downloadTicket = async (id) => {
    try {
      const res = await api.get(`/bookings/${id}/pdf/`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Ticket_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(t('download_failed', "Failed to download ticket."));
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm(t('confirm_cancel', "Are you sure?"))) return;
    try {
      await api.patch(`/bookings/${id}/`, { status: "cancelled" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderCalendar = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-8 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg shadow-slate-900/20">
                {year.toString().slice(-2)}
             </div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
                {getMonthName(month)} {year}
             </h2>
          </div>
          <div className="flex gap-2">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-all" onClick={prevMonth}>
              <ChevronLeft size={18} />
            </button>
            <button className="px-5 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all" onClick={() => setCurrentDate(new Date())}>
              {t('today', 'Current')}
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-all" onClick={nextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-50">
          {weekDays.map(wd => (
            <div key={wd} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-white">
          {days.map((dayObj, idx) => {
            const { day, dateStr } = dayObj;
            const isToday = dateStr === todayStr;
            const { bookings: dayBookings, events: dayEvents } = getItemsForDate(dateStr);
            const hasData = dayBookings.length > 0 || dayEvents.length > 0;

            return (
              <div
                key={idx}
                onClick={() => day && hasData && setSelectedDayData({ day, dateStr, bookings: dayBookings, events: dayEvents })}
                className={`min-h-[140px] p-4 border-r border-b border-slate-50 transition-all duration-300 relative group
                    ${!day ? 'bg-slate-50/10' : isToday ? 'bg-slate-900/5' : 'bg-white hover:bg-slate-50/50'}
                    ${day && hasData ? 'cursor-pointer' : ''}
                `}
              >
                {day && (
                  <>
                    <div className={`text-[10px] font-black mb-4 transition-colors ${isToday ? 'text-slate-900' : 'text-slate-200 group-hover:text-slate-400'}`}>
                      {day.toString().padStart(2, '0')}
                    </div>
                    {/* Event/Booking Dots */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 pointer-events-none">
                      {dayEvents.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-orange-400" title="Event" />}
                      {dayBookings.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B] shadow-sm" title="Booking" />}
                    </div>

                    {/* Booking Labels */}
                    <div className="mt-7 space-y-1 pointer-events-none overflow-hidden h-[calc(100%-1.75rem)] px-1">
                      {dayBookings.slice(0, 4).map(b => (
                        <div key={b.id} className="px-2 py-1 rounded-md border border-slate-100 bg-slate-50/90 text-slate-800 text-[8.5px] font-black uppercase tracking-tight truncate shadow-sm">
                          {b.slot_time ? `[${b.slot_time}] ` : ''}{b.pooja_name || b.prasadam_item_name || 'Ritual'}
                        </div>
                      ))}
                      {dayBookings.length > 4 && (
                        <div className="text-[7.5px] font-black text-[#B8860B] uppercase tracking-widest pl-1">
                          + {dayBookings.length - 4} MORE SERVICES
                        </div>
                      )}
                    </div>
                    {isToday && <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary" />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderList = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-50">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Initial</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">{t('devotee', 'IDENTIFIER')}</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">{t('service', 'RITUAL NODE')}</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">{t('date', 'TIMESTAMP')}</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">{t('status', 'AUDIT')}</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">{t('actions', 'PROTOCOL')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-10 py-5">
                   <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                      <Layers size={16} />
                   </div>
                </td>
                 <td className="px-6 py-5">
                   <div className="text-sm font-bold text-slate-900">{b.devotee_name || b.devotee?.full_name || '—'}</div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{b.devotee_phone || b.devotee?.phone || '—'}</div>
                 </td>
                 <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                        {b.slot_time ? `${b.slot_time.slice(0, 5)} - ` : ''}
                        {b.pooja_name || b.prasadam_item_name || '—'}
                    </span>
                    <div className="text-[9px] font-black text-primary mt-1 uppercase tracking-widest">₹{(b.amount || 0).toLocaleString()} Credited</div>
                 </td>
                <td className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {new Date(b.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getBadgeStyle(b.status)}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-10 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => downloadTicket(b.id)}
                      className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                    >
                       <Download size={14} />
                    </button>
                    {b.status !== 'cancelled' && checkPermission('bookings', 'edit') && (
                      <button 
                        onClick={() => cancelBooking(b.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all"
                      >
                         <Plus size={16} className="rotate-45" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Database size={12} /> Registry Node: {count} Objects
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="h-11 w-11 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm">
            <ChevronLeft size={18} />
          </button>
          <div className="h-11 px-5 flex items-center justify-center bg-white border border-slate-900 rounded-xl text-slate-900 text-xs font-bold shadow-sm">
            {page} / {totalPages}
          </div>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="h-11 w-11 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-20 transition-all shadow-sm">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/30">
                <CalendarIcon size={20} />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">Master Schedule</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <Zap size={12} className="text-amber-500" /> Operational Protocol • synchronized v2.4
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setView('calendar')}
              className={`px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${view === 'calendar' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layout size={14} /> {t('calendar')}
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${view === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={14} /> {t('list')}
            </button>
          </div>

          {checkPermission('bookings', 'edit') && (
            <button
                onClick={() => window.location.href = '/pooja/book'}
                className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95"
            >
                <Plus size={18} /> New Authorization
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin shadow-inner"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Hydrating Schedule...</p>
        </div>
      ) : (
        view === 'calendar' ? renderCalendar() : renderList()
      )}

      {/* Selected Day Side Drawer */}
      <AnimatePresence>
        {selectedDayData && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedDayData(null)}
            />

            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
              className="w-full max-w-lg bg-white h-full shadow-2xl relative z-10 overflow-y-auto flex flex-col border-l border-slate-100"
            >
              <div className="p-10 border-b border-slate-50 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                <div>
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2 block">{getMonthName(month)} {year}</span>
                   <h3 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase leading-none">
                     {selectedDayData.day}
                   </h3>
                   <div className="flex items-center gap-2 mt-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDayData.bookings.length} Registered Rituals</p>
                   </div>
                </div>
                <button
                  onClick={() => setSelectedDayData(null)}
                  className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-12 pb-32">
                {selectedDayData.events.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" /> Observatory
                    </h4>
                    <div className="space-y-4">
                      {selectedDayData.events.map(e => (
                        <div key={e.id} className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Sparkles size={40} /></div>
                           <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 block">Festival Record</span>
                           <h5 className="font-bold text-2xl tracking-tight leading-tight">{e.name}</h5>
                           <p className="text-xs text-white/50 mt-4 leading-relaxed">"{e.description || 'Traditional observance defined in temple registry.'}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <ShieldCheck size={14} className="text-slate-900" /> Authorized Rituals
                  </h4>

                  {selectedDayData.bookings.length === 0 ? (
                    <div className="p-16 border-2 border-slate-100 border-dashed rounded-[2.5rem] text-center">
                       <Layers size={32} className="mx-auto text-slate-100 mb-4" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Protocol Entries</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDayData.bookings.map(b => (
                        <div key={b.id} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 transition-all flex items-center gap-5 group">
                           <div className="h-12 w-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                               <Clock size={16} />
                               <span className="text-[8px] font-black mt-1 uppercase">Live</span>
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <h5 className="font-bold text-slate-900 text-sm tracking-tight truncate uppercase">
                                {b.slot_time ? `[${b.slot_time.slice(0, 5)}] ` : ''}
                                {b.pooja_name || b.prasadam_item_name || 'Ritual Service'}
                              </h5>
                              <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest truncate">{b.devotee_name || 'Anonymous'}</p>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-bold text-slate-900">₹{(b.amount || 0).toLocaleString()}</div>
                              <span className={`text-[8px] font-black mt-2 uppercase tracking-widest border px-2 py-0.5 rounded ${getBadgeStyle(b.status)}`}>
                                 {b.status}
                              </span>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-white via-white to-transparent">
                 {checkPermission('bookings', 'edit') && (
                    <button onClick={() => window.location.href='/pooja/book'} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/40">
                        Add Observation
                    </button>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsPage;
