import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import api from "../../components/apiconfig/apiconfig";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const { data } = await api.post("/auth/signup", {
        username,
        email,
        password,
        role,
      });
      setMessage(data?.message || "Signup successful");
      // Auto-login: server sets auth cookie; redirect based on role
      window.location.href =
        role === "recruiter" ? "/recruiter-profile" : "/dashboard";
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-6xl rounded-2xl bg-[#eefcfb] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800">
              Talk to HR directly &amp;
              <br />
              get a job with better salary!
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Get local jobs in your city!
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl">Fill Your Details </CardTitle>
                <p className="mt-1 text-sm text-slate-500">
                  Create your account
                </p>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    className="rounded-xl p-3 text-sm"
                    placeholder="Full name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        document.getElementById("email-input").focus();
                      }
                    }}
                  />
                  <Input
                    id="email-input"
                    className="rounded-xl p-3 text-sm"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        document.getElementById("password-input").focus();
                      }
                    }}
                  />
                  <Input
                    id="password-input"
                    className="rounded-xl p-3 text-sm"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className="flex items-center gap-2 p-2 border rounded-xl">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === "user"}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <span>User</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 border rounded-xl">
                      <input
                        type="radio"
                        name="role"
                        value="recruiter"
                        checked={role === "recruiter"}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <span>Recruiter</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full py-3 text-white shadow-md bg-emerald-600 "
                  >
                    {loading ? "Please wait..." : "Get Started »"}
                  </Button>
                </form>

                {message && (
                  <p className="text-green-600 text-sm text-center">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <p className="text-sm text-center text-slate-600">
                  You have already account{" "}
                  <a
                    className="hover:underline text-slate-800 font-medium"
                    href="/sign-in"
                  >
                    Sign In
                  </a>
                </p>

                <p className="text-xs text-slate-500 text-center">
                  By signing up, you agree to our{" "}
                  <span className="underline">Terms</span> and{" "}
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
