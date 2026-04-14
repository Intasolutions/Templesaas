import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

export default function LanguageSwitcher() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-10 px-3 rounded-xl flex items-center gap-2 transition-all duration-200 border
                    ${isOpen
                        ? 'bg-white border-orange-200 shadow-sm ring-4 ring-orange-50'
                        : 'bg-slate-50 border-transparent hover:bg-slate-100'
                    }
                `}
            >
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                    <Globe size={16} className="text-orange-600" />
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                    {currentLang.native}
                </span>
                <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-2 bg-slate-50/50 border-b border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 px-3 tracking-widest">{t('select_language')}</span>
                    </div>
                    <div className="p-1.5">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group
                                    ${i18n.language === lang.code
                                        ? 'bg-orange-50 text-orange-700 font-bold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold">{lang.native}</span>
                                    <span className="text-[10px] text-slate-400 group-hover:text-slate-500 font-medium">{lang.label}</span>
                                </div>
                                {i18n.language === lang.code && (
                                    <div className="h-6 w-6 rounded-full bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
