import type { Metadata } from 'next';
import { LegalLayout, type TocItem } from '@/components/legal/legal-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Wallflower',
  description: 'Privacy policy explaining data encryption, protection, and handling within Wallflower.',
};

const tocItems: TocItem[] = [
  { id: 'information-collected', title: '1. Information We Collect' },
  { id: 'how-used', title: '2. How Information is Processed' },
  { id: 'math-vs-ai', title: '3. Deterministic vs AI Isolation' },
  { id: 'storage-security', title: '4. Encryption & Data Security' },
  { id: 'third-parties', title: '5. Third-Party Disclosures' },
  { id: 'user-rights', title: '6. Your Rights & Data Portability' },
  { id: 'contact', title: '7. Privacy Contact' },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Wallflower protects your proprietary business metrics, transactions, and simulation models."
      effectiveDate="January 2026"
      lastUpdated="August 2026"
      version="v1.2-production"
      tocItems={tocItems}
    >
      <section id="information-collected" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          1. Information We Collect
        </h2>
        <p>
          To generate accurate financial simulations and health assessments, Wallflower processes the following operational business data provided by you:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>
            <strong>Account Credentials:</strong> Name, work email address, and authentication identifiers.
          </li>
          <li>
            <strong>Business Metadata:</strong> Company name, retail sector, employee headcount, and currency preferences.
          </li>
          <li>
            <strong>Financial Snapshot Metrics:</strong> Monthly revenue, cost of goods sold (COGS), operating payroll, rent, cash reserves, receivables, and debt commitments.
          </li>
          <li>
            <strong>Custom Simulation Variables:</strong> Price elasticity coefficients, hiring plans, and promotion budgets.
          </li>
        </ul>
      </section>

      <section id="how-used" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          2. How Information is Processed
        </h2>
        <p>
          We use your financial inputs strictly to:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Calculate real-time Business Health Scores and cash runway forecasts.</li>
          <li>Evaluate scenario simulations and multi-variable comparison matrices.</li>
          <li>Generate automated risk diagnoses and deadstock/margin compression warnings.</li>
          <li>Produce exportable Executive Decision Reports.</li>
        </ul>
      </section>

      <section id="math-vs-ai" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          3. Deterministic vs AI Isolation
        </h2>
        <p>
          Wallflower enforces a zero-data-leakage architecture between financial calculations and AI models:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li>
            <strong>Local Financial Processing:</strong> All financial arithmetic is computed using deterministic algebraic formulas.
          </li>
          <li>
            <strong>Zero AI Model Training:</strong> Your business records and financial numbers are never used to train, fine-tune, or improve public foundation models.
          </li>
          <li>
            <strong>Isolated AI Summarization:</strong> When you invoke the Capybot AI Co-pilot, only synthesized scenario differentials (e.g., &quot;+6% price yields +฿42k profit&quot;) are sent to the AI API to generate explanatory memos.
          </li>
        </ul>
      </section>

      <section id="storage-security" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          4. Encryption &amp; Data Security
        </h2>
        <p>
          We employ enterprise-grade security protocols:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>All stored data is encrypted at rest with AES-256 standards.</li>
          <li>All browser sessions communicate over secure TLS 1.3 encrypted channels.</li>
          <li>Granular role-based access controls for multi-user workspaces.</li>
        </ul>
      </section>

      <section id="third-parties" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          5. Third-Party Disclosures
        </h2>
        <p>
          We do not sell, license, or broker your personal or business financial data to third-party advertisers, data aggregators, or lending brokers.
        </p>
      </section>

      <section id="user-rights" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          6. Your Rights &amp; Data Portability
        </h2>
        <p>
          You have the right to export all your simulation data, scenario histories, and financial records in standard formats (CSV, Excel, PDF) at any time. You can also request complete deletion of your account and all associated models.
        </p>
      </section>

      <section id="contact" className="space-y-3">
        <h2 className="font-display text-xl font-bold text-text-primary border-b border-border/60 pb-2">
          7. Privacy &amp; Data Protection Officer Contact
        </h2>
        <p>
          If you have questions regarding our privacy practices or wish to exercise data rights, contact us at:
        </p>
        <div className="rounded-2xl border border-border bg-surface p-4 text-xs font-mono">
          Email: privacy@wallflower.app<br />
          Data Protection Office: Bangkok, Thailand
        </div>
      </section>
    </LegalLayout>
  );
}
