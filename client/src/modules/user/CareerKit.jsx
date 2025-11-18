import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Navbar from "../../components/ui/Navbar";

export default function CareerKit() {
  const items = [
    {
      title: "Fresher Resume Template",
      desc: "ATS-friendly resume designed for 0–2 yrs.",
      cta: "Download",
    },
    {
      title: "Interview Prep: Top 50",
      desc: "Most asked questions for internships & entry roles.",
      cta: "Start",
    },
    {
      title: "Skill Guides",
      desc: "Roadmaps for Software, Data, Design, Marketing.",
      cta: "Explore",
    },
  ];
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-6">Career Kit</h1>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <Card key={it.title} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{it.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 mb-4">{it.desc}</p>
                <Button>{it.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
