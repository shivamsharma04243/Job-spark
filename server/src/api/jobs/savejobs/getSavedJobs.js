const pool = require('../../config/db');

const getSavedJobs = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
  

    // Use the exact column names from my jobs table
    const [rows] = await connection.execute(`
      SELECT 
        sj.job_id,
        sj.saved_at,
        j.id,
        j.title,
        j.company,
        j.job_type as type,
        j.city,
        j.locality,
        j.min_experience,
        j.max_experience,
        j.salary,
        j.vacancies,
        j.description,
        j.logo_path,
        j.created_at
      FROM saved_jobs sj
      LEFT JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = ?
      ORDER BY sj.saved_at DESC
    `, [userId]);

    // Process the jobs to match my frontend format
    const processedJobs = rows.map(job => {
      // Calculate experience string (same as your getjobs API)
      let experience = 'Not specified';
      if (job.min_experience == null && job.max_experience == null) {
        experience = 'Fresher';
      } else if (job.min_experience != null && job.max_experience == null) {
        experience = `${job.min_experience}+ yrs`;
      } else if (job.min_experience == null && job.max_experience != null) {
        experience = `Up to ${job.max_experience} yrs`;
      } else {
        experience = `${job.min_experience}-${job.max_experience} yrs`;
      }

      // Build location (same as my getjobs API)
      const location = job.city + (job.locality ? `, ${job.locality}` : '');

      return {
        job_id: job.job_id,
        saved_at: job.saved_at,
        id: job.id,
        title: job.title || 'Job Title',
        company: job.company || 'Company',
        location: location || 'Location not specified',
        type: job.type || 'Full-time',
        experience: experience,
        salary: job.salary || null,
        description: job.description || '',
        logo_path: job.logo_path || null,
        created_at: job.created_at,
        // Add empty tags array for compatibility
        tags: []
      };
    });

    res.json({ 
      success: true, 
      data: processedJobs,
      count: processedJobs.length
    });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
};

module.exports = getSavedJobs;