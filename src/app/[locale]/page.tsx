export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-text-primary">
      <h1 className="text-4xl font-bold mb-4 font-sans">Wallflower</h1>
      <p className="text-lg text-text-secondary max-w-md text-center mb-6">
        Decision intelligence for Thai SMEs.
      </p>
      <div className="text-sm text-text-muted">
        Locale: <code className="px-2 py-1 bg-surface-subtle border border-border rounded">{locale}</code>
      </div>
    </main>
  );
}
