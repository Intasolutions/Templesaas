import LegalLayout from './LegalLayout';

const PrivacyPage = () => {
    return (
        <LegalLayout title="Privacy Policy" effectiveDate="April 2026">
            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">1. Keeping Your Data Safe</h2>
                <p className="mb-6">
                    TempleSaaS respects the privacy of every temple and its devotees. We follow all Indian digital privacy laws to make sure your information is handled correctly.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">2. Information We Collect</h2>
                <p className="mb-8">
                    We only collect the minimum information needed to run your temple's daily operations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white rounded-3xl border border-wood/5">
                        <h4 className="text-sm font-black text-wood mb-4 uppercase tracking-widest">Temple Records</h4>
                        <p className="text-sm text-wood/60 leading-relaxed">
                            Financial registers, pooja receipts, Hundi collection logs, and staff attendance.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-3xl border border-wood/5">
                        <h4 className="text-sm font-black text-wood mb-4 uppercase tracking-widest">Devotee Details</h4>
                        <p className="text-sm text-wood/60 leading-relaxed">
                            Names, birth stars (Nakshatra), phone numbers, and pooja history for your temple records.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">3. Private Storage</h2>
                <p className="mb-6">
                    Every temple's data is kept in its own separate and private digital vault. We use high-level encryption (AES-256) so that no one outside your temple committee can see your records.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">4. No Selling of Data</h2>
                <p className="mb-6">
                    We DO NOT sell your temple's data or your devotees' phone numbers to anyone. Your information is only used by your temple to manage its daily traditions.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">5. Your Rights</h2>
                <p className="mb-6">
                    The temple committee has full control over their data. You can add, change, or delete any record in the software at any time.
                </p>
            </section>
        </LegalLayout>
    );
};

export default PrivacyPage;
