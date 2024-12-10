const { password } = require("pg/lib/defaults");

const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "lpostgres.railway.internal",
    database: "railway",
    password: "cCqMLxPOvUifriLADvofheZggrMlhOtz",
    port: 50020,
});

module.exports = pool;