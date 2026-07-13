import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <Container>
      <section className="grid min-h-[calc(100vh-96px)] place-items-center py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/20 sm:p-12">
          <div className="max-w-3xl space-y-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-700">India-first service marketplace</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Built for customers and trusted local skilled workers.
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Karigar connects customers with electricians, plumbers, carpenters, painters, mechanics, cleaners, and more — with a modern, scalable foundation ready for production.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Button className="min-w-[200px]">Explore services</Button>
              <Button variant="secondary" className="min-w-[200px]">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
