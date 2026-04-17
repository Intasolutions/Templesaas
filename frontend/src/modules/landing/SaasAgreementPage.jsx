import LegalLayout from './LegalLayout';

const SaasAgreementPage = () => {
    return (
        <LegalLayout title="SaaS Agreement" effectiveDate="April 2026">
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">1. Master Services Framework</h2>
                <p className="font-medium text-slate-500 mb-6">
                    This SaaS Agreement ("Agreement") governs the institutional relationship between Devalayam Systems and the Temple Trust or Board ("the Client"). Acceptance of this Agreement is mandatory for access to all administrative dashboard modules.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">2. License Grant & Restrictions</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Devalayam grants the Client a non-exclusive, non-transferable, revocable license to use the "Temple Control Nexus" SaaS Platform solely for internal institutional administration.
                </p>
                <ul className="space-y-4 font-medium text-slate-500 text-sm">
                    <li>• Sublicensing: The Client shall not sublicense or distribute the access to unauthorized third parties.</li>
                    <li>• Integrity: Any attempt to reverse engineer the ritual automation engine or audit logs is a material breach.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">3. Data Protection & Sovereignty</h2>
                <p className="font-medium text-slate-500 mb-6">
                    All institutional data remains the intellectual and physical property of the Client. Devalayam provides the secure infrastructure and high-density interface for data management but does not claim ownership over devotee records or financial transactions.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">4. Pricing Model & Compliance</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Pricing is determined by the selected tier (Vivid 2.0, Heritage Enterprise, etc.) and is subject to the agreed SLA. B2B clients may negotiate custom billing cycles or procurement nodes through our institutional partner program.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">5. Liability & Indemnification</h2>
                <p className="font-medium text-slate-500 mb-6 uppercase tracking-tight text-xs opacity-80">
                    DEVALAYAM'S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE SERVICES SHALL NOT EXCEED THE TOTAL FEES PAID BY THE CLIENT DURING THE TWELVE (12) MONTHS PRIOR TO THE INCIDENT.
                </p>
            </section>
        </LegalLayout>
    );
};

export default SaasAgreementPage;
