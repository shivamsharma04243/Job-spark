

export default function Companies() {
  const data = [
    { name: "CloudMints", roles: 8, tags: ["Software", "Data"] },
    { name: "PixelPath", roles: 3, tags: ["Design", "Product"] },
  ];
  return (

    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Companies</h1>
      <div className="grid md:grid-cols-3 gap-5">
        {data.map((c) => (
          <div key={c.name} className="rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">{c.name}</h3>
              <div className="mb-3 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700 bg-white">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Open roles: <b>{c.roles}</b>
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">View roles</button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

