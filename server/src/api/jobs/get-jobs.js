const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const CATEGORY_FILTER_MAPPING = require('../config/category-filters');

// Allowed values for each filter type to prevent injection
const ALLOWED_JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const ALLOWED_WORK_MODES = ['Office', 'Remote', 'Hybrid'];
const ALLOWED_EXPERIENCE = ['0']; // Only '0' for fresher filter

function parseSkills(skills) {
  if (!skills) return [];
  return skills.split(',').map(s => s.trim()).filter(Boolean);
}

// Helper function to optionally get user ID from token
function getUserIdFromToken(req) {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.sub || null;
  } catch (err) {
    // Token invalid or expired - return null (user not authenticated)
    return null;
  }
}

// Helper function to expand category into filters
function expandCategoryToFilters(category) {
  if (!category || !CATEGORY_FILTER_MAPPING[category]) {
    return null;
  }
  return CATEGORY_FILTER_MAPPING[category].filters;
}

// Helper function to build WHERE conditions from filters
function buildFilterConditions(filters, isAuthenticated) {
  const conditions = [];
  const params = [];
  let needsTagJoin = false;

  // jobTypes filter - validate against allowed list
  if (filters.jobTypes && Array.isArray(filters.jobTypes) && filters.jobTypes.length > 0) {
    // Validate that all job types are allowed
    const validJobTypes = filters.jobTypes.filter(type => ALLOWED_JOB_TYPES.includes(type));
    if (validJobTypes.length > 0) {
      const placeholders = validJobTypes.map(() => '?').join(',');
      conditions.push(`j.job_type IN (${placeholders})`);
      params.push(...validJobTypes);
    }
  }

  // workModes filter - validate against allowed list
  if (filters.workModes && Array.isArray(filters.workModes) && filters.workModes.length > 0) {
    // Validate that all work modes are allowed
    const validWorkModes = filters.workModes.filter(mode => ALLOWED_WORK_MODES.includes(mode));
    if (validWorkModes.length > 0) {
      const placeholders = validWorkModes.map(() => '?').join(',');
      conditions.push(`j.work_mode IN (${placeholders})`);
      params.push(...validWorkModes);
    }
  }

  // experience filter (fresher = 0 years) - validate against allowed values
  if (filters.experience && ALLOWED_EXPERIENCE.includes(filters.experience)) {
    conditions.push(`(j.min_experience = 0 OR j.min_experience IS NULL)`);
  }

  // cities filter
  if (filters.cities && Array.isArray(filters.cities) && filters.cities.length > 0) {
    const placeholders = filters.cities.map(() => '?').join(',');
    conditions.push(`j.city IN (${placeholders})`);
    params.push(...filters.cities);
  }

  // roles filter (match against normalized job_roles.name)
  if (filters.roles && Array.isArray(filters.roles) && filters.roles.length > 0) {
    const placeholders = filters.roles.map(() => '?').join(',');
    conditions.push(`jr.name IN (${placeholders})`);
    params.push(...filters.roles);
  }

  // tags filter (requires JOIN with job_tag_map and job_tags)
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    needsTagJoin = true;
    const tagConditions = filters.tags.map((tag) => {
      params.push(tag);
      return `LOWER(jt.name) = LOWER(?)`;
    });
    conditions.push(`(${tagConditions.join(' OR ')})`);
  }

  return { conditions, params, needsTagJoin };
}

