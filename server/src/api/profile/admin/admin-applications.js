const pool = require('../../config/db');

async function getAllApplications(req, res) {
  try {
    const sql = `
      SELECT 
        ja.id as application_id,
        ja.status,
        ja.cover_letter,
        ja.resume_path,
        ja.applied_at,
        ja.updated_at,
        j.id as job_id,
        j.title as job_title,
        j.company,
        j.location as job_location,
        u.id as candidate_id,
        u.name as candidate_name,
        u.email as candidate_email,
        r.id as recruiter_id,
        r.name as recruiter_name,
        r.email as recruiter_email
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      INNER JOIN users u ON ja.user_id = u.id
      INNER JOIN users r ON j.recruiter_id = r.id
      ORDER BY ja.applied_at DESC
    `;
    
    const [applications] = await pool.query(sql);
    res.json({ ok: true, applications });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

async function getApplicationsByJob(req, res) {
  try {
    const { jobId } = req.params;
    const sql = `
      SELECT 
        ja.id as application_id,
        ja.status,
        ja.cover_letter,
        ja.resume_path,
        ja.applied_at,
        ja.updated_at,
        u.id as candidate_id,
        u.name as candidate_name,
        u.email as candidate_email,
        cp.full_name,
        cp.phone,
        cp.city,
        cp.state,
        cp.country
      FROM job_applications ja
      INNER JOIN users u ON ja.user_id = u.id
      LEFT JOIN candidate_profiles cp ON u.id = cp.user_id
      WHERE ja.job_id = ?
      ORDER BY ja.applied_at DESC
    `;
    
    const [applications] = await pool.query(sql, [jobId]);
    res.json({ ok: true, applications });
  } catch (err) {
    console.error('Error fetching applications by job:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

async function getApplicationsByRecruiter(req, res) {
  try {
    const { recruiterId } = req.params;
    const sql = `
      SELECT 
        ja.id as application_id,
        ja.status,
        ja.cover_letter,
        ja.resume_path,
        ja.applied_at,
        ja.updated_at,
        j.id as job_id,
        j.title as job_title,
        j.company,
        u.id as candidate_id,
        u.name as candidate_name,
        u.email as candidate_email
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      INNER JOIN users u ON ja.user_id = u.id
      WHERE j.recruiter_id = ?
      ORDER BY ja.applied_at DESC
    `;
    
    const [applications] = await pool.query(sql, [recruiterId]);
    res.json({ ok: true, applications });
  } catch (err) {
    console.error('Error fetching applications by recruiter:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

async function getApplicationsByCandidate(req, res) {
  try {
    const { candidateId } = req.params;
    const sql = `
      SELECT 
        ja.id as application_id,
        ja.status,
        ja.cover_letter,
        ja.resume_path,
        ja.applied_at,
        ja.updated_at,
        j.id as job_id,
        j.title as job_title,
        j.company,
        j.location as job_location,
        r.id as recruiter_id,
        r.name as recruiter_name,
        r.email as recruiter_email
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      INNER JOIN users r ON j.recruiter_id = r.id
      WHERE ja.user_id = ?
      ORDER BY ja.applied_at DESC
    `;
    
    const [applications] = await pool.query(sql, [candidateId]);
    res.json({ ok: true, applications });
  } catch (err) {
    console.error('Error fetching applications by candidate:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

async function getApplicationStats(req, res) {
  try {
    const { period = 'monthly' } = req.query; // 'daily' or 'monthly'
    
    let dateFormat, groupBy;
    if (period === 'daily') {
      dateFormat = '%Y-%m-%d';
      groupBy = 'DATE(ja.applied_at)';
    } else {
      dateFormat = '%Y-%m';
      groupBy = 'DATE_FORMAT(ja.applied_at, "%Y-%m")';
    }
    
    const sql = `
      SELECT 
        ${groupBy} as period,
        COUNT(*) as total_applications,
        COUNT(CASE WHEN ja.status = 'applied' THEN 1 END) as applied_count,
        COUNT(CASE WHEN ja.status = 'shortlisted' THEN 1 END) as shortlisted_count,
        COUNT(CASE WHEN ja.status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hired_count
      FROM job_applications ja
      WHERE ja.applied_at >= DATE_SUB(NOW(), INTERVAL ${period === 'daily' ? '30' : '12'} ${period === 'daily' ? 'DAY' : 'MONTH'})
      GROUP BY ${groupBy}
      ORDER BY period DESC
    `;
    
    const [stats] = await pool.query(sql);
    
    // Get overall totals
    const [totals] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'applied' THEN 1 END) as applied,
        COUNT(CASE WHEN status = 'shortlisted' THEN 1 END) as shortlisted,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired
      FROM job_applications
    `);
    
    res.json({ 
      ok: true, 
      stats, 
      totals: totals[0],
      period 
    });
  } catch (err) {
    console.error('Error fetching application stats:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = {
  getAllApplications,
  getApplicationsByJob,
  getApplicationsByRecruiter,
  getApplicationsByCandidate,
  getApplicationStats
};

