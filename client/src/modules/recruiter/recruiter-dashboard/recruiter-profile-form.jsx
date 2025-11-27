import React, { useEffect, useState } from "react";
import api from "../../../components/apiconfig/apiconfig";

/**
 * RecruiterProfileEdit (PUT-only)
 *
 * Props:
 *  - initialData: optional object to prefill the form (fetched by parent)
 *  - onSaved: optional callback after successful save
 *  - onCancel: optional callback (optional)
 *
 * This component DOES NOT perform GET.
 */
export default function RecruiterProfileEdit({ initialData = null, onSaved = null, onCancel = null }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    company_name: "",
    company_website: "",
    company_type: "company",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    verified: 0,
    verification_notes: ""
  });

  // Prefill only from initialData
  useEffect(() => {
    if (initialData) {
      setForm(f => ({
        ...f,
        company_name: initialData.company_name ?? "",
        company_website: initialData.company_website ?? "",
        company_type: initialData.company_type ?? "company",
        address_line1: initialData.address_line1 ?? "",
        address_line2: initialData.address_line2 ?? "",
        city: initialData.city ?? "",
        state: initialData.state ?? "",
        country: initialData.country ?? "",
        pincode: initialData.pincode ?? "",
        verified:
          typeof initialData.verified !== "undefined" && initialData.verified !== null
            ? (initialData.verified ? 1 : 0)
            : 0,
        verification_notes: initialData.verification_notes ?? ""
      }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }));
    setMessage(null);
  };

  const validate = () => {
    const errors = [];
    if (!form.company_name.trim()) errors.push("Company name is required.");
    if (!form.address_line1.trim()) errors.push("Address line 1 is required.");
    if (!form.city.trim()) errors.push("City is required.");
    if (form.pincode && !/^[0-9]{3,10}$/.test(form.pincode)) errors.push("Pincode must be 3-10 digits.");
    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);

    const errors = validate();
    if (errors.length) {
      setMessage({ type: "error", text: errors.join(" ") });
      return;
    }

    setSaving(true);

    try {
      const res = await api.put("/profile/recruiter", form);
      const payload = res.data || {};

      setMessage({ type: "success", text: payload.message || "Profile saved successfully." });

      if (typeof onSaved === "function") {
        onSaved(payload);
      }
    } catch (err) {
      if (err.response) {
        const msg = err.response.data?.message || "Failed to save profile.";
        setMessage({ type: "error", text: msg });
      } else {
        setMessage({ type: "error", text: "Network error while saving." });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Recruiter Profile</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        >
          {message && (
            <div
              className={`mb-4 px-4 py-2 rounded ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-2">Company Name *</label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Company Website</label>
            <input
              name="company_website"
              value={form.company_website}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border"
              placeholder="https://example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Company Type</label>
            <select
              name="company_type"
              value={form.company_type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border"
            >
              <option value="company">Company</option>
              <option value="consultancy">Consultancy</option>
              <option value="startup">Startup</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Address Line 1 *</label>
            <input
              name="address_line1"
              value={form.address_line1}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Address Line 2</label>
            <input
              name="address_line2"
              value={form.address_line2}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Pincode</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded border"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <input
              id="verified"
              type="checkbox"
              name="verified"
              checked={form.verified === 1}
              onChange={handleChange}
            />
            <label htmlFor="verified" className="text-sm">Verified</label>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Verification Notes</label>
            <textarea
              name="verification_notes"
              value={form.verification_notes}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => (onCancel ? onCancel() : window.history.back())}
              className="px-4 py-2 border rounded mr-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 rounded-full text-white ${
                saving ? "bg-gray-400" : "bg-blue-600 hover:brightness-95"
              }`}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
