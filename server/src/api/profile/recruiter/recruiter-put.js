const pool = require('../../config/db');
const ALLOWED_COMPANY_TYPES = ['company', 'consultancy', 'startup'];

/**
 * Handler: Create or update recruiter profile.
 * Attach to a route elsewhere, for example:
 *   router.put('/api/recruiter/profile', requireAuth, recruiterProfile)
 *
 * Expects req.user set by requireAuth middleware (preferred).
 * Falls back to req.body.user_id if authentication is not available (not recommended).
 */
const recruiterProfile = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Authenticated user id (preferred)
    const authUserId = req.user?.id;
    const {
      user_id, // fallback if caller provides it
      company_name,
      company_website,
      company_type,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      verified, // optional boolean / 0|1
      verification_notes
    } = req.body;

    const finalUserId = authUserId || user_id;
    if (!finalUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing authenticated user. Apply requireAuth or provide user_id in body.'
      });
    }

    // Basic validation
    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: 'company_name is required.'
      });
    }

    if (company_type && !ALLOWED_COMPANY_TYPES.includes(company_type)) {
      return res.status(400).json({
        success: false,
        message: `company_type must be one of: ${ALLOWED_COMPANY_TYPES.join(', ')}.`
      });
    }

    // Normalize verified value to 0/1 or null
    let verifiedValue = null;
    if (typeof verified !== 'undefined' && verified !== null) {
      // Accept boolean or numeric string/number
      if (typeof verified === 'boolean') verifiedValue = verified ? 1 : 0;
      else if (typeof verified === 'number') verifiedValue = verified ? 1 : 0;
      else if (typeof verified === 'string') verifiedValue = ['1', 'true', 'yes'].includes(verified.toLowerCase()) ? 1 : 0;
      else verifiedValue = 0;
    }

    await connection.beginTransaction();

    // Check if recruiter profile exists
    const [existing] = await connection.execute(
      'SELECT user_id FROM recruiter_profiles WHERE user_id = ?',
      [finalUserId]
    );

    const now = new Date();

    if (existing.length > 0) {
      // Update existing profile
      await connection.execute(
        `UPDATE recruiter_profiles
         SET company_name = ?, company_website = ?, company_type = ?, 
             address_line1 = ?, address_line2 = ?, city = ?, state = ?, country = ?, pincode = ?,
             verified = COALESCE(?, verified), verification_notes = ?, updated_at = ?
         WHERE user_id = ?`,
        [
          company_name,
          company_website || null,
          company_type || null,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state || null,
          country || null,
          pincode || null,
          // For verified: if user omitted verified, keep existing value (using COALESCE in SQL)
          // We pass verifiedValue (may be null) so COALESCE(?, verified) keeps old verified when null
          verifiedValue,
          verification_notes || null,
          now,
          finalUserId
        ]
      );

      await connection.commit();

      const [updatedRows] = await connection.execute(
        'SELECT * FROM recruiter_profiles WHERE user_id = ?',
        [finalUserId]
      );

      return res.json({
        success: true,
        message: 'Recruiter profile updated successfully',
        recruiter: updatedRows[0]
      });
    } else {
      // Create new recruiter profile
      await connection.execute(
        `INSERT INTO recruiter_profiles
         (user_id, company_name, company_website, company_type,
          address_line1, address_line2, city, state, country, pincode,
          verified, verification_notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalUserId,
          company_name,
          company_website || null,
          company_type || null,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state || null,
          country || null,
          pincode || null,
          // If verifiedValue is null, default to 0 when inserting (adjust if your schema has default)
          (verifiedValue === null ? 0 : verifiedValue),
          verification_notes || null,
          now,
          now
        ]
      );

      await connection.commit();

      const [newRows] = await connection.execute(
        'SELECT * FROM recruiter_profiles WHERE user_id = ?',
        [finalUserId]
      );

      return res.status(201).json({
        success: true,
        message: 'Recruiter profile created successfully',
        recruiter: newRows[0]
      });
    }
  } catch (err) {
    if (connection) {
      try { await connection.rollback(); } catch (e) { /* ignore rollback error */ }
    }
    console.error('Recruiter profile handler error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recruiterProfile;
