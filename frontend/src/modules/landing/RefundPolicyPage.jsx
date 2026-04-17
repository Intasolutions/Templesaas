import LegalLayout from './LegalLayout';

const RefundPolicyPage = () => {
    return (
        <LegalLayout title="Refunds & Billing" effectiveDate="April 2026">
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">1. Subscription Model</h2>
                <p className="font-medium text-slate-500 mb-6 font-mono text-sm leading-relaxed uppercase opacity-80">
                    DEVALAYAM OS IS PROVIDED ON A RECURRING SUBSCRIPTION BASIS (MONTHLY OR ANNUAL). INSTITUTIONS ARE BILLED BASED ON SELECTED MODULES AND NODE DEPLOYMENTS.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">2. Auto-Renewal Terms</h2>
                <p className="font-medium text-slate-500 mb-6">
                    All institutional subscriptions are set to auto-renew to ensure continuous uptime and prevent mission-critical ritual booking outages. Invoices are generated 7 days prior to renewal.
                </p>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-[0.2em] opacity-80">
                        Automatic renewal may be deactivated via the <span className="text-slate-900 font-bold tracking-tight">Billing & Settings</span> node within the administrative dashboard.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">3. Refund Conditions</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Payments made for subscriptions are non-refundable. Since Devalayam provides immediate provisioning of cloud infrastructure and node capacity, we do not offer partial refunds for unused time in a billing cycle.
                </p>
                <ul className="space-y-4 font-medium text-slate-500 text-sm">
                    <li>• Institutional Errors: Fees paid for specific Vazhipadu bookings made by devotees through the gateway are managed by the Temple Trust's internal refund policy.</li>
                    <li>• Duplicate Billing: In the event of a verified duplicated billing system error, a full credit will be applied to the next billing cycle.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">4. Service Termination</h2>
                <p className="font-medium text-slate-500 mb-6">
                    In the event of institutional decommissioning, the Temple Trust must notify Devalayam 30 days in advance. Upon termination, institutional data is archived for 90 days before permanent node deletion.
                </p>
            </section>
        </LegalLayout>
    );
};

export default RefundPolicyPage;
