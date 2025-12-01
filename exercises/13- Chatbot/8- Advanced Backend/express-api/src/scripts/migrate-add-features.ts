import database from '../db/connection';

/**
 * Migration script to add new features to the todos table:
 * - priority (low, medium, high)
 * - category (work, personal, shopping, health, other)
 * - due_date (future dates)
 * - description (detailed info)
 * - is_deleted (soft delete flag)
 * - deleted_at (timestamp when deleted)
 */

export async function migrateAddFeatures() {
    try {
        console.log('🚀 Starting migration: Adding new features to todos table...');

        // Add priority column
        try {
            await database.run(`
                ALTER TABLE todos ADD COLUMN priority TEXT DEFAULT 'medium';
            `);
            console.log('✅ Added priority column');
        } catch (error) {
            console.log('ℹ️  priority column already exists');
        }

        // Add category column
        try {
            await database.run(`
                ALTER TABLE todos ADD COLUMN category TEXT;
            `);
            console.log('✅ Added category column');
        } catch (error) {
            console.log('ℹ️  category column already exists');
        }

        // Add description column
        try {
            await database.run(`
                ALTER TABLE todos ADD COLUMN description TEXT;
            `);
            console.log('✅ Added description column');
        } catch (error) {
            console.log('ℹ️  description column already exists');
        }

        // Add due_date column
        try {
            await database.run(`
                ALTER TABLE todos ADD COLUMN due_date TEXT;
            `);
            console.log('✅ Added due_date column');
        } catch (error) {
            console.log('ℹ️  due_date column already exists');
        }

        // Add is_deleted column
        try {
            await database.run(`
                ALTER TABLE todos ADD COLUMN is_deleted BOOLEAN DEFAULT 0;
            `);
            console.log('✅ Added is_deleted column');
        } catch (error) {
            console.log('ℹ️  is_deleted column already exists');
        }

        // Add deleted_at column
        try {
            await database.run(`
                ALTER TABLE todos ADD COLUMN deleted_at TEXT;
            `);
            console.log('✅ Added deleted_at column');
        } catch (error) {
            console.log('ℹ️  deleted_at column already exists');
        }

        console.log('✨ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Execute if called directly
if (require.main === module) {
    migrateAddFeatures();
}
