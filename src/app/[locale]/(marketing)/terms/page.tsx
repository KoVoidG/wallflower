import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Wallflower',
  description: 'Terms and conditions for using Wallflower decision intelligence platform.',
};

export default function TermsPage() {
  return (
    <div className="py-24 md:py-32">
      <article className="mx-auto max-w-3xl px-6 md:px-8 prose-wallflower">
        <h1 className="text-[36px]/[44px] font-[650] text-text-primary mb-8">
          Terms of Service
        </h1>
        <p className="text-[13px]/[20px] text-text-muted mb-8">
          Last updated: July 2026
        </p>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">1. Service Description</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            Wallflower is a decision intelligence platform that helps Thai SME owners understand
            business health, detect risks, simulate decisions, and receive AI-assisted recommendations.
            Wallflower is a planning and warning tool — it is not an accounting system, legal adviser,
            tax adviser, investment adviser, lender, or autonomous business operator.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">2. No Guaranteed Outcomes</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            Wallflower provides information and projections based on your data and assumptions.
            We do not guarantee any business outcomes, funding approval, compliance status,
            or prediction accuracy. All simulations are based on stated assumptions and may
            differ significantly from actual results. Always verify major decisions with
            qualified professionals.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">3. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-[15px]/[24px] text-text-secondary">
            <li>Provide accurate and current business data</li>
            <li>Maintain the security of your account credentials</li>
            <li>Do not use the service for fraudulent or illegal purposes</li>
            <li>Understand that calculations depend on the accuracy of your inputs</li>
            <li>Seek professional advice for significant financial decisions</li>
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">4. AI-Generated Content</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            The AI Advisor feature generates recommendations based on your business data.
            AI-generated content is clearly labeled and should not be treated as professional
            financial advice. Deterministic calculations are separate from AI interpretations
            and remain accurate regardless of AI service availability.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">5. Data Ownership</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            You retain full ownership of your business data. We do not sell, share, or monetize
            your financial information. Your data is used solely to provide the service as described
            in our Privacy Policy.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">6. Service Availability</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            We strive to maintain service availability but do not guarantee uninterrupted access.
            Scheduled maintenance will be communicated in advance. Your calculated data and risk
            assessments remain functional even when the AI service is temporarily unavailable.
          </p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">7. Account Termination</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            You may delete your account at any time. Upon deletion, all data is permanently
            removed within 30 days. We reserve the right to suspend accounts that violate
            these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-[20px]/[28px] font-[600] text-text-primary">8. Contact</h2>
          <p className="text-[15px]/[24px] text-text-secondary">
            For questions about these terms, contact us at{' '}
            <a href="mailto:legal@wallflower.app" className="text-brand hover:text-brand-hover transition-colors">
              legal@wallflower.app
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
