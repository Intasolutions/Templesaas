import LegalLayout from './LegalLayout';

const SaasAgreementPage = () => {
    return (
        <LegalLayout title="SaaS Agreement" effectiveDate="April 2026">
            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">1. Our Partnership</h2>
                <p className="mb-6">
                    This agreement is a professional promise between TempleSaaS and your Temple Trust. By using our software, you agree to these terms for your temple's digital management.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">2. Your Software License</h2>
                <p className="mb-6">
                    We give your temple a safe and private right to use our software for your daily work. You cannot sell this access to other people or organizations.
                </p>
                <ul className="space-y-4 text-sm">
                    <li>• Internal Use: The software is for your temple's use only.</li>
                    <li>• System Safety: Any attempt to break or change the software's code is a violation of this agreement.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">3. Your Data, Your Ownership</h2>
                <p className="mb-6">
                    Every name, birth star, and rupee recorded in the software belongs to the Temple Trust. We only provide the safe digital storage and tools for you to manage it. We do not own your temple's records.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">4. Fees & Plans</h2>
                <p className="mb-6">
                    Your monthly or yearly fees are based on the plan you have chosen (Lite, Pro, or Board). These fees help us keep the servers running and provide you with 24/7 support.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-black text-wood mb-6 uppercase tracking-tight">5. Limited Liability</h2>
                <p className="mb-6">
                    While we work hard to keep everything perfect, we are not responsible for any indirect problems caused by using the software. Our total responsibility is limited to the fees you have paid us in the last 12 months.
                </p>
            </section>
        </LegalLayout>
    );
};

export default SaasAgreementPage;
