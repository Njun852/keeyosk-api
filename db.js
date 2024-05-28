const msql = require('mysql2/promise')

const pool = msql.createPool(
    {
        host: 'sql12.freemysqlhosting.net',
        database: 'sql12709807',
        password: "lU6VNETjFr",
        user: "sql12709807",
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    }
)

module.exports = pool