import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Wallflower',
  description: 'How Wallflower collects, uses, and protects your business data.',
};

export default function PrivacyPage() {
  return (
    <div className="py-24 md:py-32">
      <article className="mx-auto max-w-3xl px-6 md:px-8 prose-wallflower">
        <h1 className="text-[36px]/[44px] font-[650] text-text-primary mb-8">
          Privacy Policy
        </h1>
        <p className="text-[13px]/[20px] text-text-muted mb-8">
          Last updated: July 2026
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">1. Information We Collect</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            Wallflower collects information you provide directly when creating an account and entering business data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[15px]/[24px] text-text-secondary">
            <li>Account information (name, email, password)</li>
            <li>Business profile (name, industry, stage, size, location, goals)</li>
            <li>Financial snapshots (revenue, expenses, cash reserves, receivables, payables, debt)</li>
            <li>Simulation inputs and preferences</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">2. How We Use Your Data</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            Your data is used exclusively to provide Wallflower&apos;s services:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[15px]/[24px] text-text-secondary">
            <li>Calculating business health metrics and risk assessments</li>
            <li>Running scenario simulations</li>
            <li>Generating AI-assisted recommendations</li>
            <li>Producing decision reports</li>
            <li>Improving service quality and accuracy</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">3. Data Security</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            We protect your data using industry-standard encryption in transit and at rest.
            Business financial data is stored in encrypted databases with strict access controls.
            We never share your financial data with third parties without explicit consent.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">4. AI Data Usage</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            When you use the AI Advisor feature, limited structured data is sent to Google Gemini
            for generating explanations and recommendations. We send only the minimum necessary
            context — never raw financial records or personal information beyond what is needed
            for the specific request.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">5. Data Retention</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            Your data is retained as long as your account is active. When you delete your account,
            all associated business data, simulations, and reports are permanently removed within
            30 days.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">6. Your Rights</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            You may access, export, correct, or delete your data at any time through your
            account settings. For questions about your data, contact us at privacy@wallflower.app.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">7. Contact</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            For privacy-related inquiries, reach us at{' '}
            <a href="mailto:privacy@wallflower.app" className="text-brand hover:text-brand-hover transition-colors">
              privacy@wallflower.app
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
