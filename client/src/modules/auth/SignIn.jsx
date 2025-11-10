import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      {/* Outer rounded pale background like the screenshot */}
      <div className="w-full max-w-6xl rounded-2xl bg-[#eefcfb] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left marketing column */}
          <div className="px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800">
              Talk to HR directly &amp;
              <br />
              get a job with better salary!
            </h1>
            <p className="mt-4 text-lg text-slate-500">Get local jobs in your city!</p>
          </div>

          {/* Right form card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl">Sign in to HireSpark</CardTitle>
                <p className="mt-1 text-sm text-slate-500">Welcome back! Enter your details.</p>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-4">
                <Input
                  className="rounded-xl border p-3 text-sm placeholder:text-slate-400"
                  placeholder="Email"
                />
                <Input
                  className="rounded-xl border p-3 text-sm"
                  placeholder="Password"
                  type="password"
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-slate-700">
                    <input type="checkbox" className="rounded" />
                    <span>Remember me</span>
                  </label>
                  <a href="/forgot" className="text-slate-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Primary sign-in button (pill style) */}
                <Button className="w-full rounded-full py-3 text-white shadow-md bg-emerald-600 ">
                  Sign In
                </Button>

                {/* Secondary / social button */}
                <Button
                  variant="secondary"
                  className="w-full rounded-xl py-3 border border-slate-200 bg-white hover:shadow-sm"
                >
                  Continue with Google
                </Button>

                <p className="text-sm text-center text-slate-600">
                  No account?{" "}
                  <a className="hover:underline text-slate-800 font-medium" href="/sign-up">
                    Create one
                  </a>
                </p>

                <p className="text-xs text-center text-slate-500">
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
