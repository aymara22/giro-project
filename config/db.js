const mysql = require('mysql2/promise');
require('dotenv').config(); // Para cargar las variables de entorno

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Define el máximo de conexiones en el pool
    queueLimit: 0         // Define el límite de la cola de conexiones
});

// Conexión a la base de datos con manejo de errores
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida.');
        connection.release(); // Liberar la conexión de prueba
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    }
})();


// Exportar el pool
module.exports = pool;