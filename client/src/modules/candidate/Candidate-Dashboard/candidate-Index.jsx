import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    {
      title: "Profile Completeness",
      value: "70%",
      description: "Complete your profile for better job matches",
      progress: 70,
      color: "bg-blue-500",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Saved Jobs",
      value: "6",
      description: "Jobs you're interested in",
      color: "bg-blue-600",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Applications",
      value: "2",
      description: "Jobs you've applied to",
      color: "bg-blue-700",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const quickActions = [
    {
      title: "Update Profile",
      description: "Complete your professional profile",
      href: "/dashboard/profile",
      icon: "📝",
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "Browse Jobs",
      description: "Find new opportunities",
      href: "/jobs",
      icon: "🔍",
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "Job Alerts",
      description: "Manage your notifications",
      href: "/dashboard/alerts",
      icon: "🔔",
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "Application Status",
      description: "Track your applications",
      href: "/dashboard/applied",
      icon: "📊",
      color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white rounded-xl border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
              {stat.progress && (
                <div className="mt-4">
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stat.color} transition-all duration-500`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Progress</span>
                    <span>{stat.progress}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="block p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-2xl mb-3`}>
                {action.icon}
              </div>
              <h4 className="font-medium text-slate-900 mb-1">{action.title}</h4>
              <p className="text-xs text-slate-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recommended jobs</h3>
          <Link to="/jobs" className="text-xs text-slate-500 hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          <div className="border border-slate-100 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Frontend Developer (React)</p>
              <p className="text-xs text-slate-500">TechZen • Bengaluru • 6–10 LPA</p>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50">
              View
            </button>
          </div>

          <div className="border border-slate-100 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Data Analyst – Entry Level</p>
              <p className="text-xs text-slate-500">Insightly • Remote • 4–6 LPA</p>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50">
              View
            </button>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent applications</h3>
          <Link to="/dashboard/applied" className="text-xs text-slate-500 hover:underline">
            Go to Applications
          </Link>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Backend Engineer (Node.js)</p>
              <p className="text-slate-500">Status: Under review</p>
            </div>
            <p className="text-slate-400">2 days ago</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Junior Data Engineer</p>
              <p className="text-slate-500">Status: Shortlisted</p>
            </div>
            <p className="text-slate-400">5 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}