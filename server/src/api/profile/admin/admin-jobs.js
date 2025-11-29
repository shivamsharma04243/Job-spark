const pool = require('../../config/db');

const getAdminJobs = async (req, res) => {
  try {
    const [jobs] = await pool.execute(`
      SELECT 
        j.id,
        j.title,
        j.company,
        j.job_type,
        j.city,
        j.locality,
        j.min_experience,
        j.max_experience,
        j.salary,
        j.vacancies,
        j.description,
        j.contact_email,
        j.contact_phone,
        j.logo_path,
        j.posted_at,
        j.created_at,
        j.updated_at,
        u.email as recruiter_email,
        u.username as recruiter_username,
        rp.company_name
      FROM jobs j
      LEFT JOIN users u ON j.recruiter_id = u.id
      LEFT JOIN recruiter_profiles rp ON j.recruiter_id = rp.user_id
      ORDER BY j.created_at DESC
    `);

    const jobsWithFormattedData = (jobs || []).map(job => {
      let experience = 'Not specified';
      if (job.min_experience == null && job.max_experience == null) experience = 'Fresher';
      else if (job.min_experience != null && job.max_experience == null) experience = `${job.min_experience}+ yrs`;
      else if (job.min_experience == null && job.max_experience != null) experience = `Up to ${job.max_experience} yrs`;
      else experience = `${job.min_experience}-${job.max_experience} yrs`;

      return {
        ...job,
        experience,
        location: job.city + (job.locality ? `, ${job.locality}` : '')
      };
    });

    res.json({
      success: true,
      jobs: jobsWithFormattedData
    });
  } catch (error) {
    console.error('Admin get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = getAdminJobs;