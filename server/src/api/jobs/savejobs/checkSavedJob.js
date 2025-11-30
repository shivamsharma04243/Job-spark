const pool = require('../../config/db');

const checkSavedJob = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { job_id } = req.params;

    const [rows] = await connection.execute(
      'SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?',
      [userId, job_id]
    );

    res.json({ 
      success: true, 
      isSaved: rows.length > 0,
      data: rows.length > 0 ? rows[0] : null
    });
  } catch (error) {
    console.error('Check saved job error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = checkSavedJob;