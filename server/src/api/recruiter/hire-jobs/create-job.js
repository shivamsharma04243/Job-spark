const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../../config/db");

// ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "uploads", "logos");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files allowed"), false);
    cb(null, true);
  },
});

async function createJobHandler(req, res) {
  // Apply multer middleware for single file upload
  const uploadMiddleware = upload.single("logo");
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ ok: false, message: err.message });
    }
    try {
      // fields from your frontend form (camelCase)
      const {
        title = "",
        company = "",
        jobType = "Full-time",
        city = "",
        locality = "",
        skills = "",
        minExperience = null,
        maxExperience = null,
        salary = "",
        vacancies = "1",
        description = "",
        interviewAddress = "",
        contactEmail = "",
        contactPhone = "",
      } = req.body;

      // simple validation
      const errors = [];
      if (!title.trim()) errors.push("title is required");
      if (!company.trim()) errors.push("company is required");
      if (!city.trim()) errors.push("city is required");
      if (!description.trim()) errors.push("description is required");
      if (!contactEmail.trim() && !contactPhone.trim()) errors.push("provide email or phone");

      if (errors.length) return res.status(400).json({ ok: false, errors });

      // prepare values to insert
      const logoPath = req.file ? path.posix.join("uploads", "logos", req.file.filename) : null;

      // convert numeric fields carefully
      const minExpNum = minExperience === null || minExperience === "" ? null : Number(minExperience);
      const maxExpNum = maxExperience === null || maxExperience === "" ? null : Number(maxExperience);
      const vacanciesNum = vacancies ? Math.max(1, parseInt(vacancies, 10) || 1) : 1;

      // Insert into DB (use placeholders)
      const sql = `
        INSERT INTO recruiter_jobs
          (title, company, job_type, city, locality, skills, min_experience, max_experience, salary, vacancies, description, interview_address, contact_email, contact_phone, logo_path, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // If you have auth, replace created_by with actual user id. currently null.
      const createdBy = null;

      const params = [
        title,
        company,
        jobType,
        city,
        locality || null,
        skills || null,
        minExpNum,
        maxExpNum,
        salary || null,
        vacanciesNum,
        description,
        interviewAddress || null,
        contactEmail || null,
        contactPhone || null,
        logoPath,
        createdBy,
      ];

      const [result] = await pool.query(sql, params);

      return res.status(201).json({
        ok: true,
        id: result.insertId,
        message: "Job created",
        logoPath,
      });
    } catch (err) {
      console.error("createJob error:", err);
      // if multer error, it may be in err.code or err.message
      return res.status(500).json({ ok: false, message: err.message || "Internal Server Error" });
    }
  });
}

module.exports = createJobHandler;
