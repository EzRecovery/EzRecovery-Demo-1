const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "ezrecovery",
    host: "localhost",
    port: 5432,
    database: "ezrecovery",
})

module.exports = pool;