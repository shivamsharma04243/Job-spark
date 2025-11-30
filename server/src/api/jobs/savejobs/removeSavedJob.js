const pool = require('../../config/db');

const removeSavedJob = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    const [result] = await connection.execute(
      'DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?',
      [userId, job_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Saved job not found' });
    }

    res.json({ 
      success: true, 
      message: 'Job removed from saved items',
      data: { job_id }
    });
  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = removeSavedJob;