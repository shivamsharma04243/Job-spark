import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Navbar from "../../components/ui/Navbar";

export default function Companies() {
  const data = [
    { name: "CloudMints", roles: 8, tags: ["Software", "Data"] },
    { name: "PixelPath", roles: 3, tags: ["Design", "Product"] },
  ];
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-6">Companies</h1>
        <div className="grid md:grid-cols-3 gap-5">
          {data.map((c) => (
            <Card key={c.name} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <Badge key={t} variant="outline" className="rounded-full">
                      {t}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Open roles: <b>{c.roles}</b>
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1">View roles</Button>
                  <Button variant="secondary" className="flex-1">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
