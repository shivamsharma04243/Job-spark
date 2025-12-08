import React, { useState, useEffect } from "react";
import api from "../../../components/apiconfig/apiconfig.jsx";

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
    // Ensure we are in the browser and script is loaded
    if (typeof window === "undefined" || !window.google || !window.google.accounts?.id) {
      console.error("Google Identity script not loaded or window.google is undefined.");
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is missing. Please set it in your client/.env file.");
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
        // width must be a number (px) per GIS docs; we handle 100% with CSS on the container
        width: 320,
        type: "standard",
        text: "signin_with", // "Sign in with Google"
      });
    }
  }, [role]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg">
        <div className="w-full rounded-2xl shadow-lg bg-white border border-gray-200">
          <div className="px-6 pt-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-semibold">
                {role === "recruiter"
                  ? "Sign in as Recruiter"
                  : "Sign in as Candidate"}
              </h2>
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
          </div>

          <div className="px-6 pb-6 space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}

