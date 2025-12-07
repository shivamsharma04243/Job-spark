import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function AlertsManage() {
  const alerts = [
    { id: 1, q: "React intern", loc: "Remote", exp: "Student", freq: "Weekly", active: true },
    { id: 2, q: "Data analyst", loc: "Bengaluru", exp: "0–2 yrs", freq: "Daily", active: false },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Job Alerts</h2>
      
      <Card className="bg-white rounded-xl border border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Create alert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-3">
            <Input placeholder="Keywords" className="md:col-span-2 text-sm" />
            <Input placeholder="Location" className="text-sm" />
            <select className="rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400">
              <option>Experience</option>
              <option>Student</option>
              <option>Fresher</option>
              <option>1–2 yrs</option>
            </select>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white text-sm">
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {alerts.map((a) => (
          <Card key={a.id} className="bg-white rounded-xl border border-slate-200">
            <CardContent className="p-4">
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
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs px-3 py-1.5">
                    Edit
                  </Button>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5">
                    Run now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}