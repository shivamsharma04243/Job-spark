// routes/profile.js
const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const { requireAuth } = require('../../../middlewares/auth');

// PUT /api/profile/user - Create or update user profile
// Require authentication to ensure req.user is populated via the JWT cookie
router.put('/user', requireAuth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    // Get user ID from the auth middleware (requireAuth sets req.user)
    const userId = req.user?.id; // This should exist if requireAuth passed
    
    // If you don't have auth middleware yet, you can get user_id from body temporarily
    // But it's better to use proper authentication
    const {
      user_id, // Optional: for cases where client provides it
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

    // Use the authenticated user id first; if not present (rare), fall back to body-provided user_id
    const finalUserId = userId || user_id;
    if (!finalUserId) {
      // If the router is protected by requireAuth this won't happen for authenticated requests
      return res.status(400).json({ success: false, message: 'User ID is required (ensure you are authenticated)' });
    }

    // Validate required fields
    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Full name and phone are required'
      });
    }

    await connection.beginTransaction();

    // Check if profile already exists
    const [existingProfiles] = await connection.execute(
      'SELECT user_id FROM user_profiles WHERE user_id = ?',
      [finalUserId]
    );

    const now = new Date();
    
    if (existingProfiles.length > 0) {
      // Update existing profile
      const [result] = await connection.execute(
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

      // Get the updated profile
      const [updatedProfiles] = await connection.execute(
        'SELECT * FROM user_profiles WHERE user_id = ?',
        [finalUserId]
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfiles[0]
      });

    } else {
      // Create new profile
      const [result] = await connection.execute(
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

      // Get the newly created profile
      const [newProfiles] = await connection.execute(
        'SELECT * FROM user_profiles WHERE user_id = ?',
        [finalUserId]
      );

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        user: newProfiles[0]
      });
    }

  } catch (error) {
    await connection.rollback();
    console.error('Profile update error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
});



module.exports = router;