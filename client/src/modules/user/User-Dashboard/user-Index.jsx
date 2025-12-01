import { Card, CardContent } from "../../../components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-lg text-gray-600">Welcome back! Here's your job search overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                U
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-lg border border-blue-200 w-fit">
            {[
              { name: "Overview", href: "/dashboard", active: true },
              { name: "Profile", href: "/dashboard/profile", active: false },
              { name: "Saved Jobs", href: "/dashboard/saved", active: false },
              { name: "Applied Jobs", href: "/dashboard/applied", active: false },
              { name: "Job Alerts", href: "/dashboard/alerts", active: false }
            ].map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab.active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
                {stat.progress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold">{stat.progress}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${stat.color} transition-all duration-500 ease-out`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="block p-6 bg-white rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 border-2`}>
                  {action.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{action.title}</h3>
                <p className="text-gray-600 leading-relaxed">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <a href="/dashboard/applied" className="text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors">
              View all activity →
            </a>
          </div>
          
          <div className="space-y-6">
            {[
              {
                type: "application",
                title: "Senior Frontend Developer",
                company: "TechCorp Inc.",
                status: "Under Review",
                time: "2 hours ago",
                statusColor: "bg-yellow-100 text-yellow-800 border border-yellow-200"
              },
              {
                type: "saved",
                title: "Product Manager",
                company: "StartupXYZ",
                status: "Saved",
                time: "1 day ago",
                statusColor: "bg-blue-100 text-blue-800 border border-blue-200"
              },
              {
                type: "alert",
                title: "New matching jobs",
                company: "Job Alerts",
                status: "5 new jobs",
                time: "2 days ago",
                statusColor: "bg-green-100 text-green-800 border border-green-200"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-6 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all duration-300 group">
                <div className="flex items-center space-x-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md ${
                    activity.type === 'application' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                    activity.type === 'saved' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                    'bg-green-100 text-green-600 border border-green-200'
                  } group-hover:scale-110 transition-transform`}>
                    {activity.type === 'application' ? '📨' : activity.type === 'saved' ? '💾' : '🔔'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{activity.title}</h4>
                    <p className="text-gray-600 font-medium">{activity.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${activity.statusColor}`}>
                    {activity.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-2 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}