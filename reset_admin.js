const { Client } = require('pg');
const bcrypt = require('bcrypt'); // Make sure you have 'bcrypt' or 'bcryptjs' installed

// ⚠️ CHANGE THIS connection string to match your .env file
const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/your_database_name'
});

async function reset() {
    await client.connect();
    
    // 1. Generate a real hash for "password123"
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    
    // 2. Update the user
    const res = await client.query(
        `UPDATE admin_users SET password_hash = $1 WHERE username = 'admin'`, 
        [hash]
    );
    
    console.log(`Updated ${res.rowCount} user(s). Your new password is: password123`);
    await client.end();
}

reset();