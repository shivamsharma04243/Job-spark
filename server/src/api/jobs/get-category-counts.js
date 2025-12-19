const pool = require('../config/db');
const CATEGORY_FILTER_MAPPING = require('../config/category-filters');

// Helper function to build WHERE conditions from filters (reused from get-jobs.js)
function buildFilterConditions(filters) {
  const conditions = [];
  const params = [];
  let needsTagJoin = false;

  // jobTypes filter
  if (filters.jobTypes && Array.isArray(filters.jobTypes) && filters.jobTypes.length > 0) {
    const placeholders = filters.jobTypes.map(() => '?').join(',');
    conditions.push(`j.job_type IN (${placeholders})`);
    params.push(...filters.jobTypes);
  }

  // workModes filter
  if (filters.workModes && Array.isArray(filters.workModes) && filters.workModes.length > 0) {
    const placeholders = filters.workModes.map(() => '?').join(',');
    conditions.push(`j.work_mode IN (${placeholders})`);
    params.push(...filters.workModes);
  }

  // experience filter (fresher = 0 years)
  if (filters.experience === "0") {
    conditions.push(`(j.min_experience = 0 OR j.min_experience IS NULL) AND (j.max_experience = 0 OR j.max_experience IS NULL)`);
  }

  // cities filter
  if (filters.cities && Array.isArray(filters.cities) && filters.cities.length > 0) {
    const placeholders = filters.cities.map(() => '?').join(',');
    conditions.push(`j.city IN (${placeholders})`);
    params.push(...filters.cities);
  }

  // roles filter (match against job_roles.name)
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

/**
 * GET /api/jobs/category-counts
 * Returns job counts for each category based on approved jobs only
 */
async function getCategoryCounts(req, res) {
  try {
    const counts = {};

    // Get all category IDs from the mapping
    const categoryIds = Object.keys(CATEGORY_FILTER_MAPPING);

    // Count jobs for each category
    for (const categoryId of categoryIds) {
      const category = CATEGORY_FILTER_MAPPING[categoryId];
      const filters = category.filters;
      const filterInfo = buildFilterConditions(filters);

      // Build SQL query to count jobs
      let sql;
      let params = [];

      // Build FROM clause - always join job_roles for role filtering
      let fromClause;
      if (filterInfo.needsTagJoin) {
        fromClause = `
          FROM jobs j
          LEFT JOIN job_roles jr ON j.role_id = jr.id
          LEFT JOIN job_tag_map jtm ON j.id = jtm.job_id
          LEFT JOIN job_tags jt ON jtm.tag_id = jt.id
        `;
      } else {
        fromClause = `
          FROM jobs j
          LEFT JOIN job_roles jr ON j.role_id = jr.id
        `;
      }

      // Build WHERE clause
      const whereConditions = ['j.status = ?'];
      params.push('approved');

      // Add filter conditions
      if (filterInfo.conditions.length > 0) {
        whereConditions.push(...filterInfo.conditions);
        params.push(...filterInfo.params);
      }

      // Build final SQL - use DISTINCT if we have tag joins to avoid duplicate counts
      // Use alias for reliable count extraction
      const selectKeyword = filterInfo.needsTagJoin
        ? 'SELECT COUNT(DISTINCT j.id) as job_count'
        : 'SELECT COUNT(*) as job_count';
      const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

      sql = `
        ${selectKeyword}
        ${fromClause}
        ${whereClause}
      `;

      try {
        const [rows] = await pool.query(sql, params);
        let count = 0;
        if (rows && rows[0]) {
          // Extract count using the alias
          count = Number(rows[0].job_count) || 0;
        }
        counts[categoryId] = count;
        console.log(`Category ${categoryId}: ${count} jobs`);
      } catch (err) {
        console.error(`Error counting jobs for category ${categoryId}:`, err);
        console.error('SQL:', sql);
        console.error('Params:', params);
        counts[categoryId] = 0;
      }
    }

    res.json({ ok: true, counts });
  } catch (err) {
    console.error('GET /api/jobs/category-counts error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getCategoryCounts;
