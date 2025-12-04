import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-12 bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand / description */}
          <div className="space-y-3 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center">
                <Sparkles size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Hire<span className="text-blue-600">Spark</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              A modern hiring platform that helps companies and candidates connect
              faster and more fairly.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/jobs" className="hover:text-blue-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-blue-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-600 transition-colors">
                  Companies
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
              Stay in the loop
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Get curated job alerts and hiring insights in your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-2 max-w-xs"
            >
              <div className="flex rounded-lg bg-slate-50 border border-slate-200 overflow-hidden">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 pt-4">
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} HireSpark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;