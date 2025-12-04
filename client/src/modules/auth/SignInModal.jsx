import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import api from "../../components/apiconfig/apiconfig.jsx";

export default function SignInModal({ role = "user", onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  // LOAD GOOGLE BUTTON (Google Identity Services)
  useEffect(() => {
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSuccess,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
        type: "standard",
        text: "signin_with", // "Sign in with Google"
      }
    );
  }, [role]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg">
        <Card className="w-full rounded-2xl shadow-lg bg-white">
          <CardHeader className="px-6 pt-6 flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {role === "recruiter"
                  ? "Sign in as Recruiter"
                  : "Sign in as Candidate"}
              </CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Sign in with your Google account
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 text-xl leading-none"
            >
              ×
            </button>
          </CardHeader>

          <CardContent className="px-6 pb-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div id="google-login-btn" className="flex justify-center w-full" />

              {loading && (
                <p className="text-sm text-slate-500 text-center">
                  Please wait...
                </p>
              )}

              {message && (
                <p className="text-green-600 text-sm text-center">{message}</p>
              )}
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <p className="text-xs text-center text-slate-500">
                Currently signing in as{" "}
                <b>{role === "recruiter" ? "Recruiter" : "Candidate"}</b>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
