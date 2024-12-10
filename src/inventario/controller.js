const pool = require('../../db')
const queries = require('./queries')

const getInventario = (req, res) => {
    pool.query(queries.getInventario, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

module.exports = {
    getInventario,
};