const pool = require('../../config/db');

// Get all job roles
const getJobRoles = async (req, res) => {
    try {
        const [jobRoles] = await pool.execute(`
      SELECT id, name
      FROM job_roles
      ORDER BY name ASC
    `);

        res.json({
            success: true,
            jobRoles: jobRoles || []
        });
    } catch (error) {
        console.error('Admin get job roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create a new job role
const createJobRole = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate input
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Job role name is required'
            });
        }

        if (name.length > 150) {
            return res.status(400).json({
                success: false,
                error: 'Job role name must be 150 characters or less'
            });
        }

        // Check if job role already exists
        const [existing] = await pool.execute(
            'SELECT id FROM job_roles WHERE name = ?',
            [name.trim()]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Job role with this name already exists'
            });
        }

        // Insert new job role
        const [result] = await pool.execute(
            'INSERT INTO job_roles (name) VALUES (?)',
            [name.trim()]
        );

        // Fetch the created job role
        const [newJobRole] = await pool.execute(
            'SELECT id, name FROM job_roles WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Job role created successfully',
            jobRole: newJobRole[0]
        });
    } catch (error) {
        console.error('Admin create job role error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a job role
const updateJobRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Validate input
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Job role name is required'
            });
        }

        if (name.length > 150) {
            return res.status(400).json({
                success: false,
                error: 'Job role name must be 150 characters or less'
            });
        }

        // Check if job role exists
        const [existing] = await pool.execute(
            'SELECT id FROM job_roles WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Job role not found'
            });
        }

        // Check if another job role with the same name exists
        const [duplicate] = await pool.execute(
            'SELECT id FROM job_roles WHERE name = ? AND id != ?',
            [name.trim(), id]
        );

        if (duplicate.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Job role with this name already exists'
            });
        }

        // Update job role
        await pool.execute(
            'UPDATE job_roles SET name = ? WHERE id = ?',
            [name.trim(), id]
        );

        // Fetch the updated job role
        const [updatedJobRole] = await pool.execute(
            'SELECT id, name FROM job_roles WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Job role updated successfully',
            jobRole: updatedJobRole[0]
        });
    } catch (error) {
        console.error('Admin update job role error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete a job role
const deleteJobRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if job role exists
        const [existing] = await pool.execute(
            'SELECT id FROM job_roles WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Job role not found'
            });
        }

        // Check if job role is being used in jobs table
        const [jobsUsingRole] = await pool.execute(
            'SELECT COUNT(*) as count FROM jobs WHERE role_id = ?',
            [id]
        );

        if (jobsUsingRole[0].count > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete job role. It is being used by ${jobsUsingRole[0].count} job(s)`
            });
        }

        // Delete job role
        await pool.execute('DELETE FROM job_roles WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Job role deleted successfully'
        });
    } catch (error) {
        console.error('Admin delete job role error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getJobRoles,
    createJobRole,
    updateJobRole,
    deleteJobRole
};

