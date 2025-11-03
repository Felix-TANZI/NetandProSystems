const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de connexion
pool.getConnection()
    .then(connection => {
        console.log('✅ Connexion MySQL réussie');
        
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur connexion MySQL:', err.message);
    });

module.exports = pool;