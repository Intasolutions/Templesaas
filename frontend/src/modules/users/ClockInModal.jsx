import { useState } from "react";
import api from "../../shared/api/client";
import { MapPin, ShieldCheck, X, Loader2 } from "lucide-react";

const ClockInModal = ({ isOpen, onClose, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleClockIn = async () => {
        setLoading(true);
        setStatus("Acquiring GPS Coordination...");
        
        if (!navigator.geolocation) {
           alert("Geolocation is not supported by your browser.");
           setLoading(false);
           return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setStatus("Verifying Operational Area...");
            
            try {
                await api.post("/users/attendance/clock-in/", {
                    latitude,
                    longitude,
                    verification_method: 'geo'
                });
                setStatus("Attendance Verified.");
                setTimeout(() => {
                    onClose();
                    onRefresh();
                }, 1500);
            } catch (err) {
                alert(err.response?.data?.error || "Verification Failed. Out of range.");
            } finally {
                setLoading(false);
            }
        }, (error) => {
            alert("Error obtaining location. Please enable GPS.");
            setLoading(false);
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                <div className="p-8 text-center">
                    <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Operational Check-in</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Biometric & Geo-location Protocol</p>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-4 text-left">
                            <MapPin className="text-slate-900 shrink-0" size={18} />
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Geo-fencing Active</p>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Your coordinates must match the temple perimeter for valid verification.
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={handleClockIn}
                            disabled={loading}
                            className="w-full h-14 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {status}
                                </>
                            ) : "Initialize Verification"}
                        </button>

                        <button 
                            onClick={onClose}
                            className="w-full h-12 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
                        >
                            Abort Protocol
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClockInModal;
