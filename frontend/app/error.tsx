"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-10 text-center shadow-xl dark:border-red-800 dark:bg-slate-900/90">
        <h1 className="text-3xl font-semibold text-red-700 dark:text-red-300">Something went wrong</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">An unexpected error occurred while loading the page.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
