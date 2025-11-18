import { Card, CardContent } from "../../../components/ui/card";

export default function  RecruiterDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-4">Recruiter Dashboard</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        <a className="px-3 py-1 rounded-full bg-slate-100" href="/recruiter-dashboard">Overview</a>
        <a className="px-3 py-1 rounded-full bg-slate-100" href="/profile">Profile</a>
        <a className="px-3 py-1 rounded-full bg-slate-100" href="/job-posted">Posted Jobs</a>

      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Profile completeness</p>
            <p className="text-3xl font-bold mt-2">90%</p>
            <div className="mt-3 h-2 rounded bg-slate-100">
              <div className="h-2 w-7/12 rounded bg-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Posted jobs</p>
            <p className="text-3xl font-bold mt-2">6</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Applications</p>
            <p className="text-3xl font-bold mt-2">2</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
