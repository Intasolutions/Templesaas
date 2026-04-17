import LegalLayout from './LegalLayout';

const CookiePolicyPage = () => {
    return (
        <LegalLayout title="Cookie Policy" effectiveDate="April 2026">
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">1. Devalayam Cookies</h2>
                <p className="font-medium text-slate-500 mb-6 uppercase tracking-tight text-xs opacity-80">
                    DEVALAYAM OS USES COOKIES AND SIMILAR TRACKING TECHNOLOGIES TO PROVIDE CORE FUNCTIONALITY AND TRACK INSTITUTIONAL PERFORMANCE NODES.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">2. Strictly Necessary Cookies</h2>
                <p className="font-medium text-slate-500 mb-6 leading-relaxed">
                    These cookies are essential for you to browse the website and use its features, such as accessing secure areas (the admin dashboard) or processing Vazhipadu receipts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest leading-none">Authentication Tokens</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight opacity-70">
                            Required to maintain your institutional identity session between dashboard views.
                        </p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest leading-none">Security Cookies</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight opacity-70">
                            Ensures protection against Cross-Site Request Forgery (CSRF) during sensitive financial transactions.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">3. Functional & Analytical Cookies</h2>
                <p className="font-medium text-slate-500 mb-6">
                    We use these to understand how visitors interact with the marketing landing pages and the platform, which helps us optimize the "Temple Astral Telemetry" performance and dashboard speeds.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">4. Controlling Tracking</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Most web browsers allow you to control cookies through their settings preferences. However, disabling "Strictly Necessary" cookies will render the Devalayam OS control panel unusable.
                </p>
            </section>
        </LegalLayout>
    );
};

export default CookiePolicyPage;
