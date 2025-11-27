import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
function Footer() {
    return (
    <footer className="mt-12 bg-slate-900 border-t border-slate-800 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-white grid place-items-center">
              <Sparkles size={18} />
            </div>
            <div className="font-bold">HireSpark</div>
          </div>
          <div className="text-sm text-slate-400">
            Helping students & freshers find early-career roles.
          </div>
        </div>

        <div>
          <div className="font-semibold mb-2">Product</div>
          <ul className="text-sm text-slate-400 text-white space-y-1">
            <li><Link to="/jobs"className="hover:text-orange-500">Jobs</Link></li>
            <li><Link to="/companies"className="hover:text-orange-500">Companies</Link></li>
            <li><Link to="/career-kit"className="hover:text-orange-500">Career Kit</Link></li>
            <li><Link to="dashboard/profile"className="hover:text-orange-500"> user-profile</Link></li>
            <li><Link to="dashboard/saved"className="hover:text-orange-500"> user-saved</Link></li>
            <li><Link to="dashboard/applied"className="hover:text-orange-500"> user-applied</Link></li>
            <li><Link to="dashboard/alerts"className="hover:text-orange-500"> user-alerts</Link></li>
            <li><Link to ="/RecruiterProfileform"className="hover:text-orange-500">RecruiterProfileform</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2 text-white">Company</div>
          <ul className="text-sm text-slate-400 text-white space-y-1">
            <li><Link to="/"className="hover:text-orange-500">home  </Link></li>
            <li><Link to="/alerts"className="hover:text-orange-500">alerts</Link></li>
            <li><Link to="/contact"className="hover:text-orange-500">Contact</Link></li>
            <li><Link to="jobs/:id"className="hover:text-orange-500">JobDetail</Link></li>
            <li><Link to="recruiter-profile"className="hover:text-orange-500">recruiter-profile</Link></li>
            <li><Link to="talent-hire"className="hover:text-orange-500">talent-hire</Link></li>
            <li><Link to="create-job"className="hover:text-orange-500">create-job</Link></li>
            <li><Link to="dashboard"className="hover:text-orange-500"> user-dashboard</Link></li>
            <li><Link to ="/recruiter-dashboard"className="hover:text-orange-500">recruiter-dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} HireSpark — Built with ❤️
      </div>
    </footer>
  );
  
}

export default Footer;
