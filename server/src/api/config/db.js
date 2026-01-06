const mysql = require('mysql2/promise');

/**
 * MySQL Connection Pool
 * ----------------------
 * Purpose:
 *   - Create a reusable pool of MySQL connections.
 *   - Avoid opening a new DB connection for every request (better performance).
 *   - Use async/await because mysql2/promise is being used.
 *
 * Environment Variables (loaded from .env):
 *   - DB_HOST: Database server hostname
 *   - DB_USER: Username for DB authentication
 *   - DB_PASSWORD: Password for DB authentication
 *   - DB_NAME: Database name to connect to
 *
 * Options:
 *   waitForConnections: true
 *       → Queue incoming requests when all connections are busy.
 *
 *   connectionLimit: 10
 *       → Max number of active connections allowed in the pool at once.
 *         (Customize based on server resources.)
 *
 *   queueLimit: 0
 *       → 0 = unlimited queued connection requests.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Test database connection
 * -------------------------
 * Purpose:
 *   - Verify database connection is working
 *   - Display connection status on server startup
 */
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();

    // Get database info
    const [rows] = await connection.execute('SELECT DATABASE() as db, USER() as user, VERSION() as version');
    const dbInfo = rows[0];

    console.log('✅ SQL Connection Status: SUCCESS');
    console.log(`   Database: ${dbInfo.db || process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   User: ${dbInfo.user || process.env.DB_USER}`);
    console.log(`   MySQL Version: ${dbInfo.version}`);

    return true;
  } catch (error) {
    console.error('❌ SQL Connection Status: FAILED');
    console.error(`   Error: ${error.message}`);
    console.error(`   Host: ${process.env.DB_HOST}`);
    console.error(`   Database: ${process.env.DB_NAME}`);
    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Export pool and testConnection function
module.exports = pool;
module.exports.testConnection = testConnection;
