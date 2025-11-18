import { Sparkles, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./button"; // <-- adjust path if needed

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-500 text-white grid place-items-center">
            <Sparkles size={18} />
          </div>
          <b className="text-lg">HireSpark</b>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-10 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/jobs" className="hover:text-white">Jobs</Link>
          <Link to="/companies" className="hover:text-white">Companies</Link>
          <Link to="/career-kit" className="hover:text-white">Career Kit</Link>
          <Link to="/why" className="hover:text-white">Why HireSpark</Link>
        </nav>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link to="/sign-in">
            <Button variant="ghost" className="text-white hover:bg-slate-800">
              Sign in
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Get Job Alerts
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
