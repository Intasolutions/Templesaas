import LegalLayout from './LegalLayout';

const TermsPage = () => {
    return (
        <LegalLayout title="Terms of Service" effectiveDate="April 2026">
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">1. Platform Scope & Acceptance</h2>
                <p className="font-medium text-slate-500 mb-6">
                    By accessing and utilizing Devalayam OS ("the Platform"), you, representing a Temple Trust, Devaswom Board, or authorized administrative body, agree to be bound by these Terms of Service. The Platform is provided by Devalayam Systems to facilitate heritage administration, receipt generation, and auditing.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">2. Subscription & Subscription Management</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Devalayam provides subscription-based software services. Subscriptions are billed on a monthly or annual basis in accordance with the selected tier. Institutional clients may request manual billing nodes for compliance with Devaswom financial processes.
                </p>
                <ul className="space-y-4 font-medium text-slate-500 text-sm">
                    <li>• Auto-renewal: All subscriptions automatically renew unless cancelled 30 days prior to the billing cycle.</li>
                    <li>• Cancellation: Cancellation of a subscription will take effect at the end of the current billing period. No partial refunds are issued for mid-cycle cancellations.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">3. Limitation of Liability</h2>
                <p className="font-medium text-slate-500 mb-6 uppercase tracking-tight text-xs opacity-80">
                    DEVALAYAM SYSTEMS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM THE USE OR INABILITY TO USE THE PLATFORM. THE INSTITUTION REMAINS SOLELY RESPONSIBLE FOR THE ACCURACY OF PHYSICAL CASH COUNTING AND RITUAL DISBURSEMENTS.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">4. Prohibited Misuse</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Users shall not utilize the Platform for unauthorized data scraping, reverse-engineering of the astral telemetry engine, or attempting to bypass multi-tenant isolation protocols between institutional nodes. Violation of these terms will result in immediate termination of service and potential legal action under the IT Act 2000.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">5. Uptime Disclaimer</h2>
                <p className="font-medium text-slate-500 mb-6">
                    While we strive for 99.9% availability, Devalayam OS is provided on an "as-is" basis. We are not responsible for site outages caused by regional infrastructure failures, internet connectivity issues at the temple complex, or sovereign power disruptions.
                </p>
            </section>
        </LegalLayout>
    );
};

export default TermsPage;
