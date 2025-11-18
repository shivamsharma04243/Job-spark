import React, { useState } from "react";

export default function BasicProfileForm() {
  const [hiringFor, setHiringFor] = useState("own"); // "own" | "client" | "both"
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    companyCity: "",
    companyLocality: "",
    companyAddress: "",
    interviewDifferent: false,
    interviewAddress: "",
    consultancyName: "",
    consultancyCity: "",
    consultancyLocality: "",
    consultancyAddress: "",
    clientForWhich: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // handle submit (send to server)
    console.log("Submit payload:", { hiringFor, ...form });
    alert("Form data printed to console (see devtools).");
  };

  const Pill = ({ id, label, selectedValue }) => {
    const active = hiringFor === id;
    return (
      <button
        type="button"
        onClick={() => setHiringFor(id)}
        className={
          "text-sm font-medium px-4 py-2 rounded-full border transition-shadow focus:outline-none " +
          (active
            ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
            : "bg-white border-gray-200 text-gray-600 hover:shadow-sm")
        }
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Basic Profile</h2>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-8 relative"
        >
          {/* header */}
          <div className="mb-6">
            <div className="text-sm text-blue-300">Your job details are saved...</div>
            <h1 className="text-2xl font-extrabold mt-1">Now create your basic profile</h1>
          </div>

          {/* Full name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your First and Last Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* pills */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">
              Are you hiring for: <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <Pill id="own" label="Your own company" />
              <Pill id="client" label="Your client's company" />
              <Pill id="both" label="Both" />
            </div>
          </div>

          {/* Company details (shown for own or both) */}
          {(hiringFor === "own" || hiringFor === "both") && (
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-4">Company details</h3>

              <label className="block text-sm font-medium mb-2">Company Name *</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Name of your company"
                className="w-full px-4 py-3 rounded-md border border-gray-200 mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City in which company is located *
                  </label>
                  <input
                    name="companyCity"
                    value={form.companyCity}
                    onChange={handleChange}
                    placeholder="Try Delhi, Mumbai, Bangalore etc."
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Locality in which company is located *
                  </label>
                  <input
                    name="companyLocality"
                    value={form.companyLocality}
                    onChange={handleChange}
                    placeholder="Try sector 132, etc."
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>
              </div>

              <label className="block text-sm font-medium mb-2">Full Company Address *</label>
              <input
                name="companyAddress"
                value={form.companyAddress}
                onChange={handleChange}
                placeholder="Shop/Building no., Locality, Landmark..."
                className="w-full px-4 py-3 rounded-md border border-gray-200"
              />

              <div className="mt-3 flex items-center gap-2">
                <input
                  id="interviewDifferent"
                  name="interviewDifferent"
                  type="checkbox"
                  checked={form.interviewDifferent}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="interviewDifferent" className="text-sm text-gray-600">
                  Interview Address is different from Company Address
                </label>
              </div>

              {form.interviewDifferent && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2">Full Interview Address *</label>
                  <input
                    name="interviewAddress"
                    value={form.interviewAddress}
                    onChange={handleChange}
                    placeholder="Shop/Building no., Locality, Landmark..."
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>
              )}
            </section>
          )}

          {/* Consultancy/client details (shown for client or both) */}
          {(hiringFor === "client" || hiringFor === "both") && (
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-4">Consultancy / Client details</h3>

              <label className="block text-sm font-medium mb-2">Client for which you are hiring *</label>
              <input
                name="clientForWhich"
                value={form.clientForWhich}
                onChange={handleChange}
                placeholder="Name of client for which you are hiring"
                className="w-full px-4 py-3 rounded-md border border-gray-200 mb-4"
              />

              <label className="block text-sm font-medium mb-2">Consultancy Name *</label>
              <input
                name="consultancyName"
                value={form.consultancyName}
                onChange={handleChange}
                placeholder="Name of your consultancy"
                className="w-full px-4 py-3 rounded-md border border-gray-200 mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City in which consultancy is located *
                  </label>
                  <input
                    name="consultancyCity"
                    value={form.consultancyCity}
                    onChange={handleChange}
                    placeholder="Try Delhi, Mumbai, Bangalore etc."
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Locality in which consultancy is located *
                  </label>
                  <input
                    name="consultancyLocality"
                    value={form.consultancyLocality}
                    onChange={handleChange}
                    placeholder="Try sector 132, etc."
                    className="w-full px-4 py-3 rounded-md border border-gray-200"
                  />
                </div>
              </div>

              <label className="block text-sm font-medium mb-2">Full Consultancy Address *</label>
              <input
                name="consultancyAddress"
                value={form.consultancyAddress}
                onChange={handleChange}
                placeholder="Shop/Building no., Locality, Landmark..."
                className="w-full px-4 py-3 rounded-md border border-gray-200"
              />
            </section>
          )}

          {/* bottom area */}
          <div className="h-px bg-gray-100 my-6" />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:brightness-95 focus:outline-none"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
