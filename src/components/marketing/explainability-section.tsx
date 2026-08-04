'use client';

import { useState } from 'react';
import { CheckCircle2, FileText, Download } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

export function ExplainabilitySection() {
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  const bulletPoints = [
    'Executive summary with key insights',
    'Financial projections and KPIs',
    'Risk assessment and recommendations',
    'Export to PDF, Excel, or Print',
  ];

  return (
    <section id="reports" className="py-20 border-b border-border/60 bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Professional reports you can trust and share
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center text-left max-w-5xl mx-auto">
          {/* Left Column: Report Document Mockup Graphic */}
          <div className="p-6 rounded-2xl border-2 border-border-strong bg-surface shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-tertiary" />
                <span className="font-display text-xs font-bold text-text-primary">Executive Summary Report</span>
              </div>
              <span className="text-[10px] font-bold text-text-muted">CONFIDENTIAL</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border bg-surface-subtle space-y-1">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Business Overview</span>
                <span className="font-display text-xs font-bold text-text-primary block">Somchai Retail Store — Q2 2026</span>
                <p className="text-[11px] text-text-secondary font-medium leading-snug">
                  Cash runway remains healthy at 5.1 months. Inventory turnover increased by 15% following strategic pricing adjustments.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div className="p-3 rounded-xl border border-border bg-surface-subtle">
                  <span className="text-[10px] text-text-muted block">Projected Revenue</span>
                  <span className="text-emerald-600 dark:text-emerald-400">฿1,280,000</span>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface-subtle">
                  <span className="text-[10px] text-text-muted block">Risk Score</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Low (84/100)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bullet points + Button */}
          <div className="space-y-6">
            <ul className="space-y-4 text-sm font-semibold text-text-primary">
              {bulletPoints.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSampleModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-xl border border-border-strong bg-surface text-text-primary hover:bg-surface-hover transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="size-4 text-tertiary" />
                <span>View Sample Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Report Modal */}
      <Dialog open={sampleModalOpen} onClose={() => setSampleModalOpen(false)} size="lg" title="Sample Decision Report">
        <div className="space-y-4 text-left p-1">
          <p className="text-xs text-text-secondary font-medium">
            This is a preview of the exportable Wallflower Executive Decision Report generated for bank loans, investors, and team alignment.
          </p>

          <div className="p-5 rounded-2xl border-2 border-border-strong bg-surface-subtle space-y-4">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <div>
                <h4 className="font-display text-sm font-bold text-text-primary">Wallflower Executive Decision Report</h4>
                <p className="text-[11px] text-text-muted">Generated on 04 Aug 2026</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md">Verified Math Engine</span>
            </div>

            <div className="space-y-2 text-xs text-text-secondary font-medium">
              <p><strong>Business Name:</strong> Somchai Retail Store</p>
              <p><strong>Simulated Decision:</strong> Increase product prices by 5% across top 20 SKUs</p>
              <p><strong>Financial Impact:</strong> Monthly profit increases by ฿163,000 (+18%). Cash runway increases by +0.9 months.</p>
              <p><strong>AI Executive Summary:</strong> The price increase absorbs minor supplier inflation without reducing customer demand retention.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setSampleModalOpen(false)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-tertiary text-on-primary hover:bg-tertiary-hover transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
