import LegalLayout from './LegalLayout';

const TermsPage = () => {
    return (
        <LegalLayout title="Terms of Service" effectiveDate="April 2026">
            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">1. Using Our Software</h2>
                <p className="mb-6">
                    By using TempleSaaS, your temple committee agrees to follow these rules. This software is built to help temples manage poojas, accounts, and devotees safely.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">2. Monthly Payments</h2>
                <p className="mb-6">
                    TempleSaaS is a subscription service. You agree to pay the monthly or yearly fee for the plan you choose. Payments are made at the start of each month.
                </p>
                <ul className="space-y-4 text-sm">
                    <li>• Auto-Renewal: Your plan will renew automatically unless you cancel it before the month ends.</li>
                    <li>• Cancellation: You can stop using the software at any time, but we do not give refunds for the current month already paid.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">3. Responsible Use</h2>
                <p className="mb-6">
                    The temple committee is responsible for making sure the data entered into the software (like pooja amounts and devotee names) is correct. We are not responsible for any mistakes made by temple staff during entry.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">4. System Availability</h2>
                <p className="mb-6">
                    We try to keep the software running 24 hours a day. However, we are not responsible if the software is slow or down because of internet problems at your temple or general power failures.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">5. Data Privacy</h2>
                <p className="mb-6">
                    We promise to keep your temple's data safe and private. We will never sell your devotee lists or financial records to anyone else.
                </p>
            </section>
        </LegalLayout>
    );
};

export default TermsPage;
