import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
        <p className="text-sm uppercase tracking-[0.4em] text-amber-700">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
          Back to home
        </Link>
      </div>
    </main>
  );
}
