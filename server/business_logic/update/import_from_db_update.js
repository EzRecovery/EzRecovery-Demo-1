const pool = require('../../db')

const getValues = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM borrower', (err, res) => {
            if (err) {
                reject("Error")
            }
            else {
                return resolve(res.rows)
            }
        });
    })
}


module.exports = importFromDBUpdate = async () => {
    const dbValues = await getValues()
    return dbValues;
}