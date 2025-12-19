const pool = require("../../config/db");

async function getRecruiterJobStats(req, res) {
  try {
    const recruiterId = req.user?.id;

    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // Get job counts by status
    const [statusCounts] = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM jobs 
      WHERE recruiter_id = ?
      GROUP BY status
    `, [recruiterId]);

    // Parse status counts
    const statusMap = {};
    statusCounts.forEach(row => {
      statusMap[row.status] = parseInt(row.count) || 0;
    });

    const liveJobs = statusMap['approved'] || 0;
    const pendingJobs = statusMap['pending'] || 0;
    const closedJobs = statusMap['closed'] || 0;
    const rejectedJobs = statusMap['rejected'] || 0;
    const withdrawnJobs = statusMap['withdrawn'] || 0;
    const totalJobs = liveJobs + pendingJobs + closedJobs + rejectedJobs + withdrawnJobs;

    // Get total applications and new applications (last 7 days)
    const [appStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN ja.applied_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_applications
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      WHERE j.recruiter_id = ?
    `, [recruiterId]);

    const totalApplications = parseInt(appStats[0]?.total_applications) || 0;
    const newApplications = parseInt(appStats[0]?.new_applications) || 0;

    // Get application status breakdown
    const [appStatusCounts] = await pool.query(`
      SELECT 
        ja.status,
        COUNT(*) as count
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      WHERE j.recruiter_id = ?
      GROUP BY ja.status
    `, [recruiterId]);

    const appStatusMap = {};
    appStatusCounts.forEach(row => {
      appStatusMap[row.status] = parseInt(row.count) || 0;
    });

    // Combined pending review count (both 'pending' and 'applied' statuses)
    const pendingReview = (appStatusMap['pending'] || 0) + (appStatusMap['applied'] || 0);
    const shortlisted = appStatusMap['shortlisted'] || 0;
    const interviewed = appStatusMap['interviewed'] || 0;
    const hired = appStatusMap['hired'] || 0;
    const rejectedApps = appStatusMap['rejected'] || 0;

    // Get ALL live jobs with their application counts
    const [liveJobsList] = await pool.query(`
      SELECT 
        j.id,
        jr.name AS title,
        j.company,
        j.city,
        j.status,
        j.created_at,
        j.posted_at,
        (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as total_applications,
        (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id AND (status = 'pending' OR status = 'applied')) as pending_count
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.recruiter_id = ? AND j.status = 'approved'
      ORDER BY j.created_at DESC
      LIMIT 10
    `, [recruiterId]);

    // Get recent applications (last 10)
    const [recentApplications] = await pool.query(`
      SELECT 
        ja.id as application_id,
        ja.applied_at,
        ja.status as application_status,
        j.id as job_id,
        jr.name as job_title,
        u.name as applicant_name,
        u.email as applicant_email,
        cp.full_name
      FROM job_applications ja
      INNER JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      INNER JOIN users u ON ja.user_id = u.id
      LEFT JOIN candidate_profiles cp ON u.id = cp.user_id
      WHERE j.recruiter_id = ?
      ORDER BY ja.applied_at DESC
      LIMIT 10
    `, [recruiterId]);

    // Get pending jobs awaiting approval
    const [pendingApprovalJobs] = await pool.query(`
      SELECT 
        j.id,
        jr.name AS title,
        j.company,
        j.city,
        j.created_at
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.recruiter_id = ? AND j.status = 'pending'
      ORDER BY j.created_at DESC
      LIMIT 5
    `, [recruiterId]);

    // Get recent activity (job status changes, new applications, etc.)
    const [recentActivity] = await pool.query(`
      (
        SELECT 
          'new_application' as type,
          ja.applied_at as timestamp,
          CONCAT(COALESCE(cp.full_name, u.name, 'Someone'), ' applied for ', COALESCE(jr.name, 'a job')) as message,
          j.id as job_id,
          ja.id as reference_id
        FROM job_applications ja
        INNER JOIN jobs j ON ja.job_id = j.id
        LEFT JOIN job_roles jr ON j.role_id = jr.id
        INNER JOIN users u ON ja.user_id = u.id
        LEFT JOIN candidate_profiles cp ON u.id = cp.user_id
        WHERE j.recruiter_id = ?
        ORDER BY ja.applied_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 
          'job_approved' as type,
          j.posted_at as timestamp,
          CONCAT('Your job "', COALESCE(jr.name, 'Untitled'), '" is now live') as message,
          j.id as job_id,
          j.id as reference_id
        FROM jobs j
        LEFT JOIN job_roles jr ON j.role_id = jr.id
        WHERE j.recruiter_id = ? AND j.status = 'approved' AND j.posted_at IS NOT NULL
        ORDER BY j.posted_at DESC
        LIMIT 3
      )
      ORDER BY timestamp DESC
      LIMIT 8
    `, [recruiterId, recruiterId]);

    res.json({
      ok: true,
      stats: {
        // Job counts
        totalJobs,
        liveJobs,
        pendingJobs,
        closedJobs,
        rejectedJobs,
        withdrawnJobs,

        // Application counts
        totalApplications,
        newApplications,
        pendingReview,
        shortlisted,
        interviewed,
        hired,
        rejected: rejectedApps,

        // Live jobs list
        liveJobsList: liveJobsList.map(j => ({
          id: j.id,
          title: j.title,
          company: j.company,
          city: j.city,
          totalApplications: parseInt(j.total_applications) || 0,
          pendingCount: parseInt(j.pending_count) || 0,
          createdAt: j.created_at,
          postedAt: j.posted_at
        })),

        // Pending approval jobs
        pendingApprovalJobs: pendingApprovalJobs.map(j => ({
          id: j.id,
          title: j.title,
          company: j.company,
          city: j.city,
          createdAt: j.created_at
        })),

        // Recent applications
        recentApplications: recentApplications.map(app => ({
          applicationId: app.application_id,
          jobId: app.job_id,
          jobTitle: app.job_title,
          applicantName: app.full_name || app.applicant_name || 'Anonymous',
          applicantEmail: app.applicant_email,
          appliedAt: app.applied_at,
          status: app.application_status
        })),

        // Recent activity feed
        recentActivity: recentActivity.map(activity => ({
          type: activity.type,
          timestamp: activity.timestamp,
          message: activity.message,
          jobId: activity.job_id,
          referenceId: activity.reference_id
        }))
      }
    });
  } catch (err) {
    console.error('GET /api/recruiter/jobs/stats error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getRecruiterJobStats;
