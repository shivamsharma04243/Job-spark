import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function AlertsManage() {
  const alerts = [
    { id: 1, q: "React intern", loc: "Remote", exp: "Student", freq: "Weekly", active: true },
    { id: 2, q: "Data analyst", loc: "Bengaluru", exp: "0–2 yrs", freq: "Daily", active: false },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">Job Alerts</h1>
      <Card className="rounded-2xl mb-6">
        <CardHeader><CardTitle>Create alert</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-5 gap-3">
          <Input placeholder="Keywords" className="md:col-span-2" />
          <Input placeholder="Location" />
          <select className="rounded-xl border p-2 text-sm">
            <option>Experience</option><option>Student</option><option>Fresher</option><option>1–2 yrs</option>
          </select>
          <Button>Create</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {alerts.map((a) => (
          <Card key={a.id} className="rounded-2xl">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{a.q} — {a.loc}</p>
                <p className="text-sm text-slate-600">{a.exp} • {a.freq}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Active</label>
                <input type="checkbox" defaultChecked={a.active} />
                <Button variant="secondary">Edit</Button>
                <Button>Run now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
