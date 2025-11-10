import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      {/* Outer rounded pale background like the screenshot */}
      <div className="w-full max-w-6xl rounded-2xl bg-[#eefcfb] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left marketing column */}
          <div className="px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800">
              Talk to HR directly &amp;<br />
              get a job with better salary!
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Get local jobs in your city!
            </p>
          </div>

          {/* Right form card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl">Fill Your Details </CardTitle>
                <p className="mt-1 text-sm text-slate-500">Mobile Number</p>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-4">
                {/* Optional name/email/password area (uncomment if needed) */}
                <Input className="rounded-xl p-3 text-sm" placeholder="Full name" />
                <Input className="rounded-xl p-3 text-sm" placeholder="Email" />
                <Input className="rounded-xl p-3 text-sm" placeholder="Password" type="password" />

                {/* Role select */}
                <select className="rounded-xl border p-3 w-full text-sm">
                  <option>I'm a Candidate</option>
                  <option>I'm an Employer</option>
                </select>

                {/* CTA (pill shaped) */}
                <Button className="w-full rounded-full py-3 text-white shadow-md bg-emerald-600 ">
                  Get Started &nbsp; &raquo;
                </Button>
                
                <p className="text-sm text-center text-slate-600">
                  You have already account {" "}
                  <a className="hover:underline text-slate-800 font-medium" href="/sign-in">
                    Sign In
                  </a>
                </p>

                <p className="text-xs text-slate-500 text-center">
                  By signing up, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
