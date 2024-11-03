const {Pool} = require('pg');
require('dotenv').config(); // Para cargar las variables de entorno

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    max: 10,     
    idleTimeoutMillis: 30000,       
    connectionTimeoutMillis: 2000,        
});

pool.on('connect', () => {
    console.log('Conexión exitosa a la base de datos');
});

pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
});


// Exportar el pool
module.exports = pool;