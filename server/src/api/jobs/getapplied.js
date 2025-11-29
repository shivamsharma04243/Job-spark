const pool = require("../../api/config/db");
const { requireAuth } = require("../../middlewares/auth");

// GET /applied-jobs - Get all applied jobs for current user
const getAppliedJobs = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ 
        ok: false, 
        error: "Unauthorized" 
      });
    }

    const sql = `
      SELECT 
        ja.id,
        ja.job_id,
        ja.status,
        ja.applied_at,
        j.title,
        j.company,
        j.job_type,
        j.city,
        j.locality,
        j.salary,
        j.logo_path
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.user_id = ?
      ORDER BY ja.applied_at DESC
    `;

    const [applications] = await connection.query(sql, [userId]);

    res.json({
      ok: true,
      applications: applications,
      count: applications.length
    });

  } catch (err) {
    console.error("Get applied jobs error:", err);
    res.status(500).json({ 
      ok: false, 
      error: "Server error while fetching applications"
    });
  } finally {
    connection.release();
  }
};

module.exports = getAppliedJobs;