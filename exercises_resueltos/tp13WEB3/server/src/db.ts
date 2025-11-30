import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(__dirname, '../db.json');

interface Database {
    claims: string[];
}

const defaultDb: Database = {
    claims: []
};

// Initialize DB file if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
}

export const db = {
    read: (): Database => {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return defaultDb;
        }
    },

    write: (data: Database) => {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    },

    hasClaimed: (address: string): boolean => {
        const data = db.read();
        return data.claims.includes(address.toLowerCase());
    },

    addClaim: (address: string) => {
        const data = db.read();
        if (!data.claims.includes(address.toLowerCase())) {
            data.claims.push(address.toLowerCase());
            db.write(data);
        }
    }
};