async function getjobs(req, res) {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
    const userId = getUserIdFromToken(req);
    const category = req.query.category;

    // Expand category into filters if provided
    const filters = expandCategoryToFilters(category);
    const filterInfo = filters ? buildFilterConditions(filters, !!userId) : { conditions: [], params: [], needsTagJoin: false };

    // Build SQL query - exclude jobs user has already applied for if authenticated
    let sql;
    let params = [];
    // We always use table alias 'j' now because we join job_roles as 'jr'
    const prefix = 'j.';

    // Base SELECT clause - use DISTINCT if we have tag joins to avoid duplicate rows
    const selectKeyword = filterInfo.needsTagJoin ? 'SELECT DISTINCT' : 'SELECT';
    const selectClause = `
      ${selectKeyword}
        ${prefix}id,
        ${prefix}role_id,
        jr.name AS title,
        ${prefix}company,
        ${prefix}job_type,
        ${prefix}work_mode,
        ${prefix}city,
        ${prefix}locality,
        ${prefix}min_experience,
        ${prefix}max_experience,
        ${prefix}min_salary,
        ${prefix}max_salary,
        ${prefix}vacancies,
        ${prefix}description,
        ${prefix}logo_path,
        ${prefix}status,
        ${prefix}created_at,
        jr.name as role_name
    `;

    // Build FROM and JOIN clauses
    let fromClause;
    if (userId) {
      // User is authenticated - exclude applied jobs
      if (filterInfo.needsTagJoin) {
        fromClause = `
          FROM jobs j
          LEFT JOIN job_applications ja ON j.id = ja.job_id AND ja.user_id = ?
          LEFT JOIN job_tag_map jtm ON j.id = jtm.job_id
          LEFT JOIN job_tags jt ON jtm.tag_id = jt.id
          LEFT JOIN job_roles jr ON j.role_id = jr.id
        `;
      } else {
        fromClause = `
          FROM jobs j
          LEFT JOIN job_applications ja ON j.id = ja.job_id AND ja.user_id = ?
          LEFT JOIN job_roles jr ON j.role_id = jr.id
        `;
      }
    } else {
      // User not authenticated
      if (filterInfo.needsTagJoin) {
        fromClause = `
          FROM jobs j
          LEFT JOIN job_tag_map jtm ON j.id = jtm.job_id
          LEFT JOIN job_tags jt ON jtm.tag_id = jt.id
          LEFT JOIN job_roles jr ON j.role_id = jr.id
        `;
      } else {
        fromClause = `
          FROM jobs j
          LEFT JOIN job_roles jr ON j.role_id = jr.id
        `;
      }
    }

    // Build WHERE clause
    const whereConditions = [];

    // Base condition: only approved jobs that haven't expired
    whereConditions.push(`${prefix}status = 'approved'`);
    whereConditions.push(`${prefix}expires_at > NOW()`);

    // Exclude applied jobs if authenticated
    if (userId) {
      whereConditions.push(`ja.id IS NULL`);
    }

    // Add filter conditions
    if (filterInfo.conditions.length > 0) {
      whereConditions.push(...filterInfo.conditions);
    }

    // Add userId param if authenticated (must be first param for JOIN)
    if (userId) {
      params.push(userId);
    }

    // Add filter params
    params.push(...filterInfo.params);

    // Add limit
    params.push(limit);

    // Build final SQL
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    sql = `
      ${selectClause}
      ${fromClause}
      ${whereClause}
      ORDER BY ${prefix}created_at DESC
      LIMIT ?
    `;

    const [rows] = await pool.query(sql, params);

    // Fetch tags from normalized tables when available (silent fallback)
    let tagMap = {};
    if (Array.isArray(rows) && rows.length) {
      try {
        const ids = rows.map((r) => r.id);
        const placeholders = ids.map(() => '?').join(',');
        const tagSql = `SELECT jtm.job_id, jt.name as tag FROM job_tag_map jtm JOIN job_tags jt ON jt.id = jtm.tag_id WHERE jtm.job_id IN (${placeholders})`;
        const [tagRows] = await pool.query(tagSql, ids);
        tagRows.forEach((tr) => {
          tagMap[tr.job_id] = tagMap[tr.job_id] || [];
          tagMap[tr.job_id].push(tr.tag);
        });
      } catch (e) {
        // silently ignore missing tag tables or errors
      }
    }

    // Helper function to format salary range (monthly)
    const formatSalary = (minSalary, maxSalary) => {
      if (minSalary == null && maxSalary == null) return null;
      if (minSalary != null && maxSalary != null) {
        return `${minSalary}-${maxSalary} /Month`;
      }
      if (minSalary != null) return `${minSalary}+ /Month`;
      if (maxSalary != null) return `Up to ${maxSalary} /Month`;
      return null;
    };

    const jobs = rows.map(r => {
      let experiance = 'Not specified';
      if (r.min_experience == null && r.max_experience == null) experiance = 'Fresher';
      else if (r.min_experience != null && r.max_experience == null) experiance = `${r.min_experience}+ yrs`;
      else if (r.min_experience == null && r.max_experience != null) experiance = `Up to ${r.max_experience} yrs`;
      else experiance = `${r.min_experience}-${r.max_experience} yrs`;

      // Build location string safely handling null/undefined values
      let location = '';
      if (r.city) {
        location = r.city;
        if (r.locality) {
          location += `, ${r.locality}`;
        }
      } else if (r.locality) {
        location = r.locality;
      } else {
        location = 'Not specified';
      }

      return {
        id: r.id,
        roleId: r.role_id || null,
        roleName: r.role_name || null,
        title: r.title,
        company: r.company,
        type: r.job_type || 'Full-time',
        workMode: r.work_mode || 'Office',
        city: r.city || null, // Include city field for filtering
        location,
        tags: tagMap[r.id] || parseSkills(r.skills || r.tags || r.skill || ''),
        salary: formatSalary(r.min_salary, r.max_salary),
        minSalary: r.min_salary,
        maxSalary: r.max_salary,
        minExperience: r.min_experience,
        maxExperience: r.max_experience,
        vacancies: r.vacancies,
        description: r.description,
        logoPath: r.logo_path || null,
        status: r.status || 'approved', // Include status, default to approved for public listing
        createdAt: r.created_at,
        experiance,
      };
    });

    res.json({ ok: true, jobs });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    try {
      const fs = require('fs');
      const path = require('path');
      const dbgPath = path.join(__dirname, '../../../debug_jobs.log');
      const now = new Date().toISOString();
      fs.appendFileSync(dbgPath, `${now} - ERROR: ${err && err.stack ? err.stack : String(err)}\n`);
    } catch (e) {
      // ignore file logging errors
    }
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
};

module.exports = getjobs;