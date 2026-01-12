require('dotenv').config();
const pool = require('./src/api/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await pool.getConnection();

    console.log('Running migration: Adding visibility fields to jobs table...');

    // Check existing columns
    const [tableColumns] = await connection.execute(`
      DESCRIBE jobs
    `);

    const columnNames = tableColumns.map(col => col.Field);
    console.log('Existing columns:', columnNames.join(', '));

    // Add show_interview_address column if it doesn't exist
    if (!columnNames.includes('show_interview_address')) {
      console.log('Adding show_interview_address column...');
      await connection.execute(`
        ALTER TABLE jobs
        ADD COLUMN show_interview_address BOOLEAN DEFAULT TRUE
      `);
    } else {
      console.log('show_interview_address column already exists, skipping...');
    }

    // Add show_contact_phone column if it doesn't exist
    if (!columnNames.includes('show_contact_phone')) {
      console.log('Adding show_contact_phone column...');
      await connection.execute(`
        ALTER TABLE jobs
        ADD COLUMN show_contact_phone BOOLEAN DEFAULT TRUE
      `);
    } else {
      console.log('show_contact_phone column already exists, skipping...');
    }

    console.log('Migration completed successfully!');

    // Verify the changes
    console.log('Verifying table structure...');
    const [finalColumns] = await connection.execute(`
      DESCRIBE jobs
    `);

    console.log('Updated table structure:');
    finalColumns.forEach(col => {
      if (col.Field === 'show_interview_address' || col.Field === 'show_contact_phone') {
        console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(required)'} Default: ${col.Default}`);
      }
    });

  } catch (error) {
    console.error('Migration failed:', error.message);
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Note: Column already exists, skipping...');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released.');
    }
    process.exit(0);
  }
}

runMigration().catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});

