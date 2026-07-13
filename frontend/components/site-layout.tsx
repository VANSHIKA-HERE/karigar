import type { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex min-h-[calc(100vh-96px)] flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
