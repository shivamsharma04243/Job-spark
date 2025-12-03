const pool = require('../../config/db');

const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['draft', 'pending', 'approved', 'rejected', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    await pool.execute(
      'UPDATE jobs SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, jobId]
    );

    res.json({
      success: true,
      message: `Job status updated to ${status} successfully`
    });
  } catch (error) {
    console.error('Admin update job status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = updateJobStatus;