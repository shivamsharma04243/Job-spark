// routes/profile.js
const pool = require('../../config/db');
/**
 * Handler: Create or update user profile.
 * Exported as a const so you can attach it to a route elsewhere:
 *   router.put('/user', requireAuth, user);
 */
const user = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    // If you expect requireAuth to run before this handler, req.user should exist.
    // If not present, respond with 401 so caller knows to apply auth middleware.
    const authUserId = req.user?.id;
    if (!authUserId && !req.body?.user_id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing authenticated user. Apply requireAuth or send user_id in body.'
      });
    }

    const {
      user_id, // optional fallback if caller supplies it
      full_name,
      phone,
      city,
      state,
      country,
      experience_years,
      highest_education,
      resume_path,
      linkedin_url,
      portfolio_url
    } = req.body;

    const finalUserId = authUserId || user_id;
    if (!finalUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required (ensure authentication or provide user_id in request body).'
      });
    }

    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name and phone are required.'
      });
    }

    await connection.beginTransaction();

    // Check if profile exists
    const [existingProfiles] = await connection.execute(
      'SELECT user_id FROM user_profiles WHERE user_id = ?',
      [finalUserId]
    );

    const now = new Date();

    if (existingProfiles.length > 0) {
      // Update existing profile
      await connection.execute(
        `UPDATE user_profiles
         SET full_name = ?, phone = ?, city = ?, state = ?, country = ?,
             experience_years = ?, highest_education = ?, resume_path = ?,
             linkedin_url = ?, portfolio_url = ?, updated_at = ?
         WHERE user_id = ?`,
        [
          full_name,
          phone,
          city || null,
          state || null,
          country || null,
          experience_years || 0,
          highest_education || null,
          resume_path || null,
          linkedin_url || null,
          portfolio_url || null,
          now,
          finalUserId
        ]
      );

      await connection.commit();

      const [updatedProfiles] = await connection.execute(
        'SELECT * FROM user_profiles WHERE user_id = ?',
        [finalUserId]
      );

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfiles[0]
      });
    } else {
      // Create new profile
      await connection.execute(
        `INSERT INTO user_profiles
         (user_id, full_name, phone, city, state, country, experience_years,
          highest_education, resume_path, linkedin_url, portfolio_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalUserId,
          full_name,
          phone,
          city || null,
          state || null,
          country || null,
          experience_years || 0,
          highest_education || null,
          resume_path || null,
          linkedin_url || null,
          portfolio_url || null,
          now,
          now
        ]
      );

      await connection.commit();

      const [newProfiles] = await connection.execute(
        'SELECT * FROM user_profiles WHERE user_id = ?',
        [finalUserId]
      );

      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        user: newProfiles[0]
      });
    }
  } catch (error) {
    try { await connection.rollback(); } catch (e) { /* ignore rollback error */ }
    console.error('Profile handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      // expose error.message only in development if you want
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = user;
