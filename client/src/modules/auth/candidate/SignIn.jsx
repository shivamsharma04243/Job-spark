import { useState, useEffect } from "react";
import api from "../../../components/apiconfig/apiconfig";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      const role = data?.user?.role || "user";
      
      // Redirect based on role
      if (role === "recruiter") {
        window.location.href = "/recruiter-dashboard";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // GOOGLE LOGIN SUCCESS HANDLER
  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/auth/google", {
        credential: response.credential
      });

      const role = data?.user?.role || "user";
      window.location.href = role === "recruiter" ? "/recruiter-profile" : "/dashboard";
    } catch (err) {
      setError(err?.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // LOAD GOOGLE BUTTON
  useEffect(() => {
    // Make sure we are in the browser and the Google script has loaded
    if (typeof window === "undefined" || !window.google || !window.google.accounts?.id) {
      console.error("Google Identity script not loaded or window.google is undefined.");
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is missing. Please set it in your .env file.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSuccess,
    });

    const buttonContainer = document.getElementById("google-login-btn");
    if (buttonContainer) {
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-6xl rounded-2xl bg-[#eefcfb] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800">
              Talk to HR directly & get a job with better salary!
            </h1>
            <p className="mt-4 text-lg text-slate-500">Get local jobs in your city!</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl shadow-lg bg-white border border-gray-200">
              <div className="px-8 pt-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-semibold">Sign in to HireSpark</h2>
                <p className="mt-1 text-sm text-slate-500">Welcome back!</p>
              </div>

              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4 pt-6">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <input
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button disabled={loading} className="w-full rounded-full py-3 bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Please wait..." : "Sign In"}
                  </button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div id="google-login-btn" className="flex justify-center"></div>

                {message && <p className="text-green-600 text-sm text-center">{message}</p>}
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <p className="text-sm text-center">
                  No account? <a className="text-slate-800 hover:underline" href="/sign-up">Create one</a>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

