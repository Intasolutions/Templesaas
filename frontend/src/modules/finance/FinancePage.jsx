import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PieChart, TrendingUp } from "lucide-react";

export default function FinancePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-display font-black text-slate-800 tracking-tight flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30 text-white">
              <PieChart size={28} />
            </div>
            {t('finance', 'Finance')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-slate-500 mt-2 font-medium"
          >
            {t('finance_sub', 'Manage temple finances, expenses, and generate detailed reports.')}
          </motion.p>
        </div>
      </header>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 p-16 flex flex-col items-center justify-center text-center">
        <div className="text-emerald-200 mb-6"><TrendingUp size={80} /></div>
        <h2 className="text-2xl font-black text-slate-800">{t('module_coming_soon', 'Module Coming Soon')}</h2>
        <p className="text-slate-500 font-medium max-w-sm mt-2">{t('finance_coming_soon_desc', 'We are actively working on bringing powerful financial tools to help manage temple funds more effectively.')}</p>
      </div>
    </div>
  );
}
