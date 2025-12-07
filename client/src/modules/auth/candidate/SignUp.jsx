import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import api from "../../../components/apiconfig/apiconfig";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/auth/signup", { name, email, password, role });
      const userRole = data?.user?.role || role;

      window.location.href = userRole === "recruiter"
        ? "/recruiter-profile"
        : "/dashboard";

    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // GOOGLE SIGNUP
  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/auth/google", {
        credential: response.credential,
        role: role
      });

      const userRole = data?.user?.role || role;

      window.location.href = userRole === "recruiter"
        ? "/recruiter-profile"
        : "/dashboard";

    } catch (err) {
      setError(err?.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSuccess,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signup-btn"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-6xl rounded-2xl bg-[#eefcfb] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <div className="px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800">
              Talk to HR directly & get a job with better salary!
            </h1>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">

                  <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                  <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className="flex gap-2 p-2 border rounded-xl">
                      <input type="radio" name="role" value="user" checked={role === "user"} onChange={() => setRole("user")} />
                      <span>User</span>
                    </label>

                    <label className="flex gap-2 p-2 border rounded-xl">
                      <input type="radio" name="role" value="recruiter" checked={role === "recruiter"} onChange={() => setRole("recruiter")} />
                      <span>Recruiter</span>
                    </label>
                  </div>

                  <Button className="w-full rounded-full py-3 bg-emerald-600 text-white" disabled={loading}>
                    {loading ? "Please wait..." : "Get Started »"}
                  </Button>
                </form>

                <div className="my-4 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div id="google-signup-btn" className="flex justify-center"></div>

                {message && <p className="text-green-600 text-sm text-center">{message}</p>}
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <p className="text-sm text-center">
                  Already have an account? <a className="text-slate-800 hover:underline" href="/sign-in">Sign In</a>
                </p>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

