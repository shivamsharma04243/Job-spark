const pool = require("../../config/db");

async function getJobApplicants(req, res) {
  try {
    const recruiterId = req.user?.id;
    const jobId = req.params.jobId;
    
    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (!jobId) {
      return res.status(400).json({ ok: false, message: "Job ID is required" });
    }

    // First verify the job belongs to this recruiter
    const [jobRows] = await pool.query(
      'SELECT id FROM jobs WHERE id = ? AND recruiter_id = ?',
      [jobId, recruiterId]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({ ok: false, message: "Job not found or access denied" });
    }

    // Get applicants for this job
    const sql = `
      SELECT 
        ja.id as application_id,
        ja.status,
        ja.cover_letter,
        ja.resume_path,
        ja.applied_at,
        u.id as user_id,
        u.email,
        u.username,
        up.full_name,
        up.phone,
        up.city,
        up.state,
        up.country,
        up.experience_years,
        up.highest_education,
        up.linkedin_url,
        up.portfolio_url
      FROM job_applications ja
      INNER JOIN users u ON ja.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE ja.job_id = ?
      ORDER BY ja.applied_at DESC
    `;
    
    const [applicants] = await pool.query(sql, [jobId]);

    const result = applicants.map(app => ({
      applicationId: app.application_id,
      status: app.status,
      coverLetter: app.cover_letter,
      resumePath: app.resume_path,
      appliedAt: app.applied_at,
      user: {
        id: app.user_id,
        email: app.email,
        username: app.username,
        fullName: app.full_name,
        phone: app.phone,
        location: `${app.city || ''}${app.city && app.state ? ', ' : ''}${app.state || ''}`,
        country: app.country,
        experienceYears: app.experience_years,
        highestEducation: app.highest_education,
        linkedinUrl: app.linkedin_url,
        portfolioUrl: app.portfolio_url
      }
    }));

    res.json({ ok: true, applicants: result });
  } catch (err) {
    console.error('GET /api/recruiter/jobs/:jobId/applicants error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getJobApplicants;