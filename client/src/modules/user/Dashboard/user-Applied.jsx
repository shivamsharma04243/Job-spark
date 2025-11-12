import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default function Applied() {
  const apps = [
    { id: 7, title: "Junior Data Analyst", company: "QuantLeaf", status: "Under Review" },
    { id: 8, title: "Business Ops Trainee", company: "MercuryOps", status: "Submitted" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">Applications</h1>
      <div className="space-y-3">
        {apps.map((a) => (
          <Card key={a.id} className="rounded-2xl">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-slate-600">{a.company}</p>
              </div>
              <Badge className="rounded-full">{a.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
