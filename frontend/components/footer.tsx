import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Karigar. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="#" className="hover:text-slate-950 dark:hover:text-white">
            Terms
          </Link>
          <Link href="#" className="hover:text-slate-950 dark:hover:text-white">
            Privacy
          </Link>
          <Link href="#" className="hover:text-slate-950 dark:hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
