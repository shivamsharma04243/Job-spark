const pool = require('../../config/db');

const saveJob = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { job_id } = req.params; 

    if (!job_id) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Check if job exists in jobs table
    const [jobExists] = await connection.execute(
      'SELECT id FROM jobs WHERE id = ?',
      [job_id]
    );

    if (jobExists.length === 0) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if job is already saved
    const [existing] = await connection.execute(
      'SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?',
      [userId, job_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Job already saved' });
    }

    // Save the job
    await connection.execute(
      'INSERT INTO saved_jobs (user_id, job_id, saved_at) VALUES (?, ?, NOW())',
      [userId, job_id]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Job saved successfully',
      data: { user_id: userId, job_id, saved_at: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = saveJob;