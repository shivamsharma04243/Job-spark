import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Bell, Search, MapPin, Briefcase, Clock, Mail, User } from "lucide-react";

export default function Alerts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Job Alerts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get notified about the latest job opportunities that match your preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Alert Form */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border border-blue-200 shadow-lg">
              <CardHeader className="border-b border-blue-100 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-blue-600" />
                  Create New Alert
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Set up personalized job alerts and never miss the perfect opportunity
                </p>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Search Keywords */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    Job Keywords
                  </label>
                  <Input 
                    placeholder="e.g., React Developer, Data Analyst, Product Manager" 
                    className="border-blue-300 focus:border-blue-500 text-lg py-3"
                  />
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Preferred Location
                  </label>
                  <Input 
                    placeholder="e.g., Remote, Bangalore, Hyderabad" 
                    className="border-blue-300 focus:border-blue-500 text-lg py-3"
                  />
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      Experience Level
                    </label>
                    <select className="w-full rounded-xl border border-blue-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <option>Select Experience</option>
                      <option>Student / Intern</option>
                      <option>Fresher (0-1 years)</option>
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      Work Mode
                    </label>
                    <select className="w-full rounded-xl border border-blue-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <option>Select Work Mode</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>On-site</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Alert Frequency
                    </label>
                    <select className="w-full rounded-xl border border-blue-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <option>Select Frequency</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Your Name
                    </label>
                    <Input 
                      placeholder="Enter your full name" 
                      className="border-blue-300 focus:border-blue-500 text-lg py-3"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email Address
                    </label>
                    <Input 
                      placeholder="your.email@example.com" 
                      type="email"
                      className="border-blue-300 focus:border-blue-500 text-lg py-3"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl mt-4">
                  <Bell className="w-5 h-5 mr-2" />
                  Create Job Alert
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Benefits */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border border-blue-200 shadow-lg">
              <CardHeader className="border-b border-blue-100 pb-6">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Why Set Up Alerts?
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Save Time</h4>
                    <p className="text-sm text-gray-600">Get matched jobs automatically without daily searching</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Early Access</h4>
                    <p className="text-sm text-gray-600">Be among the first to apply to new opportunities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Custom Notifications</h4>
                    <p className="text-sm text-gray-600">Receive alerts based on your specific preferences</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Better Matches</h4>
                    <p className="text-sm text-gray-600">Get relevant job recommendations tailored for you</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts Preview */}
            <Card className="rounded-2xl border border-blue-200 shadow-lg mt-6">
              <CardHeader className="border-b border-blue-100 pb-6">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Active Alerts
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No active alerts yet</p>
                  <p className="text-gray-400 text-xs mt-1">Create your first alert to get started</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}