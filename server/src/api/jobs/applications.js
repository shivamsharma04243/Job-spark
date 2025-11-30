const path = require("path");
const fs = require("fs");
const multer = require("multer");
const pool = require("../config/db");
const { requireAuth } = require("../../middlewares/auth");

// Ensure upload directory exists
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${base}_${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF / DOC / DOCX resumes are allowed"));
  },
});

// POST /applications function
const postApplication = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const { job_id, cover_letter } = req.body;
    if (!job_id) {
      return res.status(400).json({ ok: false, error: "job_id is required" });
    }

    // Check if job exists
    const [jobRows] = await conn.query("SELECT id FROM jobs WHERE id = ? LIMIT 1", [job_id]);
    if (jobRows.length === 0) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    // Prevent duplicate application
    const [existing] = await conn.query(
      "SELECT id FROM job_applications WHERE job_id = ? AND user_id = ? LIMIT 1",
      [job_id, userId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ ok: false, error: "You have already applied to this job" });
    }

    const resumePath = req.file ? path.join("uploads", "resumes", req.file.filename) : null;
    const status = "applied";

    const insertSql = `
      INSERT INTO job_applications
        (job_id, user_id, status, cover_letter, resume_path, applied_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const [result] = await conn.query(insertSql, [
      job_id,
      userId,
      status,
      cover_letter || null,
      resumePath,
    ]);

    const insertedId = result.insertId;

    res.status(201).json({
      ok: true,
      application_id: insertedId,
      job_id: Number(job_id),
      user_id: userId,
      status,
      resume_path: resumePath,
    });
  } catch (err) {
    console.error("Apply error:", err);
    // If multer produced file but DB failed, do cleanup
    if (req.file) {
      try {
        fs.unlinkSync(path.join(UPLOAD_DIR, req.file.filename));
      } catch (e) {
        // ignore
      }
    }
    res.status(500).json({ ok: false, error: "Server error", details: err.message });
  } finally {
    conn.release();
  }
};

// Export the upload middleware and postApplication function
module.exports = {
  upload,
  postApplication
};