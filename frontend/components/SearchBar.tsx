export default function SearchBar() {
  return (
    <div className="max-w-5xl mx-auto">
    <section className="mx-auto max-w-6xl px-6 -mt-10 relative z-20">
      <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="What service do you need?"
          className="flex-1 border rounded-xl px-4 py-3 outline-none"
        />

        <input
          type="text"
          placeholder="Your location"
          className="flex-1 border rounded-xl px-4 py-3 outline-none"
        />

        <button className="bg-orange-600 text-white rounded-xl px-8 py-3 hover:bg-orange-700">
          Search
        </button>

      </div>
    </section>
</div>
   
  );
}