import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // replace with <a> if you're not using react-router
import api from "../../../components/apiconfig/apiconfig";

/**
 * RecruiterProfileView
 * - GETs recruiter profile using your axios instance
 * - Endpoint used: api.get('/recruiter/profile')
 *
 * If your server exposes GET at '/api/profile/recruiter' instead,
 * change the call to: api.get('/profile/recruiter')
 */
export default function RecruiterProfileView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const res = await api.get("/profile/recruiter"); // <-- adjust here if needed
        if (!mounted) return;
        setProfile(res.data?.recruiter ?? null);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError("You don't have a recruiter profile yet.");
          } else if (err.response.status === 401) {
            setError("You must be logged in to view this page.");
          } else {
            console.error("Server error loading recruiter profile:", err.response.data || err);
            setError("Failed to load profile (server error).");
          }
        } else {
          console.error("Network error loading recruiter profile:", err);
          setError("Failed to load profile (network error).");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded border border-red-100">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 text-yellow-800 px-6 py-4 rounded border border-yellow-100">
          No profile data available.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold">Your Recruiter Profile</h1>
          <Link
            to="/recruiter/profile/edit"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:brightness-95"
          >
            Edit
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          <Row label="Company Name" value={profile.company_name} />
          <Row label="Company Website" value={profile.company_website || "Not provided"} />
          <Row label="Company Type" value={profile.company_type || "Not provided"} />

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
            <Row label="Address line 1" value={profile.address_line1 || "Not provided"} />
            <Row label="Address line 2" value={profile.address_line2 || "Not provided"} />
            <Row label="City" value={profile.city || "Not provided"} />
            <Row label="State" value={profile.state || "Not provided"} />
            <Row label="Country" value={profile.country || "Not provided"} />
            <Row label="Pincode" value={profile.pincode || "Not provided"} />
          </div>

          <div className="pt-4 border-t">
            <Row
              label="Verified"
              value={typeof profile.verified !== "undefined" ? (profile.verified === 1 ? "Verified" : "Not verified") : "Unknown"}
            />
            <Row label="Verification notes" value={profile.verification_notes || "None"} />
            <Row label="Created at" value={profile.created_at ? new Date(profile.created_at).toLocaleString() : "—"} />
            <Row label="Updated at" value={profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "—"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-600 font-medium">{label}:</div>
      <div className="text-gray-900">{value ?? "—"}</div>
    </div>
  );
}
