const pool = require("../../api/config/db");
const { requireAuth } = require("../../middlewares/auth");

// GET /applied-jobs - Get all applied jobs for current login  user
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
        j.work_mode,
        j.city,
        j.locality,
        j.min_salary,
        j.max_salary,
        j.logo_path
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.user_id = ?
      ORDER BY ja.applied_at DESC
    `;

    const [applications] = await connection.query(sql, [userId]);

    // Format salary range for each application (monthly)
    const formatSalary = (minSalary, maxSalary) => {
      if (minSalary == null && maxSalary == null) return null;
      if (minSalary != null && maxSalary != null) {
        return `${minSalary}-${maxSalary} per month`;
      }
      if (minSalary != null) return `${minSalary}+ per month`;
      if (maxSalary != null) return `Up to ${maxSalary} per month`;
      return null;
    };

    const formattedApplications = applications.map(app => ({
      ...app,
      salary: formatSalary(app.min_salary, app.max_salary),
      work_mode: app.work_mode || 'Office'
    }));

    res.json({
      ok: true,
      applications: formattedApplications,
      count: formattedApplications.length
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