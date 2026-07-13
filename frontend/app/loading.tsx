export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="animate-pulse rounded-3xl border border-slate-200 bg-white/90 px-8 py-10 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
        <p className="text-base font-medium">Loading Karigar...</p>
      </div>
    </div>
  );
}
