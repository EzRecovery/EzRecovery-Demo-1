const pool = require('../../db')
const LocalStorage = require('node-localstorage').LocalStorage
var localStorage = new LocalStorage('./scratch');

const insertValues = async (id, name, bank, address, contact, contact1, debt, area, status, category) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO borrower(id,name,bank_name,address,contact_no,contact_no_1,debt_to_clear,status,category,area_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);', [id, name, bank, address, contact, contact1, debt, status, category, area], (err, res) => {
            if (err) {
                reject(err)
            }
            else {
                resolve("Success!")
            }
        });
    })
}

const deleteValues = async () => {
    return new Promise((resolve, reject) => {
        pool.query(('DELETE FROM borrower'), (err, res) => {
            if (err) {
                reject("DELETE Error")
            }
            else {
                resolve("DELETE!")
            }
        });
    })
}

// const checkIfSuccess = async (resArray) => {
//     if (parseInt(localStorage.getItem('count')) === parseInt(resArray.length)) {
//         localStorage.setItem('response', "Success!")
//     }
//     else {
//         localStorage.setItem('response', "Failure")
//     }
// }


module.exports = exportToDatabase = async (resArray) => {
    try {
        await deleteValues()
        //console.log(resArray)
        let traverse = []
        let missing = []
        let complete = []
        // console.log(resArray)
        for (let i = 0; i < resArray.length; i++) {
            traverse.push(resArray[i])
            for (let j = 0; j < traverse.length; j++) {
                let c1 = traverse[j].Id ? 1 : 0
                let c2 = traverse[j].Name ? 1 : 0
                let c3 = traverse[j].Bank_Name ? 1 : 0
                let c4 = traverse[j].Address ? 1 : 0
                let c5 = traverse[j].Contact_No ? 1 : 0
                let c6 = traverse[j].Alternate_Contact_No ? 1 : 0
                let c7 = traverse[j].Debt_to_clear ? 1 : 0
                let c8 = traverse[j].Area_Id ? 1 : 0
                let c9 = traverse[j].Status ? 1 : 0
                if (c1 === 1 && c2 === 1 && c3 === 1 && c4 === 1 && c5 === 1 && c6 === 1 && c7 === 1 && c8 === 1 && c9 === 1) {
                    let toBePushed = {
                        Id: traverse[j].Id,
                        Name: traverse[j].Name,
                        Bank_Name: traverse[j].Bank_Name,
                        Address: traverse[j].Address,
                        Contact_No: traverse[j].Contact_No,
                        Alternate_Contact_No: traverse[j].Alternate_Contact_No,
                        Debt_to_clear: traverse[j].Debt_to_clear,
                        Area_Id: traverse[j].Area_Id,
                        Status: traverse[j].Status,
                        category: 1,
                    }
                    complete.push(toBePushed)
                    toBePushed = {}
                }
                else {
                    let toBePushed = {
                        Id: traverse[j].Id,
                        Name: traverse[j].Name,
                        Bank_Name: traverse[j].Bank_Name,
                        Address: traverse[j].Address,
                        Contact_No: traverse[j].Contact_No,
                        Alternate_Contact_No: traverse[j].Alternate_Contact_No,
                        Debt_to_clear: traverse[j].Debt_to_clear,
                        Area_Id: traverse[j].Area_Id,
                        Status: traverse[j].Status,
                        category: 3,
                    }
                    missing.push(toBePushed)
                    toBePushed = {}
                }
            }
            traverse.pop()
            //await checkIfSuccess(resArray)
        }
        if (missing.length > 0) {
            for (let i = 0; i < missing.length; i++) {
                await insertValues(missing[i].Id, missing[i].Name, missing[i].Bank_Name, missing[i].Address, missing[i].Contact_No, missing[i].Alternate_Contact_No, missing[i].Debt_to_clear, missing[i].Area_Id, missing[i].Status, missing[i].category);
            }
        }
        if (complete.length > 0) {
            for (let i = 0; i < complete.length; i++) {
                await insertValues(complete[i].Id, complete[i].Name, complete[i].Bank_Name, complete[i].Address, complete[i].Contact_No, complete[i].Alternate_Contact_No, complete[i].Debt_to_clear, complete[i].Area_Id, complete[i].Status, complete[i].category);
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

// await insertValues(resArray[i].No, resArray[i].Name, resArray[i].Marks)
// localStorage.setItem('count', (i + 1))