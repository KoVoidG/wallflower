import type { Metadata } from 'next';
import { LegalLayout, type TocItem } from '@/components/legal/legal-layout';

export const metadata: Metadata = {
  title: 'Terms of Service — Wallflower',
  description: 'Terms and conditions governing the use of the Wallflower decision-intelligence platform.',
};

const tocItems: TocItem[] = [
  { id: 'purpose', title: '1. Platform Purpose & Scope' },
  { id: 'financial-rules', title: '2. Deterministic Math & AI' },
  { id: 'no-guarantees', title: '3. Advisory Nature & Disclaimer' },
  { id: 'data-security', title: '4. Data Security & Ownership' },
  { id: 'subscription', title: '5. Subscriptions & Billing' },
  { id: 'ip-rights', title: '6. Intellectual Property' },
  { id: 'contact', title: '7. Contact & Support' },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="These terms govern your access to and use of Wallflower's decision intelligence and financial simulation platform."
      effectiveDate="January 2026"
      lastUpdated="August 2026"
      version="v1.2-production"
      tocItems={tocItems}
    >
      <section id="purpose" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          1. Platform Purpose &amp; Scope
        </h2>
        <p>
          Wallflower provides financial simulation, risk diagnostics, and scenario modeling software engineered specifically for retail founders, store managers, and small-to-medium enterprise (SME) operators.
        </p>
        <p>
          By creating an account or accessing the platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
        </p>
      </section>

      <section id="financial-rules" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          2. Deterministic Math vs AI Explanations
        </h2>
        <p>
          Wallflower strictly separates mathematical computation from natural language AI generation:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>
            <strong>100% Deterministic Financial Engine:</strong> All financial formulas—including gross margins, cash runway months, working capital requirements, sensitivity matrices, and break-even points—are calculated using deterministic client-side algebraic models. AI is never permitted to perform numerical math.
          </li>
          <li>
            <strong>AI Co-pilot (Capybot):</strong> AI is used solely to generate plain-language narrative explanations, executive summaries, and comparative synthesis based on the deterministic numbers.
          </li>
        </ul>
      </section>

      <section id="no-guarantees" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          3. Advisory Nature &amp; Professional Disclaimer
        </h2>
        <p>
          Wallflower is a strategic planning and simulation software. It does not provide certified legal, auditing, formal tax, or accredited fiduciary financial advice.
        </p>
        <p>
          Simulations, projections, and sensitivity tests are models based on your inputs and assumptions. Actual real-world results may vary depending on macroeconomic conditions, competitor actions, customer behavior, and supplier dynamics.
        </p>
      </section>

      <section id="data-security" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          4. Data Security &amp; Ownership
        </h2>
        <p>
          You retain complete ownership of all business financial snapshots, point-of-sale data, and custom scenario variables uploaded to Wallflower.
        </p>
        <p>
          We employ AES-256 encryption at rest and TLS 1.3 encryption in transit. We will never sell, rent, or monetize your proprietary business financial records, nor do we use your private data to train public foundation models.
        </p>
      </section>

      <section id="subscription" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          5. Subscriptions, Trials &amp; Billing
        </h2>
        <p>
          Paid subscriptions (Pro Workspace and Multi-Branch Scale) are billed on a recurring monthly or annual basis. You may cancel your subscription at any time via your workspace settings.
        </p>
        <p>
          Upon cancellation, your workspace retains active access until the end of your paid billing period, after which your account reverts to the Free Starter tier without losing your historical models.
        </p>
      </section>

      <section id="ip-rights" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          6. Intellectual Property
        </h2>
        <p>
          The Wallflower brand, visual interfaces, algorithms, simulation mechanics, and software code are the exclusive intellectual property of Wallflower.
        </p>
      </section>

      <section id="contact" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          7. Support &amp; Legal Inquiries
        </h2>
        <p>
          If you have questions regarding these Terms of Service or need technical support with your workspace, please contact our team:
        </p>
        <div className="rounded-2xl border border-border bg-surface p-4 text-xs font-mono">
          Email: support@wallflower.app<br />
          Compliance Office: Bangkok, Thailand
        </div>
      </section>
    </LegalLayout>
  );
}
