import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
import { getCalendarDays, getMonthName, formatDate } from "../../shared/utils/dateUtils";
import Pagination from "../../components/common/Pagination";
import ResponsiveTable from "../../components/ui/ResponsiveTable";

const BookingsPage = () => {
  const { t } = useTranslation();
  const { checkPermission } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [view, setView] = useState("calendar");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [panchangMap, setPanchangMap] = useState({});
  const [panchangCache, setPanchangCache] = useState({});
  const [selectedDayData, setSelectedDayData] = useState(null);

  // URL State Management
  const urlDate = searchParams.get('date');
  const initialDate = useMemo(() => urlDate ? new Date(urlDate) : new Date(), [urlDate]);
  const [currentDate, setCurrentDate] = useState(initialDate);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 12;
  const totalPages = Math.ceil(count / pageSize) || 1;

  useEffect(() => {
    if (urlDate) {
      const d = new Date(urlDate);
      if (d.getMonth() !== currentDate.getMonth() || d.getFullYear() !== currentDate.getFullYear()) {
        setCurrentDate(d);
      }
    }
  }, [urlDate]);

  useEffect(() => {
    if (urlDate && bookings.length > 0) {
      const d = new Date(urlDate);
      const { bookings: dayBookings, events: dayEvents } = getItemsForDate(urlDate);
      setSelectedDayData({ 
        day: d.getDate(), 
        dateStr: urlDate, 
        bookings: dayBookings, 
        events: dayEvents 
      });
    }
  }, [urlDate, bookings, events]);

  useEffect(() => {
    fetchData();
  }, [page, currentDate, view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchParams = view === 'calendar' 
        ? { page: 1, page_size: 1000 } 
        : { page, page_size: pageSize };

      const promises = [
        api.get("/bookings/", { params: fetchParams }),
        api.get("/events/", { params: { is_active: true } })
      ];

      const [bookingsRes, eventsRes] = await Promise.all(promises);
      setBookings(bookingsRes.data.results || bookingsRes.data || []);
      setEvents(eventsRes.data.results || eventsRes.data || []);
      setCount(bookingsRes.data.count || (bookingsRes.data.results ? bookingsRes.data.results.length : 0));

      // Fetch Panchang Asynchronously
      const monthDays = getCalendarDays(currentDate.getMonth(), currentDate.getFullYear());
      const cacheKey = `${currentDate.getMonth()}-${currentDate.getFullYear()}`;
      
      if (view === 'calendar') {
        if (panchangCache[cacheKey]) {
          setPanchangMap(panchangCache[cacheKey]);
        } else {
          const start = monthDays[0].dateStr;
          const end = monthDays[monthDays.length - 1].dateStr;
          const activeKey = `${currentDate.getMonth()}-${currentDate.getFullYear()}`;
          api.get(`/panchangam/range/?start=${start}&end=${end}`).then(res => {
            if (activeKey === `${currentDate.getMonth()}-${currentDate.getFullYear()}`) {
              const newData = res.data;
              setPanchangMap(newData);
              setPanchangCache(prev => ({ ...prev, [cacheKey]: newData }));
            }
          }).catch(err => console.error("Panchang load failed", err));
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (dateStr) => {
    window.location.href = `/pooja/book?date=${dateStr}`;
  };

  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
  };
  
  const prevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = getCalendarDays(month, year);
  const todayStr = formatDate(new Date());

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
      notify.error(t('download_failed', "Failed to download ticket."));
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
        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-5 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-lg shadow-slate-900/20 text-xs md:text-base">
                {year.toString().slice(-2)}
             </div>
             <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight uppercase">
                {getMonthName(month)} {year}
             </h2>
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-all" onClick={prevMonth}>
              <ChevronLeft size={18} />
            </button>
            <button className="flex-1 sm:flex-none px-5 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-all" onClick={() => setCurrentDate(new Date())}>
              {t('today', 'Current')}
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 transition-all" onClick={nextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-50">
          {weekDays.map(wd => (
            <div key={wd} className="py-3 md:py-4 text-center text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-white">
          {days.map((dayObj, idx) => {
            const { day, dateStr, isCurrentMonth } = dayObj;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === urlDate;
            const isSunday = idx % 7 === 0;
            const { bookings: dayBookings, events: dayEvents } = getItemsForDate(dateStr);
            const panData = panchangMap[dateStr] || {};

            return (
              <div
                key={idx}
                onClick={() => handleDateSelect(dateStr)}
                className={`min-h-[80px] md:min-h-[140px] p-2 md:p-4 border-r border-b border-slate-50 transition-all duration-300 relative group cursor-pointer
                    ${!isCurrentMonth ? 'bg-slate-50/20' : isToday ? 'bg-slate-900/5' : 'bg-white hover:bg-slate-50/50'}
                    ${isSelected ? 'ring-2 ring-inset ring-slate-900 z-10' : ''}
                `}
              >
                {/* Kerala Calendar Headers */}
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className={`text-[7px] md:text-[9px] font-bold hidden sm:block ${!isCurrentMonth ? 'text-slate-200' : 'text-slate-400'}`}>
                        {panData.malayalam_day || ''}
                    </span>
                    <span className={`text-[10px] md:text-[11px] font-black tracking-tighter ${!isCurrentMonth ? 'text-slate-200' : isSunday ? 'text-red-500' : 'text-slate-900'}`}>
                        {day.toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Nakshatra (Malayalam Script) - Hidden on very small screens */}
                <div className="mt-1 md:mt-4 text-center">
                    <div className={`text-[8px] md:text-[10px] font-bold truncate ${!isCurrentMonth ? 'text-slate-100' : 'text-slate-800'}`}>
                        {panData.nakshatra_ml || ''}
                    </div>
                    <div className="text-[6px] md:text-[7px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 hidden md:block">
                        {panData.nakshatra || ''}
                    </div>
                </div>
                
                {/* Event/Booking Dots */}
                <div className="absolute top-8 md:top-10 right-1 md:right-3 flex flex-col items-center gap-1 pointer-events-none">
                    {dayEvents.length > 0 && <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-orange-400" title="Event" />}
                    {dayBookings.length > 0 && <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-primary shadow-sm" title="Booking" />}
                </div>

                {/* Booking Labels - Hidden on mobile, shown as dots */}
                <div className="mt-1 md:mt-4 space-y-1 pointer-events-none overflow-hidden h-6 md:h-12 px-1 hidden md:block">
                    {dayBookings.slice(0, 2).map(b => (
                    <div key={b.id} className="px-2 py-0.5 rounded-md border border-slate-100 bg-slate-50/90 text-slate-800 text-[8px] font-bold uppercase tracking-tight truncate">
                        {b.pooja_name || b.prasadam_item_name || 'Ritual'}
                    </div>
                    ))}
                </div>
                {isToday && <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderList = () => {
    const columns = [
      {
        header: "Initial",
        key: "initial",
        hidden: true, // Hide initial column on mobile cards
        render: () => (
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
            <Layers size={16} />
          </div>
        )
      },
      {
        header: t('devotee', 'IDENTIFIER'),
        key: 'devotee_name',
        mobileLabel: "Devotee Details",
        render: (b) => (
          <>
            <div className="text-sm font-bold text-slate-900">{b.devotee_name || b.devotee?.full_name || '—'}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{b.devotee_phone || b.devotee?.phone || '—'}</div>
          </>
        )
      },
      {
        header: t('service', 'RITUAL NODE'),
        key: 'service',
        mobileLabel: "Service & Amount",
        render: (b) => (
          <>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
              {b.slot_time ? `${b.slot_time.slice(0, 5)} - ` : ''}
              {b.pooja_name || b.prasadam_item_name || '—'}
            </span>
            <div className="text-[9px] font-bold text-primary mt-1 uppercase tracking-widest">₹{(b.amount || 0).toLocaleString()} Credited</div>
          </>
        )
      },
      {
        header: t('date', 'TIMESTAMP'),
        key: 'booking_date',
        mobileLabel: "Date",
        render: (b) => (
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {new Date(b.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )
      },
      {
        header: t('status', 'AUDIT'),
        key: 'status',
        mobileLabel: "Current Status",
        render: (b) => (
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${getBadgeStyle(b.status)}`}>
            {b.status}
          </span>
        )
      },
      {
        header: t('actions', 'PROTOCOL'),
        key: 'actions',
        align: 'right',
        render: (b) => (
          <div className="flex items-center justify-end gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0">
            <button
              onClick={(e) => { e.stopPropagation(); downloadTicket(b.id); }}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              <Download size={14} />
            </button>
            {b.status !== 'cancelled' && checkPermission('bookings', 'edit') && (
              <button
                onClick={(e) => { e.stopPropagation(); cancelBooking(b.id); }}
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            )}
          </div>
        )
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <ResponsiveTable 
          columns={columns}
          data={bookings}
          loading={loading}
          emptyMessage="No bookings found for the current selection."
        />

        <div className="p-6 md:p-8 bg-slate-50/30 border-t border-slate-50 rounded-b-[2rem] md:rounded-b-[2.5rem]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            count={count}
            pageSize={pageSize}
          />
        </div>
      </motion.div>
    );
  };

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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Zap size={12} className="text-amber-500" /> Operational Protocol • synchronized v2.4
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setView('calendar')}
              className={`px-5 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${view === 'calendar' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layout size={14} /> {t('calendar')}
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-5 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${view === 'list' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={14} /> {t('list')}
            </button>
          </div>

          {checkPermission('bookings', 'edit') && (
            <button
                onClick={() => window.location.href = '/pooja/book'}
                className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all active:scale-95"
            >
                <Plus size={18} /> New Authorization
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin shadow-inner"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hydrating Schedule...</p>
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
                   <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2 block">{getMonthName(month)} {year}</span>
                   <h3 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase leading-none">
                     {selectedDayData.day}
                   </h3>
                   <div className="flex items-center gap-2 mt-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedDayData.bookings.length} Registered Rituals</p>
                   </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDayData(null);
                    setSearchParams({});
                  }}
                  className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-12 pb-32">
                {selectedDayData.events.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" /> Observatory
                    </h4>
                    <div className="space-y-4">
                      {selectedDayData.events.map(e => (
                        <div key={e.id} className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Sparkles size={40} /></div>
                           <span className="text-[8px] font-bold uppercase tracking-wider text-white/40 mb-2 block">Festival Record</span>
                           <h5 className="font-bold text-2xl tracking-tight leading-tight">{e.name}</h5>
                           <p className="text-xs text-white/50 mt-4 leading-relaxed">"{e.description || 'Traditional observance defined in temple registry.'}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-slate-900" /> Authorized Rituals
                  </h4>

                  {selectedDayData.bookings.length === 0 ? (
                    <div className="p-16 border-2 border-slate-100 border-dashed rounded-[2.5rem] text-center">
                       <Layers size={32} className="mx-auto text-slate-100 mb-4" />
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Protocol Entries</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDayData.bookings.map(b => (
                        <div key={b.id} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 transition-all flex items-center gap-5 group">
                           <div className="h-12 w-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                               <Clock size={16} />
                               <span className="text-[8px] font-bold mt-1 uppercase">Live</span>
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <h5 className="font-bold text-slate-900 text-sm tracking-tight truncate uppercase">
                                {b.slot_time ? `[${b.slot_time.slice(0, 5)}] ` : ''}
                                {b.pooja_name || b.prasadam_item_name || 'Ritual Service'}
                              </h5>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate">{b.devotee_name || 'Anonymous'} • {b.devotee_nakshatra || 'No Star'}</p>
                           </div>
                           <div className="text-right">
                              <div className="text-sm font-bold text-slate-900">₹{(b.amount || 0).toLocaleString()}</div>
                              <span className={`text-[8px] font-bold mt-2 uppercase tracking-widest border px-2 py-0.5 rounded ${getBadgeStyle(b.status)}`}>
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
                    <button 
                      onClick={() => window.location.href=`/pooja/book?date=${selectedDayData.dateStr}`} 
                      className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                    >
                        Initialize Ritual Portal <ArrowRight size={14} />
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
