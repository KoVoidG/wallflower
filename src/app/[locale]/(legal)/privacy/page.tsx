import type { Metadata } from 'next';
import { LegalLayout, type TocItem } from '@/components/legal/legal-layout';

export const metadata: Metadata = {
  title: 'Prototype Privacy Notice — Wallflower',
  description: 'Privacy notice explaining data handling within the Wallflower decision-intelligence frontend prototype.',
};

const tocItems: TocItem[] = [
  { id: 'data-handled', title: '1. Data Handled in Prototype' },
  { id: 'how-processed', title: '2. Deterministic vs AI Processing' },
  { id: 'ai-context', title: '3. AI API Context Usage' },
  { id: 'client-control', title: '4. Client Controls & Data Reset' },
  { id: 'contact-info', title: '5. Operator Contact' },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Prototype Privacy Notice"
      subtitle="This privacy notice outlines how business metrics and prototype inputs are handled within the Wallflower application."
      effectiveDate="October 2025"
      lastUpdated="July 2026"
      version="v0.1-prototype"
      tocItems={tocItems}
    >
      <section id="data-handled" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          1. Data Handled in Prototype
        </h2>
        <p>
          Wallflower processes inputs provided directly by the user during onboarding, snapshot entry, and decision simulation:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Basic account details (display name, email address)</li>
          <li>Business metadata (company name, industry sector, team size, fiscal start)</li>
          <li>Financial snapshot figures (revenue, expenses, cash reserves, receivables, payables, debt)</li>
          <li>Simulation scenario parameters & threshold preferences</li>
        </ul>
      </section>

      <section id="how-processed" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          2. Deterministic vs AI Processing
        </h2>
        <p>
          Financial calculations (runway months, profit margins, risk severities) are evaluated deterministically in client-side code. Financial data is never transmitted to external marketing brokers or third-party advertisers.
        </p>
      </section>

      <section id="ai-context" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          3. AI API Context Usage
        </h2>
        <p>
          When accessing AI Advisor insights, structured business metrics (e.g. runway months, risk titles) are sent to the Google Gemini API to generate explanation text and recommendations.
        </p>
        <p>
          Only relevant metrics are included in prompt requests; raw account passwords or unneeded personal identifiers are omitted.
        </p>
      </section>

      <section id="client-control" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          4. Client Controls & Data Reset
        </h2>
        <p>
          Because this is a client-side prototype, user inputs are maintained locally in browser memory and local storage.
        </p>
        <p>
          Users can clear or reset all prototype data at any time via <strong>Settings &gt; Data & Privacy</strong>.
        </p>
      </section>

      <section id="contact-info" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          5. Operator Contact
        </h2>
        <p>
          For privacy inquiries or feedback regarding data handling in the Wallflower prototype:
        </p>
        <div className="rounded-md border border-border bg-surface p-4 text-xs font-mono">
          Email: support@wallflower.app<br />
          Location: Bangkok, Thailand
        </div>
      </section>
    </LegalLayout>
  );
}
