import LegalLayout from './LegalLayout';

const CookiePolicyPage = () => {
    return (
        <LegalLayout title="Cookie Policy" effectiveDate="April 2026">
            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">1. What are Cookies?</h2>
                <p className="mb-6">
                    Cookies are small files that are saved on your computer when you visit our website. We use them to help the software remember you and keep your temple dashboard working correctly.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">2. Necessary Cookies</h2>
                <p className="mb-6 leading-relaxed">
                    These cookies are absolutely needed for the software to work. Without them, you would not be able to log in or book poojas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white rounded-3xl border border-wood/5">
                        <h4 className="text-sm font-black text-wood mb-4 uppercase tracking-widest leading-none">Login Memory</h4>
                        <p className="text-sm text-wood/60 leading-relaxed">
                            This helps the software remember that you have already logged in so you don't have to enter your password on every page.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-wood/5">
                        <h4 className="text-sm font-black text-wood mb-4 uppercase tracking-widest leading-none">Security</h4>
                        <p className="text-sm text-wood/60 leading-relaxed">
                            These cookies protect your temple's financial records from unauthorized access while you are using the software.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">3. Performance Cookies</h2>
                <p className="mb-6">
                    We use some cookies to see how many people visit our website and which pages are most helpful. This helps us make the software faster for your temple staff.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">4. Managing Cookies</h2>
                <p className="mb-6">
                    You can turn off cookies in your web browser settings. However, if you turn off the "Necessary" cookies, you will not be able to log in to the TempleSaaS dashboard.
                </p>
            </section>
        </LegalLayout>
    );
};

export default CookiePolicyPage;
