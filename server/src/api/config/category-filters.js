// Category → filters mapping (used to expand category query param into filters)
// This mapping matches the client-side CATEGORY_FILTER_MAPPING in client/src/modules/guest/home/data.js
const CATEGORY_FILTER_MAPPING = {
  fresher: {
    label: "Fresher Jobs",
    filters: {
      experience: "0", // min_experience = 0 OR min_experience IS NULL (any job that accepts freshers)
    },
  },
  "full-time": {
    label: "Full-time Jobs",
    filters: {
      jobTypes: ["Full-time"],
    },
  },
  "part-time": {
    label: "Part-time Jobs",
    filters: {
      jobTypes: ["Part-time"],
    },
  },
  internship: {
    label: "Internship",
    filters: {
      jobTypes: ["Internship"],
    },
  },
  remote: {
    label: "Remote Jobs",
    filters: {
      workModes: ["Remote"], // Note: database uses 'Remote' with capital R
    },
  },
  "office-data-entry": {
    label: "Office / Data Entry Jobs",
    filters: {
      workModes: ["Office"],
      roles: ["Data Entry", "Back Office"],
      tags: ["data entry"],
    },
  },
  "it-jobs": {
    label: "IT Jobs",
    filters: {
      roles: ["Developer", "Engineer", "IT"],
      tags: ["IT", "Software"],
    },
  },
  noida: {
    label: "Jobs in Noida",
    filters: {
      cities: ["Noida"],
    },
  },
  delivery: {
    label: "Delivery Jobs",
    filters: {
      roles: ["Delivery"],
      tags: ["delivery"],
    },
  },
  "customer-care-telecaller": {
    label: "Customer Care / Telecaller Jobs",
    filters: {
      roles: ["Customer Care", "Telecaller", "Call Center"],
      tags: ["customer care", "telecaller"],
    },
  },
};

module.exports = CATEGORY_FILTER_MAPPING;





