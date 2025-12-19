const pool = require("../../config/db");

/**
 * Update job status (close or withdraw)
 * - Close Job: Only for jobs with status = 'approved' (live)
 * - Withdraw Job: Only for jobs with status = 'pending'
 */
async function updateJobStatus(req, res) {
  try {
    const recruiterId = req.user?.id;
    const { jobId } = req.params;
    const { action } = req.body; // 'close' or 'withdraw'

    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (!jobId) {
      return res.status(400).json({ ok: false, message: "Job ID is required" });
    }

    if (!action || !['close', 'withdraw'].includes(action)) {
      return res.status(400).json({ ok: false, message: "Invalid action. Use 'close' or 'withdraw'" });
    }

    // First, verify the job belongs to this recruiter and check its current status
    const [jobs] = await pool.query(
      "SELECT id, status FROM jobs WHERE id = ? AND recruiter_id = ?",
      [jobId, recruiterId]
    );

    if (!jobs.length) {
      return res.status(404).json({ ok: false, message: "Job not found or you don't have permission" });
    }

    const job = jobs[0];
    const currentStatus = job.status;

    // Validate action based on current status
    if (action === 'close') {
      if (currentStatus !== 'approved') {
        return res.status(400).json({
          ok: false,
          message: "Only live (approved) jobs can be closed"
        });
      }

      // Close the job
      await pool.query(
        "UPDATE jobs SET status = 'closed', closed_at = NOW() WHERE id = ?",
        [jobId]
      );

      return res.json({
        ok: true,
        message: "Job closed successfully",
        newStatus: 'closed'
      });
    }

    if (action === 'withdraw') {
      if (currentStatus !== 'pending') {
        return res.status(400).json({
          ok: false,
          message: "Only pending jobs can be withdrawn"
        });
      }

      // Withdraw the job (set status to 'withdrawn' or delete it)
      await pool.query(
        "UPDATE jobs SET status = 'withdrawn', withdrawn_at = NOW() WHERE id = ?",
        [jobId]
      );

      return res.json({
        ok: true,
        message: "Job withdrawn successfully",
        newStatus: 'withdrawn'
      });
    }

  } catch (err) {
    console.error('PUT /api/recruiter/jobs/:jobId/status error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = updateJobStatus;
