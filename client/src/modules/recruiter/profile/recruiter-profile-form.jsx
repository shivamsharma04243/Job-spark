import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../components/toast";
import api from "../../../components/apiconfig/apiconfig";
import { citiesByState, stateOptions } from "../../../constants/locationData";

export default function RecruiterProfileForm({ initialData = null, onSaved = null, onCancel = null }) {
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({}); // Add errors state for real-time validation

  const [form, setForm] = useState({
    company_name: "",
    company_website: "",
    company_type: "company",
    hr_name: "",
    hr_mobile: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "India",
    pincode: ""
  });

  // Derived list of cities for currently selected state
  const citiesForSelectedState = form.state ? citiesByState[form.state] || [] : [];

  // Validation patterns matching backend inputValidation.js
  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case 'company_name':
        if (!trimmedValue) return "Company name is required";
        // Removed character restriction - allows any characters
        return "";

      case 'company_website':
        if (trimmedValue && !/^$|^https?:\/\/[a-zA-Z0-9\-_\.]+(\.[a-zA-Z]{2,})+(\/[a-zA-Z0-9\-_\.\/\?\&\=\#\%\+]*)?$/.test(trimmedValue)) {
          return "Please enter a valid URL (e.g., https://example.com)";
        }
        return "";

      case 'hr_name':
        if (!trimmedValue) return "HR name is required";
        if (!/^[a-zA-Z\s\-']+$/.test(trimmedValue)) {
          return "HR name can only contain letters, spaces, hyphens, and apostrophes";
        }
        return "";

      case 'hr_mobile':
        if (!trimmedValue) return "HR mobile number is required";
        if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
          return "Please enter a valid 10-digit Indian mobile number starting with 6-9";
        }
        return "";

      case 'address_line1':
        if (!trimmedValue) return "Address line 1 is required";
        return "";

      case 'city':
        if (!trimmedValue) return "City is required";
        return "";

      case 'state':
        if (!trimmedValue) return "State is required";
        return "";

      case 'pincode':
        if (trimmedValue) {
          const num = Number(trimmedValue);
          if (isNaN(num) || !Number.isInteger(num) || num < 0) {
            return "Pincode must be a valid positive number";
          }
          // Indian pincode is 6 digits
          if (trimmedValue.length !== 6) {
            return "Pincode must be exactly 6 digits";
          }
        }
        return "";

      default:
        return "";
    }
  };

  // Prefill only from initialData
  useEffect(() => {
    if (initialData) {
      setForm(f => ({
        ...f,
        company_name: initialData.company_name ?? "",
        company_website: initialData.company_website ?? "",
        company_type: initialData.company_type ?? "company",
        hr_name: initialData.hr_name ?? "",
        hr_mobile: initialData.hr_mobile ?? "",
        address_line1: initialData.address_line1 ?? "",
        address_line2: initialData.address_line2 ?? "",
        city: initialData.city ?? "",
        state: initialData.state ?? "",
        country: "India",
        pincode: initialData.pincode ?? ""
      }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

    setForm(f => ({
      ...f,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    setMessage(null);
  };

  // Handle field blur for real-time validation
  const handleBlur = e => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle state change separately so we can reset city when state changes
  const handleStateChange = e => {
    const { value } = e.target;
    setForm(f => ({
      ...f,
      state: value,
      city: "" // clear city selection when state changes
    }));

    // Clear errors for state and city
    setErrors(prev => ({
      ...prev,
      state: "",
      city: ""
    }));

    setMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    // Validate all required fields
    Object.keys(form).forEach(field => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });

    // Additional validation: state is required if city is selected
    if (form.city && !form.state) {
      newErrors.state = "State is required when city is selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function for input styling
  const getInputClass = (fieldName) => {
    const baseClass = "w-full px-4 py-3 rounded border";
    return errors[fieldName] ? `${baseClass} border-red-400 focus:border-red-500` : `${baseClass} focus:border-blue-500`;
  };

  // Helper function for select styling
  const getSelectClass = (fieldName) => {
    const baseClass = "w-full px-4 py-3 rounded border";
    return errors[fieldName] ? `${baseClass} border-red-400 focus:border-red-500` : `${baseClass} focus:border-blue-500`;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Prevent multiple submissions
    if (saving) {
      return;
    }

    setMessage(null);

    if (!termsAccepted) {
      showError("Please confirm that all company details are accurate and accept the Terms & Conditions.");
      return;
    }

    // Validate all fields before submission
    if (!validate()) {
      showError("Please correct the errors below before submitting.");
      return;
    }

    // Set saving state immediately to prevent duplicate clicks
    setSaving(true);

    try {
      const res = await api.put("/recruiter-profile/recruiter", form);
      const payload = res.data || {};

      showSuccess(payload.message || "Profile saved successfully.");

      // Call callback if provided
      if (typeof onSaved === "function") {
        onSaved(payload);
      }

      // Always redirect to recruiter-profile after successful save
      // Use window.location.href to force full page reload and ensure fresh data
      setTimeout(() => {
        window.location.href = "/recruiter-profile";
      }, 1500);
    } catch (err) {
      // Re-enable button on error
      setSaving(false);

      if (err.response) {
        const msg = err.response.data?.message || "Failed to save profile.";
        showError(msg);
      } else {
        showError("Network error while saving.");
      }
    }
    // Note: Don't set saving to false in finally block if redirecting on success
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Create Recruiter Profile</h2>
        <p className="text-sm text-gray-600 mb-6">
          Complete your company profile to start posting jobs and managing applications.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        >
          {message && (
            <div
              className={`mb-4 px-4 py-2 rounded ${message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-primary-50 border border-primary-200 text-primary-700"
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
              onBlur={handleBlur}
              className={getInputClass("company_name")}
              placeholder="Enter company name"
            />
            {errors.company_name && <p className="text-xs text-red-600 mt-1.5">{errors.company_name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Company Website</label>
            <input
              name="company_website"
              value={form.company_website}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass("company_website")}
              placeholder="https://example.com"
            />
            {errors.company_website && <p className="text-xs text-red-600 mt-1.5">{errors.company_website}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Company Type</label>
            <select
              name="company_type"
              value={form.company_type}
              onChange={handleChange}
              className={getSelectClass("company_type")}
            >
              <option value="company">Company</option>
              <option value="consultancy">Consultancy</option>
              <option value="startup">Startup</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">HR Name *</label>
              <input
                name="hr_name"
                value={form.hr_name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("hr_name")}
                placeholder="Enter HR name"
              />
              {errors.hr_name && <p className="text-xs text-red-600 mt-1.5">{errors.hr_name}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">HR Mobile *</label>
              <input
                name="hr_mobile"
                value={form.hr_mobile}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    handleChange({ target: { name: 'hr_mobile', value } });
                  }
                }}
                onBlur={handleBlur}
                className={getInputClass("hr_mobile")}
                placeholder="9876543210"
                type="tel"
                maxLength="10"
              />
              {errors.hr_mobile && <p className="text-xs text-red-600 mt-1.5">{errors.hr_mobile}</p>}
              {!errors.hr_mobile && form.hr_mobile && (
                <p className="text-xs text-gray-500 mt-1.5">10-digit Indian mobile number</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Address Line 1 *</label>
            <input
              name="address_line1"
              value={form.address_line1}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass("address_line1")}
              placeholder="Enter address line 1"
            />
            {errors.address_line1 && <p className="text-xs text-red-600 mt-1.5">{errors.address_line1}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Address Line 2</label>
            <input
              name="address_line2"
              value={form.address_line2}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass("address_line2")}
              placeholder="Enter address line 2 (optional)"
            />
            {errors.address_line2 && <p className="text-xs text-red-600 mt-1.5">{errors.address_line2}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleStateChange}
                onBlur={handleBlur}
                className={getSelectClass("state")}
              >
                <option value="">Select State</option>
                {stateOptions.filter(state => state !== "Select State").map(stateName => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-xs text-red-600 mt-1.5">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">City *</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!form.state || citiesForSelectedState.length === 0}
                className={`${getSelectClass("city")} ${!form.state ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">
                  {form.state ? "Select City" : "Select State first"}
                </option>
                {citiesForSelectedState.map(cityName => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
              {errors.city && <p className="text-xs text-red-600 mt-1.5">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">Country</label>
              <input
                name="country"
                value={form.country}
                readOnly
                className="w-full px-4 py-3 rounded border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                placeholder="India"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Pincode</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={(e) => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    handleChange({ target: { name: 'pincode', value } });
                  }
                }}
                onBlur={handleBlur}
                className={getInputClass("pincode")}
                placeholder="123456"
                type="tel"
                maxLength="6"
              />
              {errors.pincode && <p className="text-xs text-red-600 mt-1.5">{errors.pincode}</p>}
              {!errors.pincode && form.pincode && (
                <p className="text-xs text-gray-500 mt-1.5">6-digit Indian pincode</p>
              )}
            </div>
          </div>

          {/* Terms & Conditions Acceptance */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms-checkbox-recruiter"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms-checkbox-recruiter" className="text-sm text-gray-700 cursor-pointer">
                I confirm that all company details are accurate and I agree to Jobion's{" "}
                <Link to="/terms" target="_blank" className="text-primary-600 hover:underline">
                  Terms & Conditions
                </Link>.
              </label>
            </div>
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
              disabled={saving || !termsAccepted}
              className={`px-6 py-2 rounded-full text-white transition-all ${saving || !termsAccepted
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-primary-600 hover:brightness-95"
                }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

