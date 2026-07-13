import SearchBar from "@/components/SearchBar";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-24">
  <div className="grid md:grid-cols-2 gap-16 items-center">

    {/* Left Side */}
    <div>
     <p className="text-orange-600 font-semibold uppercase tracking-widest">
  INDIA'S TRUSTED SERVICE MARKETPLACE
</p>

<h1 className="mt-6 text-5xl font-bold">
  Find Trusted Local
  <br />
  Workers Near You
</h1>

<p className="mt-6 text-lg text-slate-600">
  Book verified plumbers, electricians, carpenters,
  painters and more in just a few clicks.
</p>

<div className="mt-8 flex gap-4">
  <button className="rounded-xl bg-orange-600 text-white px-6 py-3">
    Book a Worker
  </button>

  <button className="rounded-xl border px-6 py-3">
    Join as a Worker
  </button>
</div>
    </div>

    {/* Right Side */}
    <div className="flex justify-center">
      <img
        src="/hero-workers.png"
        alt="Workers"
        className="w-full max-w-md"
      />
    </div>

  </div>

  <div className="mt-12">
    <SearchBar />
  </div>
</section>
      
    </main>
    
    
  );
}
