import type { Metadata } from 'next';
import { LegalLayout, type TocItem } from '@/components/legal/legal-layout';

export const metadata: Metadata = {
  title: 'Prototype Terms of Service — Wallflower',
  description: 'Terms and conditions governing the Wallflower decision-intelligence frontend prototype.',
};

const tocItems: TocItem[] = [
  { id: 'purpose', title: '1. Prototype Purpose' },
  { id: 'financial-rules', title: '2. Financial Math vs AI' },
  { id: 'no-guarantees', title: '3. No Outcome Guarantees' },
  { id: 'data-state', title: '4. Prototype Client State' },
  { id: 'ip-rights', title: '5. Intellectual Property' },
  { id: 'contact', title: '6. Support & Contact' },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Prototype Terms of Service"
      subtitle="These terms explain the scope, limitations, and operational rules governing the Wallflower interactive frontend prototype."
      effectiveDate="October 2025"
      lastUpdated="July 2026"
      version="v0.1-prototype"
      tocItems={tocItems}
    >
      <section id="purpose" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          1. Prototype Purpose & Scope
        </h2>
        <p>
          Wallflower is a decision-intelligence planning and warning platform designed to assist Thai SME founders in assessing business health, detecting financial risks, and simulating strategic decisions.
        </p>
        <p className="bg-surface-subtle p-3 rounded-md border border-border/60 text-xs">
          <strong>Frontend Prototype Disclaimer:</strong> Wallflower is currently operated as an interactive frontend prototype. Live backend databases, automated credit-card billing, production user authentication, and legally binding commercial contracts are not integrated in this prototype release.
        </p>
      </section>

      <section id="financial-rules" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          2. Financial Math vs AI Explanations
        </h2>
        <p>
          Wallflower separates deterministic financial calculations from AI interpretations:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>
            <strong>Deterministic Financial Engine:</strong> All financial values (revenue, expenses, cash runway, gross margin, operating ratios) are computed deterministically in client TypeScript logic. AI models are never used to calculate financial math.
          </li>
          <li>
            <strong>AI Advisor Assistance:</strong> Natural-language recommendations and executive summaries are produced by Gemini AI API calls. AI outputs are explanatory and should never replace qualified professional judgment.
          </li>
        </ul>
      </section>

      <section id="no-guarantees" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          3. No Guaranteed Outcomes
        </h2>
        <p>
          Wallflower provides scenario simulations and risk indicators based on user-supplied inputs and assumptions.
        </p>
        <p>
          Wallflower does <strong>not</strong> guarantee financial success, loan approval, tax compliance, or prediction accuracy. Wallflower is a planning tool and is not an accounting system, certified auditor, legal adviser, tax consultant, or lender.
        </p>
      </section>

      <section id="data-state" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          4. Prototype Client State
        </h2>
        <p>
          Business snapshot entries, preferences, and scenario inputs created within this prototype are maintained in client-side prototype state (browser storage and React state).
        </p>
        <p>
          Users can reset prototype data or clear saved business inputs at any time via the <strong>Data & Privacy</strong> section in Settings.
        </p>
      </section>

      <section id="ip-rights" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          5. Intellectual Property
        </h2>
        <p>
          The Wallflower platform interface, design system tokens, risk engine rules, and simulation models are the intellectual property of the Wallflower Team.
        </p>
      </section>

      <section id="contact" className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          6. Support & Contact
        </h2>
        <p>
          For inquiries, feedback, or platform assistance regarding these Prototype Terms of Service, contact the operator team at:
        </p>
        <div className="rounded-md border border-border bg-surface p-4 text-xs font-mono">
          Email: support@wallflower.app<br />
          Location: Bangkok, Thailand
        </div>
      </section>
    </LegalLayout>
  );
}
