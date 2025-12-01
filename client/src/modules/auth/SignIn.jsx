import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import api from "../../components/apiconfig/apiconfig";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
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
      const { data } = await api.post("/auth/login", { identifier, password });
      setMessage(data?.message || "Login successful");
      const role = data?.user?.role || "user";
      
      // Redirect based on role
      if (role === "recruiter") {
        window.location.href = "/recruiter-dashboard";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
          {/* Left Content - Hidden on mobile, shown on tablet and above */}
          <div className="hidden md:flex flex-col justify-center lg:w-2/5 px-4 lg:px-6">
            <div className="max-w-md mx-auto lg:mx-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900">
                Talk to HR directly &amp;
                <br />
                get a job with better salary!
              </h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">Get local jobs in your city!</p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:w-3/5">
            <Card className="w-full rounded-xl sm:rounded-2xl shadow-lg border border-blue-200">
              <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-blue-900">Sign in to HireSpark</CardTitle>
                <p className="mt-1 text-xs sm:text-sm text-blue-700">Welcome back! Enter your details.</p>
              </CardHeader>

              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <Input
                    className="rounded-lg sm:rounded-xl border-blue-300 p-2 sm:p-3 text-sm placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-500 w-full"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        document.getElementById("password-input").focus();
                      }
                    }}
                  />
                  
                  <div className="relative">
                    <Input
                      id="password-input"
                      className="rounded-lg sm:rounded-xl border-blue-300 p-2 sm:p-3 text-sm pr-10 placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-500 w-full"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                    <label className="inline-flex items-center gap-2 text-blue-700">
                      <input type="checkbox" className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Remember me</span>
                    </label>
                    <a href="/forgot" className="text-blue-600 hover:text-blue-800 font-medium">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full py-2 sm:py-3 text-white shadow-md bg-blue-600 hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    {loading ? "Please wait..." : "Sign In"}
                  </Button>
                </form>

                {message && (
                  <p className="text-green-600 text-xs sm:text-sm text-center">{message}</p>
                )}
                {error && (
                  <p className="text-red-600 text-xs sm:text-sm text-center">{error}</p>
                )}

                <p className="text-xs sm:text-sm text-center text-blue-700">
                  No account?{" "}
                  <a className="hover:underline text-blue-600 font-medium" href="/sign-up">
                    Create one
                  </a>
                </p>

                <p className="text-xs text-center text-blue-600">
                  By signing in, you agree to our <span className="underline">Terms</span> and{" "}
                  <span className="underline">Privacy Policy</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}