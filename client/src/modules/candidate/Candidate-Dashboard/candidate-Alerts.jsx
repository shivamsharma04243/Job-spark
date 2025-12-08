
export default function AlertsManage() {
  const alerts = [
    { id: 1, q: "React intern", loc: "Remote", exp: "Student", freq: "Weekly", active: true },
    { id: 2, q: "Data analyst", loc: "Bengaluru", exp: "0–2 yrs", freq: "Daily", active: false },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Job Alerts</h2>
      
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="pb-3 px-6 pt-6 border-b border-slate-200">
          <h3 className="text-base font-semibold">Create alert</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-5 gap-3">
            <input placeholder="Keywords" className="md:col-span-2 text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
            <input placeholder="Location" className="text-sm rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500" />
            <select className="rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400">
              <option>Experience</option>
              <option>Student</option>
              <option>Fresher</option>
              <option>1–2 yrs</option>
            </select>
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200">
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{a.q} — {a.loc}</p>
                  <p className="text-slate-600 text-xs mt-1">{a.exp} • {a.freq}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-700">Active</label>
                    <input 
                      type="checkbox" 
                      defaultChecked={a.active}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs px-3 py-1.5 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                    Run now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}