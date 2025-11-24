import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";


export default function Alerts() {
  return (
   
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-6">Job Alerts</h1>
        <Card className="rounded-2xl">
          <CardHeader><CardTitle>Create an alert</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Keywords (e.g., React, Analyst)" />
            <Input placeholder="Location (Remote, Pune...)" />
            <div className="grid sm:grid-cols-3 gap-3">
              <select className="rounded-xl border p-2 text-sm">
                <option>Experience</option><option>Student</option><option>Fresher</option><option>1–2 yrs</option>
              </select>
              <select className="rounded-xl border p-2 text-sm">
                <option>Work mode</option><option>Remote</option><option>Hybrid</option><option>Office</option>
              </select>
              <select className="rounded-xl border p-2 text-sm">
                <option>Frequency</option><option>Daily</option><option>Weekly</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Name" />
              <Input placeholder="Email" />
            </div>
            <Button>Create Alert</Button>
          </CardContent>
        </Card>
      </div>
    
  );
}
