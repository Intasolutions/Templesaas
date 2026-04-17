import React, { useState, useEffect, useRef } from 'react';
import api from '../../shared/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
    Store, 
    MapPin, 
    Mail, 
    Phone, 
    Globe, 
    Palette, 
    Save, 
    Camera,
    Navigation2,
    Sparkles,
    CheckCircle2,
    X,
    LocateFixed,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function TempleProfilePage() {
    const { t } = useTranslation();
    const { tenant, updateTheme, setTenantData } = useAuth();
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        brand_color: '#f97316', // Orange-500
        latitude: '',
        longitude: '',
        authorized_signatory_name: '',
        authorized_signatory_designation: '',
    });

    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ 
                    ...prev, 
                    latitude: latitude.toFixed(6), 
                    longitude: longitude.toFixed(6) 
                }));
                setIsDetecting(false);
            },
            (err) => {
                console.error("Location detection failed", err);
                setIsDetecting(false);
            }
        );
    };

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                address: tenant.address || '',
                contact_email: tenant.contact_email || '',
                contact_phone: tenant.contact_phone || '',
                brand_color: tenant.brand_color || '#f97316',
                latitude: tenant.latitude || '10.5276',
                longitude: tenant.longitude || '76.2144',
                authorized_signatory_name: tenant.authorized_signatory_name || '',
                authorized_signatory_designation: tenant.authorized_signatory_designation || '',
            });
            if (tenant.logo) setLogoPreview(tenant.logo);
        }
    }, [tenant]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            // Prepare clean data
            const cleanData = { ...formData };
            
            // Remove fields not in the backend model
            delete cleanData.website;
            
            // Clean empty strings for numeric fields to avoid DRF validation errors
            if (cleanData.latitude === '') delete cleanData.latitude;
            if (cleanData.longitude === '') delete cleanData.longitude;

            let data;
            const hasLogoChange = !!logo;
            
            if (hasLogoChange) {
                data = new FormData();
                Object.entries(cleanData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                      data.append(key, value);
                    }
                });
                data.append('logo', logo);
            } else {
                data = cleanData;
            }

            const response = await api.patch('/core/profile/', data, {
                headers: hasLogoChange ? { 'Content-Type': 'multipart/form-data' } : {}
            });

            // Update local tenant state to reflect changes globally
            setTenantData(response.data);
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            // Show error notification here if needed
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'brand_color') {
            updateTheme(e.target.value);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24">
            {/* Premium Header Banner */}
            <div className="h-56 md:h-64 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950 to-orange-900" />
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-6 md:pb-8 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end gap-6"
                    >
                        {/* Logo Upload Section */}
                        <div className="relative group">
                            <div className="h-28 w-28 md:h-32 md:w-32 rounded-3xl bg-white p-1.5 shadow-2xl border-4 border-white/20 backdrop-blur-md overflow-hidden transform hover:scale-105 transition-all duration-500">
                                <div className="h-full w-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center relative shadow-inner">
                                    {logoPreview ? (
                                        <img 
                                            src={
                                                logoPreview.startsWith('data:') || 
                                                logoPreview.startsWith('blob:') || 
                                                logoPreview.startsWith('http') 
                                                ? logoPreview 
                                                : `${api.defaults.baseURL?.replace(/\/api\/?$/, '')}${logoPreview}`
                                            } 
                                            alt="Logo" 
                                            className="h-full w-full object-cover" 
                                        />
                                    ) : (
                                        <img src="/temple-logo-default.png" alt="Default" className="h-full w-full object-cover opacity-50 contrast-125" />
                                    )}
                                    
                                    {/* Hover Overlay */}
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                                    >
                                        <div className="flex flex-col items-center text-white">
                                            <Camera size={24} className="mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{t('change_logo', 'Change')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleLogoChange} 
                                className="hidden" 
                                accept="image/*" 
                            />
                        </div>

                        <div className="flex-1 mb-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md uppercase">
                                {formData.name || t('temple_name_placeholder', 'Your Temple Name')}
                            </h1>
                            <div className="flex items-center gap-2.5 mt-2">
                                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-bold text-orange-200 uppercase tracking-widest">
                                    {tenant?.plan || 'PRO'} Workspace
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/40" />
                                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    {tenant?.subdomain || 'mahadeva'}.temple.io
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Settings Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Temple Identity Card */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase leading-none">{t('identity_title', 'Identity & Contact')}</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{t('identity_desc', 'Essential details for your automation.')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput 
                                    label="Temple Display Name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    icon={Store}
                                    placeholder="Mahadeva Temple"
                                />
                                <FormInput 
                                    label="Official Email" 
                                    name="contact_email" 
                                    value={formData.contact_email} 
                                    onChange={handleChange} 
                                    icon={Mail}
                                    placeholder="contact@temple.com"
                                />
                                <FormInput 
                                    label="Contact Phone" 
                                    name="contact_phone" 
                                    value={formData.contact_phone} 
                                    onChange={handleChange} 
                                    icon={Phone}
                                    placeholder="+91 98765 43210"
                                />
                                <FormInput 
                                    label="Public Website" 
                                    name="website" 
                                    value={formData.website} 
                                    onChange={handleChange} 
                                    icon={Globe}
                                    />
                            </div>
                        </div>

                        {/* Official Signing Authority */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase leading-none">Signing Authority</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">Official details for authorized receipts.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput 
                                    label="Authorized Signatory Name" 
                                    name="authorized_signatory_name" 
                                    value={formData.authorized_signatory_name} 
                                    onChange={handleChange} 
                                    icon={Save}
                                    placeholder="e.g. K. Balakrishnan"
                                />
                                <FormInput 
                                    label="Official Designation" 
                                    name="authorized_signatory_designation" 
                                    value={formData.authorized_signatory_designation} 
                                    onChange={handleChange} 
                                    icon={Sparkles}
                                    placeholder="e.g. Executive Officer"
                                />
                            </div>
                        </div>

                        {/* Location Details Card */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl pointer-events-none" />
                            
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase leading-none">{t('location_title', 'Geographic Location')}</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{t('location_desc', 'Precise coordinates for calculations.')}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Physical Address</label>
                                    <div className="relative group">
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full p-5 pt-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 transition-all outline-none font-bold text-slate-800 resize-none shadow-inner text-sm"
                                            placeholder="Enter temple full address here..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 relative">
                                    <FormInput 
                                        label="Latitude" 
                                        name="latitude" 
                                        value={formData.latitude} 
                                        onChange={handleChange} 
                                        icon={Navigation2}
                                        small
                                    />
                                    <FormInput 
                                        label="Longitude" 
                                        name="longitude" 
                                        value={formData.longitude} 
                                        onChange={handleChange} 
                                        icon={Navigation2}
                                        small
                                        className="rotate-90"
                                    />
                                    
                                    <button 
                                        type="button"
                                        onClick={handleDetectLocation}
                                        disabled={isDetecting}
                                        className="absolute -top-12 right-0 h-10 px-4 rounded-xl bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isDetecting ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
                                        Detect Current Location
                                    </button>
                                </div>

                                {/* Map Visualization with Circle Radius */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Geofence Perimeter (500m Radius)</label>
                                    <div className="h-64 w-full rounded-3xl bg-slate-100 border border-slate-100 overflow-hidden relative shadow-inner">
                                        <MapPreview 
                                            lat={parseFloat(formData.latitude)} 
                                            lng={parseFloat(formData.longitude)} 
                                            radius={500} 
                                        />
                                        <div className="absolute bottom-4 left-4 z-[100] px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                            Verification Zone Active
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium px-2">
                                        Personnel check-ins are automatically verified when within this circle.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Column: Branding & Controls */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-inner">
                                    <Palette size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 tracking-tight uppercase transition-colors">{t('branding', 'Branding')}</h2>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Theme Accent Color</label>
                                    <div className="flex items-center gap-6">
                                        <div 
                                            className="h-20 w-20 rounded-[2rem] shadow-xl border-4 border-white ring-8 ring-slate-50 relative overflow-hidden group" 
                                            style={{ backgroundColor: formData.brand_color }} 
                                        >
                                            <input
                                                type="color"
                                                name="brand_color"
                                                value={formData.brand_color}
                                                onChange={handleChange}
                                                className="absolute inset-0 w-full h-full scale-150 cursor-pointer opacity-0"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <Sparkles className="text-white/40 group-hover:text-white/100 transition-colors" size={20} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-mono text-sm font-bold text-slate-800 uppercase tracking-widest">{formData.brand_color}</p>
                                            <p className="text-xs text-slate-400 font-medium mt-1">This color will be used for buttons, links, and highlights across the entire portal.</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                <div className="pt-4">
                                     <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={cn(
                                            "w-full py-5 rounded-3xl font-bold text-white shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group",
                                            success ? "bg-emerald-500" : "bg-primary active:scale-95 hover:bg-primary/90 shadow-primary/30"
                                        )}
                                    >
                                        {/* Glow Effect */}
                                        {!success && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}

                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : success ? (
                                            <>
                                                <CheckCircle2 size={22} className="animate-bounce" />
                                                <span className="tracking-widest uppercase text-sm">Update Successful</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={22} className="group-hover:scale-110 transition-transform" />
                                                <span className="tracking-widest uppercase text-sm">Save All Changes</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full mt-4 py-4 rounded-3xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Discard Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            {/* Animated Toast/Notification for success */}
            <AnimatePresence>
                {success && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 min-w-[320px] border border-white/10"
                    >
                        <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="font-bold tracking-tight text-lg">Changes Persisted</p>
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-[0.2em] mt-0.5">Temple profile is updated</p>
                        </div>
                        <button onClick={() => setSuccess(false)} className="ml-auto text-white/30 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MapPreview({ lat, lng, radius }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const circleInstance = useRef(null);
    const markerInstance = useRef(null);

    useEffect(() => {
        // Load Leaflet from CDN if not already loaded
        if (!window.L) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            
            document.head.appendChild(link);
            document.head.appendChild(script);
            
            script.onload = initMap;
        } else {
            initMap();
        }

        function initMap() {
            if (!mapRef.current) return;
            
            // Clean up old instance
            if (mapInstance.current) {
                mapInstance.current.remove();
            }

            const L = window.L;
            mapInstance.current = L.map(mapRef.current, {
                center: [lat || 10.5276, lng || 76.2144],
                zoom: 15,
                zoomControl: false,
                attributionControl: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
            
            updateLayer();
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const updateLayer = () => {
        const L = window.L;
        if (!L || !mapInstance.current || !lat || !lng) return;

        // Update View
        mapInstance.current.setView([lat, lng], 15);

        // Update/Create Marker
        if (markerInstance.current) {
            markerInstance.current.setLatLng([lat, lng]);
        } else {
            markerInstance.current = L.marker([lat, lng]).addTo(mapInstance.current);
        }

        // Update/Create Geofence Circle
        if (circleInstance.current) {
            circleInstance.current.setLatLng([lat, lng]);
            circleInstance.current.setRadius(radius);
        } else {
            circleInstance.current = L.circle([lat, lng], {
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                radius: radius,
                weight: 2,
                dashArray: '5, 10'
            }).addTo(mapInstance.current);
        }
    };

    useEffect(() => {
        updateLayer();
    }, [lat, lng, radius]);

    return <div ref={mapRef} className="h-full w-full z-0" />;
}

function FormInput({ label, icon: Icon, value, onChange, name, placeholder, small, className, type = "text" }) {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="space-y-1.5 group">
            <label className={cn(
                "text-[8px] font-bold uppercase tracking-widest transition-all duration-300 ml-1",
                isFocused ? "text-primary" : "text-slate-400"
            )}>
                {label}
            </label>
            <div className="relative">
                <Icon 
                    size={small ? 12 : 16} 
                    className={cn(
                        "absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none",
                        isFocused ? "text-primary" : "text-slate-300"
                    )} 
                />
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-11 md:h-12 pl-14 pr-6 rounded-xl bg-white border-2 transition-all duration-300 outline-none font-bold text-slate-800 shadow-sm text-[11px]",
                        isFocused ? "border-slate-900 shadow-xl shadow-slate-200" : "border-slate-100 hover:border-slate-200"
                    )}
                />
            </div>
        </div>
    );
}
