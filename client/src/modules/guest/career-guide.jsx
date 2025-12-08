import { Download, Play, BookOpen, Rocket, Award, TrendingUp } from "lucide-react";

export default function CareerKit() {
  const resources = [
    {
      title: "Professional Resume Templates",
      desc: "ATS-friendly resume templates designed specifically for freshers and 0–2 years experience",
      cta: "Download Template",
      icon: Download,
      color: "bg-blue-100 text-blue-600 border border-blue-200",
      stats: "5000+ Downloads"
    },
    {
      title: "Interview Preparation Kit",
      desc: "Top 50 most asked questions with model answers for internships and entry-level roles",
      cta: "Start Practicing",
      icon: Play,
      color: "bg-blue-100 text-blue-600 border border-blue-200",
      stats: "200+ Success Stories"
    },
    {
      title: "Career Skill Guides",
      desc: "Comprehensive roadmaps for Software Development, Data Science, UI/UX Design, and Digital Marketing",
      cta: "Explore Guides",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600 border border-blue-200",
      stats: "15+ Career Paths"
    },
    {
      title: "Cover Letter Builder",
      desc: "Create professional cover letters tailored to specific job applications in minutes",
      cta: "Build Now",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600 border border-blue-200",
      stats: "3000+ Created"
    },
    {
      title: "Portfolio Guide",
      desc: "Learn how to build an impressive portfolio even without professional experience",
      cta: "Get Started",
      icon: Award,
      color: "bg-blue-100 text-blue-600 border border-blue-200",
      stats: "Expert Approved"
    },
    {
      title: "Career Strategy Session",
      desc: "Personalized guidance to plan your career path and job search strategy",
      cta: "Book Session",
      icon: Rocket,
      color: "bg-blue-100 text-blue-600 border border-blue-200",
      stats: "Free Consultation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-200">
            <Rocket className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Success Kit</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to launch and grow your career. Professional resources designed for students and freshers.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div 
                key={resource.title} 
                className="rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${resource.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                      {resource.stats}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {resource.title}
                  </h3>
                </div>
                
                <div className="px-6 pt-0 pb-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {resource.desc}
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                    {resource.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="rounded-2xl border border-blue-200 shadow-lg mt-12 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Accelerate Your Career?</h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of students and freshers who have successfully launched their careers using our resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors">
                Explore All Resources
              </button>
              <button className="border border-white text-white hover:bg-blue-500 font-semibold px-8 py-3 rounded-xl transition-colors">
                Get Career Advice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

