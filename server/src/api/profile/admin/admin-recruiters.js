const pool = require('../../config/db');

const getAdminRecruiters = async (req, res) => {
  try {
    const [recruiters] = await pool.execute(`
      SELECT 
        rp.user_id,
        rp.company_name,
        rp.company_website,
        rp.company_type,
        rp.address_line1,
        rp.address_line2,
        rp.city,
        rp.state,
        rp.country,
        rp.pincode,
        rp.verified,
        rp.verification_notes,
        rp.created_at,
        rp.updated_at,
        u.email,
        u.username
      FROM recruiter_profiles rp
      LEFT JOIN users u ON rp.user_id = u.id
      ORDER BY rp.created_at DESC
    `);

    res.json({
      success: true,
      recruiters: recruiters || []
    });
  } catch (error) {
    console.error('Admin get recruiters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = getAdminRecruiters;