import LegalLayout from './LegalLayout';

const RefundPolicyPage = () => {
    return (
        <LegalLayout title="Refunds & Billing" effectiveDate="April 2026">
            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">1. Monthly Subscriptions</h2>
                <p className="mb-6">
                    TempleSaaS works on a monthly or yearly plan. Once you pay for a month, you have full access to the software for that entire period.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">2. Automatic Payments</h2>
                <p className="mb-6">
                    To make sure your temple's counters never stop working, your plan will automatically renew each month. You will receive a clear bill on your registered email.
                </p>
                <div className="p-8 bg-white rounded-3xl border border-wood/5">
                    <p className="text-sm text-wood/60 leading-relaxed">
                        You can turn off automatic renewal anytime in the <strong>Settings</strong> page of your temple dashboard.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">3. No Refund Policy</h2>
                <p className="mb-6">
                    We do not offer refunds once a payment is made. Since we provide the software and server space immediately, we cannot return the money for the current month.
                </p>
                <ul className="space-y-4 text-sm">
                    <li>• Devotee Refunds: If a devotee asks for a refund for a pooja booking, that must be handled by the temple office directly using the temple's own rules.</li>
                    <li>• Double Payments: If you are accidentally charged twice for the same month, we will correct the mistake and apply the extra money to your next month's bill.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">4. Stopping Service</h2>
                <p className="mb-6">
                    If your temple committee decides to stop using the software, please let us know. We will keep your temple data safe for 90 days in case you change your mind, after which it will be permanently deleted.
                </p>
            </section>
        </LegalLayout>
    );
};

export default RefundPolicyPage;
