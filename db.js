const msql = require('mysql2/promise')

const pool = msql.createPool(
    {
        host: 'localhost',
        database: 'keeyosk_db',
        password: "password",
        user: "root",
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    }
)

module.exports = pool