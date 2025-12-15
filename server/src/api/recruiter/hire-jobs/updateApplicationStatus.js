const pool = require("../../config/db");

async function updateApplicationStatus(req, res) {
  const connection = await pool.getConnection();

  try {
    const recruiterId = req.user?.id;
    const { applicationId } = req.params;
    const { status, interviewDate, interviewTime, interviewMessage } = req.body;

    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (!applicationId) {
      return res.status(400).json({ ok: false, message: "Application ID is required" });
    }

    // Validate status
    const validStatuses = ['applied', 'shortlisted', 'interview_called', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Verify the application belongs to a job owned by this recruiter
    const [applicationRows] = await connection.query(
      `SELECT ja.id, ja.job_id, j.recruiter_id 
       FROM job_applications ja
       INNER JOIN jobs j ON ja.job_id = j.id
       WHERE ja.id = ? AND j.recruiter_id = ?`,
      [applicationId, recruiterId]
    );

    if (applicationRows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Application not found or access denied"
      });
    }

    // If status is interview_called, validate interview details
    if (status === 'interview_called') {
      if (!interviewDate || !interviewTime) {
        return res.status(400).json({
          ok: false,
          message: "Interview date and time are required when marking as interview called"
        });
      }
    }

    // Update application status
    await connection.beginTransaction();

    await connection.query(
      'UPDATE job_applications SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, applicationId]
    );

    // Store interview details if provided (you might want to create a separate table for this)
    // For now, we'll just update the status. Interview details can be stored in cover_letter field
    // or a separate interview_details table in the future.

    await connection.commit();

    res.json({
      ok: true,
      message: "Application status updated successfully",
      status: status
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('UPDATE /api/recruiter/jobs/applications/:applicationId/status error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = updateApplicationStatus;