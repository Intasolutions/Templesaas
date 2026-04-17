import LegalLayout from './LegalLayout';

const PrivacyPage = () => {
    return (
        <LegalLayout title="Privacy Policy" effectiveDate="April 2026">
            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">1. Compliance Status</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Devalayam OS is fully compliant with the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023 (DPDP). This privacy policy outlines how we handle the institutional data of temple trusts and the personal data of devotees.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">2. Data Collection Metrics</h2>
                <p className="font-medium text-slate-500 mb-8">
                    We collect only the minimum data required to facilitate institutional administration and ritual automation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest leading-none">Institutional Data</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight opacity-70">
                            Temple financial registers, transaction hashes, hundi counting records, and staff administrative logs.
                        </p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest leading-none">Devotee Data</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight opacity-70">
                            Names, birth nakshatras, contact numbers (for receipt generation and WhatsApp notifications), and ritual history.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">3. Storage & Isolation</h2>
                <p className="font-medium text-slate-500 mb-6">
                    Every temple institution's data is siloed within its own private database node. We utilize industry-standard AES-256 encryption at rest and TLS 1.3 for all data in transit across the Devalayam network.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">4. Data Sharing & Third Parties</h2>
                <p className="font-medium text-slate-500 mb-6">
                    DEVALAYAM DOES NOT SELL DEVOTEE OR INSTITUTIONAL DATA. We only share data with authorized third-party service nodes (e.g., WhatsApp API, Secure Payment Gateways) solely for fulfilling service requests made by the Temple Trust.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">5. User Rights (Fiduciary Duty)</h2>
                <p className="font-medium text-slate-500 mb-6 font-mono text-sm leading-relaxed uppercase opacity-80">
                    UNDER DPDP 2023, DEVALAYAM SYSTEMS ACTS AS A DATA PROCESSOR, WHILE THE TEMPLE TRUST ACTS AS THE DATA FIDUCIARY. DEVOTEES MAY REQUEST RECORD MODIFICATIONS OR DELETIONS THROUGH THEIR RESPECTIVE TEMPLE ADMINISTRATIVE OFFICE.
                </p>
            </section>
        </LegalLayout>
    );
};

export default PrivacyPage;
