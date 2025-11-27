// api/profile/recruiter/recruiter-get.js
const pool = require("../../config/db");

async function getRecruiterProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated."
      });
    }

    const [rows] = await pool.execute(
      `SELECT *
       FROM recruiter_profiles
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found."
      });
    }

    return res.json({
      success: true,
      recruiter: rows[0]
    });

  } catch (err) {
    console.error("GET recruiter profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
}

module.exports = getRecruiterProfile;
