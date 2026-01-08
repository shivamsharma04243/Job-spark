
const pool = require('../../config/db');
const { sendEmail } = require('../../services/emailService');

/**
 * Get candidate_profiles table columns to verify structure
 */
async function getCandidateProfileColumns(connection) {
  try {
    const [columns] = await connection.execute('SHOW COLUMNS FROM candidate_profiles');
    return columns.map(col => col.Field);
  } catch (error) {
    return [];
  }
}

/**
 * Handler: Create or update user profile.
 * Exported as a const so you can attach it to a route elsewhere:
 *   router.put('/user', requireAuth, user);
 */
const candidateProfile = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    // Verify table structure
    const tableColumns = await getCandidateProfileColumns(connection);
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
      date_of_birth,
      gender,
      city,
      state,
      country,
      highest_qualification,
      trade_stream,
      key_skills,
      job_type,
      availability,
      expected_salary,
      id_proof_available,
      preferred_contact_method,
      willing_to_relocate,
      experience_years,
      resume_path,
      linkedin_url,
      github_url
    } = req.body;

    const finalUserId = authUserId || user_id;
    if (!finalUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required (ensure authentication or provide user_id in request body).'
      });
    }

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.'
      });
    }

    await connection.beginTransaction();

    // Check if profile exists
    const [existingProfiles] = await connection.execute(
      'SELECT user_id FROM candidate_profiles WHERE user_id = ?',
      [finalUserId]
    );

    // Fetch user email and name for welcome email (only if creating new profile)
    let userEmail = null;
    let userName = null;
    if (existingProfiles.length === 0) {
      try {
        const [userRows] = await connection.execute(
          'SELECT email, name FROM users WHERE id = ?',
          [finalUserId]
        );
        if (userRows.length > 0) {
          userEmail = userRows[0].email;
          userName = userRows[0].name || full_name || 'there';
        }
      } catch (err) {
        // Log error but don't fail profile creation
        console.error('Error fetching user data for email:', err);
      }
    }

    const now = new Date();

    // Handle key_skills - convert array to JSON string if needed
    let keySkillsJson = null;
    if (key_skills) {
      if (Array.isArray(key_skills)) {
        // Only stringify if array has items
        if (key_skills.length > 0) {
          keySkillsJson = JSON.stringify(key_skills);
        }
      } else if (typeof key_skills === 'string') {
        // If it's a comma-separated string, convert to array then JSON
        try {
          const skillsArray = key_skills.split(',').map(s => s.trim()).filter(s => s);
          if (skillsArray.length > 0) {
            keySkillsJson = JSON.stringify(skillsArray);
          }
        } catch (e) {
          // If it's already JSON, try to parse and validate
          try {
            const parsed = JSON.parse(key_skills);
            if (Array.isArray(parsed) && parsed.length > 0) {
              keySkillsJson = key_skills;
            }
          } catch (e2) {
            // If parsing fails, use as is if not empty
            if (key_skills.trim()) {
              keySkillsJson = key_skills;
            }
          }
        }
      } else {
        keySkillsJson = JSON.stringify(key_skills);
      }
    }

    // Handle willing_to_relocate - convert to tinyint (0 or 1)
    let willingToRelocateValue = null;
    if (willing_to_relocate !== undefined && willing_to_relocate !== null) {
      if (typeof willing_to_relocate === 'boolean') {
        willingToRelocateValue = willing_to_relocate ? 1 : 0;
      } else if (typeof willing_to_relocate === 'string') {
        const lower = willing_to_relocate.toLowerCase();
        willingToRelocateValue = (lower === 'yes' || lower === 'true' || lower === '1') ? 1 : 0;
      } else {
        willingToRelocateValue = willing_to_relocate ? 1 : 0;
      }
    }

    if (existingProfiles.length > 0) {
      // Update existing profile - dynamically build query based on provided fields
      const updateFields = [];
      const updateValues = [];

      // Always update these core fields
      updateFields.push('full_name = ?');
      updateValues.push(full_name);

      updateFields.push('phone = ?');
      updateValues.push(phone !== undefined ? phone : null);

      updateFields.push('date_of_birth = ?');
      updateValues.push(date_of_birth || null);

      updateFields.push('gender = ?');
      updateValues.push(gender || null);

      updateFields.push('city = ?');
      updateValues.push(city || null);

      updateFields.push('state = ?');
      updateValues.push(state || null);

      updateFields.push('country = ?');
      updateValues.push(country || null);

      updateFields.push('highest_qualification = ?');
      updateValues.push(highest_qualification || null);

      updateFields.push('trade_stream = ?');
      updateValues.push(trade_stream || null);

      updateFields.push('key_skills = ?');
      updateValues.push(keySkillsJson);

      updateFields.push('job_type = ?');
      updateValues.push(job_type || null);

      updateFields.push('availability = ?');
      updateValues.push(availability || null);

      updateFields.push('expected_salary = ?');
      updateValues.push(expected_salary || null);

      updateFields.push('id_proof_available = ?');
      updateValues.push(id_proof_available || null);

      updateFields.push('preferred_contact_method = ?');
      updateValues.push(preferred_contact_method || null);

      updateFields.push('willing_to_relocate = ?');
      updateValues.push(willingToRelocateValue);

      updateFields.push('experience_years = ?');
      updateValues.push(experience_years !== undefined && experience_years !== null ? parseFloat(experience_years) : null);

      // Only update resume_path if it was provided
      if (req.body.resume_path !== undefined) {
        updateFields.push('resume_path = ?');
        updateValues.push(resume_path || null);
      }

      updateFields.push('linkedin_url = ?');
      updateValues.push(linkedin_url || null);

      updateFields.push('github_url = ?');
      updateValues.push(github_url || null);

      updateFields.push('updated_at = ?');
      updateValues.push(now);

      // Add user_id for WHERE clause
      updateValues.push(finalUserId);

      const updateResult = await connection.execute(
        `UPDATE candidate_profiles SET ${updateFields.join(', ')} WHERE user_id = ?`,
        updateValues
      );

      await connection.commit();

      const [updatedProfiles] = await connection.execute(
        'SELECT * FROM candidate_profiles WHERE user_id = ?',
        [finalUserId]
      );

      // Parse key_skills JSON for response
      if (updatedProfiles[0] && updatedProfiles[0].key_skills) {
        try {
          updatedProfiles[0].key_skills = JSON.parse(updatedProfiles[0].key_skills);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfiles[0]
      });
    } else {
      // Create new profile
      const insertValues = [
        finalUserId,
        full_name,
        phone || null,
        date_of_birth || null,
        gender || null,
        city || null,
        state || null,
        country || null,
        highest_qualification || null,
        trade_stream || null,
        keySkillsJson,
        job_type || null,
        availability || null,
        expected_salary || null,
        id_proof_available || null,
        preferred_contact_method || null,
        willingToRelocateValue,
        experience_years !== undefined && experience_years !== null ? parseFloat(experience_years) : null,
        resume_path || null,
        linkedin_url || null,
        github_url || null,
        now,
        now
      ];

      const columnNames = [
        'user_id', 'full_name', 'phone', 'date_of_birth', 'gender', 'city', 'state', 'country',
        'highest_qualification', 'trade_stream', 'key_skills', 'job_type', 'availability', 'expected_salary', 'id_proof_available',
        'preferred_contact_method', 'willing_to_relocate', 'experience_years', 'resume_path',
        'linkedin_url', 'github_url', 'created_at', 'updated_at'
      ];

      const insertResult = await connection.execute(
        `INSERT INTO candidate_profiles
         (user_id, full_name, phone, date_of_birth, gender, city, state, country,
          highest_qualification, trade_stream, key_skills, job_type, availability, expected_salary, id_proof_available,
          preferred_contact_method, willing_to_relocate, experience_years, resume_path,
          linkedin_url, github_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        insertValues
      );

      await connection.commit();

      const [newProfiles] = await connection.execute(
        'SELECT * FROM candidate_profiles WHERE user_id = ?',
        [finalUserId]
      );

      // Parse key_skills JSON for response
      if (newProfiles[0] && newProfiles[0].key_skills) {
        try {
          newProfiles[0].key_skills = JSON.parse(newProfiles[0].key_skills);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }

      // Send welcome email to candidate (only for new profiles)
      if (userEmail && userName) {
        try {
          const firstName = userName.split(' ')[0] || userName;
          const dashboardLink = process.env.FRONTEND_URL || 'http://localhost:5173';
          const emailSubject = 'Welcome to Jobion – Let\'s Find Your Next Opportunity';
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>

              <p>Welcome to <strong>Jobion</strong> 🎉</p>

              <p>Your account has been successfully created, and you're now one step closer to finding opportunities that truly match your skills and career goals.</p>

              <h3 style="color: #374151; margin-top: 30px;">What you can do next:</h3>
              <ul style="line-height: 1.8;">
                <li>Complete your profile to improve job matches</li>
                <li>Upload your resume</li>
                <li>Apply to jobs curated for you</li>
                <li>Get recommendations based on your skills</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardLink}/candidate/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  👉 Get Started
                </a>
              </div>

              <p>If you have any questions, we're just a reply away.</p>

              <p style="margin-top: 30px;">
                Best wishes,<br>
                <strong>Team Jobion</strong><br>
                <em>Connecting Talent with Opportunity</em>
              </p>
            </div>
          `;

          await sendEmail(userEmail, emailSubject, emailHtml);
        } catch (emailError) {
          // Log error but don't fail profile creation
          console.error('Error sending welcome email:', emailError);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        user: newProfiles[0]
      });
    }
  } catch (error) {
    try {
      await connection.rollback();
    } catch (e) {
      // Rollback error
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      sqlError: process.env.NODE_ENV === 'development' ? error.sqlMessage : undefined,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = candidateProfile;
