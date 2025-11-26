import React, { useEffect, useState } from "react";

/**
 * RecruiterProfileForm
 * - GETs existing profile from /api/recruiter/profile (if available)
 * - PUTs updates to /api/recruiter/profile
 *
 * Note:
 * - The server should protect these endpoints with requireAuth middleware
 *   which sets req.user from the JWT cookie.
 * - fetch uses credentials:'include' to send cookies for same-origin auth.
 */
export default function RecruiterProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const [form, setForm] = useState({
    company_name: "",
    company_website: "",
    company_type: "company", // company | consultancy | startup
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: ""
  });

  // Basic client-side validation
  const validate = () => {
    const errs = [];
    if (!form.company_name || form.company_name.trim().length < 2) errs.push("Company name is required.");
    if (form.company_website && !/^https?:\/\//i.test(form.company_website) && !/^[\w-]+\.[\w-.]+/.test(form.company_website)) {
      // allow plain domains or full urls, but don't be strict
      errs.push("Please provide a valid company website or leave it blank.");
    }
    if (!form.city) errs.push("City is required.");
    if (!form.address_line1) errs.push("Address line 1 is required.");
    return errs;
  };

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        // GET existing recruiter profile (server route)
        const res = await fetch("/api/recruiter/profile", {
          method: "GET",
          credentials: "include",
          headers: { "Accept": "application/json" }
        });

        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          // expect data.recruiter or data.profile based on your API; handle both
          const recruiter = data.recruiter || data.profile || data;
          if (recruiter) {
            setForm((f) => ({
              ...f,
              company_name: recruiter.company_name ?? "",
              company_website: recruiter.company_website ?? "",
              company_type: recruiter.company_type ?? "company",
              address_line1: recruiter.address_line1 ?? "",
              address_line2: recruiter.address_line2 ?? "",
              city: recruiter.city ?? "",
              state: recruiter.state ?? "",
              country: recruiter.country ?? "",
              pincode: recruiter.pincode ?? ""
            }));
          }
        } else if (res.status === 401) {
          // not authenticated — you may want to redirect or show message
          setMessage({ type: "error", text: "You must be signed in to edit your recruiter profile." });
        } else {
          // no profile yet or other error — keep defaults
        }
      } catch (err) {
        console.error("Fetch recruiter profile error:", err);
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const errors = validate();
    if (errors.length > 0) {
      setMessage({ type: "error", text: errors.join(" ") });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/recruiter/profile", {
        method: "PUT",
        credentials: "include", // send cookies for jwt auth
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: payload.message || "Profile saved successfully." });
        // If API returns recruiter object, update form with any normalized values
        if (payload.recruiter) {
          const r = payload.recruiter;
          setForm((f) => ({
            ...f,
            company_name: r.company_name ?? f.company_name,
            company_website: r.company_website ?? f.company_website,
            company_type: r.company_type ?? f.company_type,
            address_line1: r.address_line1 ?? f.address_line1,
            address_line2: r.address_line2 ?? f.address_line2,
            city: r.city ?? f.city,
            state: r.state ?? f.state,
            country: r.country ?? f.country,
            pincode: r.pincode ?? f.pincode
          }));
        }
      } else {
        // server responded with an error
        setMessage({ type: "error", text: payload.message || "Failed to save profile." });
      }
    } catch (err) {
      console.error("Save recruiter profile error:", err);
      setMessage({ type: "error", text: "Network or server error while saving profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Recruiter - Company Profile</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        >
          {message && (
            <div
              className={
                "mb-4 px-4 py-2 rounded " +
                (message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" :
                  "bg-red-50 border border-red-200 text-red-700")
              }
            >
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="py-6 text-center text-gray-500">Loading profile...</div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="Name of your company"
                  className="w-full px-4 py-3 rounded-md border border-gray-200"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Company Website</label>
                <input
                  name="company_website"
                  value={form.company_website}
                  onChange={handleChange}
                  placeholder="https://example.com (optional)"
                  className="w-full px-4 py-3 rounded-md border border-gray-200"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Company Type</label>
                <div className="flex gap-3 items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="company_type"
                      value="company"
                      checked={form.company_type === "company"}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2 text-sm">Company</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="company_type"
                      value="consultancy"
                      checked={form.company_type === "consultancy"}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2 text-sm">Consultancy</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="company_type"
                      value="startup"
                      checked={form.company_type === "startup"}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2 text-sm">Startup</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City <span className="text-red-500">*</span></label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address line 1 <span className="text-red-500">*</span></label>
                <input
                  name="address_line1"
                  value={form.address_line1}
                  onChange={handleChange}
                  placeholder="Shop/Building no., Street, Landmark..."
                  className="w-full px-4 py-3 rounded-md border border-gray-200"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address line 2 (optional)</label>
                <input
                  name="address_line2"
                  value={form.address_line2}
                  onChange={handleChange}
                  placeholder="Locality / Area / Additional info"
                  className="w-full px-4 py-3 rounded-md border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Pincode</label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Postal code"
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={
                    "px-6 py-2 rounded-full shadow text-white " +
                    (saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:brightness-95")
                  }
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
