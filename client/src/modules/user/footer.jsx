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
          <ul className="text-sm text-slate-400 space-y-1">
            <li><Link to="/jobs">Jobs</Link></li>
            <li><Link to="/companies">Companies</Link></li>
            <li><Link to="/career-kit">Career Kit</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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
