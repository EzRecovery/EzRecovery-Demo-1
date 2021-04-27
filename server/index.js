const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const fs = require('fs');
const jwt = require('jsonwebtoken');


//port functionality
const importFromExcel = require('./business_logic/import/import_from_excel')
const exportToDatabase = require('./business_logic/import/export_to_database')

//update functionality
const importFromExcelUpdate = require('./business_logic/update/import_from_excel_update')
const importFromDBUpdate = require('./business_logic/update/import_from_db_update')
const exportToDBUpdate = require('./business_logic/update/export_to_db_update')

//export functionality
const importFromDBExport = require('./business_logic/export/importFromDBExport');
const exportToExcel = require('./business_logic/export/exportToExcel')

const LocalStorage = require('node-localstorage').LocalStorage;
const pool = require('./db');
var localStorage = new LocalStorage('./scratch');


app.use(express.json()) //req.body
app.use(cors());


const pg = require('pg');
const cs = require('../server/database-confiq/config');
var client = new pg.Client(cs.cs);
client.connect();

const pathOfDir = 'F:/Final Project/EzRecovery/'

app.post('/insertRecords', async (req, res) => {

    try {
        const fileName = req.body.filename;
        const actualPath = path.join(pathOfDir, path.basename(fileName))
        fs.access(actualPath, async (err) => {
            if (err) {
                res.json({ msg: `The file is not stored on the proper path! Kindly store it in :- ${pathOfDir}` })
            }
            else {
                async function performTasks() {
                    try {
                        const iFromExcel = await importFromExcel(actualPath)
                        await exportToDatabase(iFromExcel);
                    }
                    catch (err) {
                        console.log("Error", err)
                    }
                }
                await performTasks().then(res.send({ msg: localStorage.getItem('response') }))
            }
        })

    } catch (err) {
        res.json({ msg: err })
    }

})

app.post('/updateRecords', async (req, res) => {

    try {
        const fileName = req.body.filename;
        const actualPath = path.join(pathOfDir, path.basename(fileName))
        fs.access(actualPath, async (err) => {
            if (err) {
                res.json({ msg: `The file is not stored on the proper path! Kindly store it in :- ${pathOfDir}` })
            }
            else {
                async function performUpdateTasks() {
                    try {
                        const iFromExcelUpdate = await importFromExcelUpdate(actualPath)
                        const iFromDBUpdate = await importFromDBUpdate();
                        await exportToDBUpdate(iFromExcelUpdate, iFromDBUpdate);
                    }
                    catch (err) {
                        console.log("Error", err)
                    }
                }
                await performUpdateTasks().then(res.json({ msg: "Records updated successfully!" }))
            }
        })

    } catch (err) {
        res.json({ msg: err })
    }

})

const getDate = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT start_date, end_date FROM leave WHERE field_staff_id=$1;', [id], (err, res) => {
            if (err) {
                //console.log(err)
                return reject(err)
            }
            else {
                return resolve(res.rows)
            }
        })
    })
}


app.post('/insertLeaves', (req, res) => {
    const id = req.body.id;
    const start = req.body.start
    const end = req.body.end

    pool.query('INSERT INTO leave VALUES($1,$2,$3);', [start, end, id], (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ msg: "YESS" })
        }
    })

})


app.post('/getLeaves', async (req, res) => {
    const id = req.body.id;
    const date = await getDate(id)
    //console.log(date)
    res.json({ data: date })
})

app.post('/exportDetails', async (req, res) => {
    const date = req.body.today;

    const iFromDBExport = await importFromDBExport();
    const writeToExcel = await exportToExcel(pathOfDir, date, iFromDBExport);
    if (writeToExcel === 1) {
        let msg = "Records have been exported successfully! An excel file of the same has been stored onto to the path" + pathOfDir;
        let FileName = 'EzRecovery_export_' + date + '.xlsx';
        res.json({ msg: msg, name: FileName })
    }
})


app.post('/login', (req, res) => {


    const { username, password } = req.body.data;
    console.log("come", username, password);
    client.query("SELECT * FROM admin where username= $1 and password = $2", [username, password], (error, results) => {
        if (error) {
            throw error
        }
        var user = results.rows

        if (results.rowCount > 0) {
            console.log(user)
            const token = jwt.sign(
                { id: user.id, isAdmin: true },
                // process.env.JWT_SECRET,
                cs.JWT_SECRET_code,
                {
                    expiresIn: `${1000 * 60 * 30}ms`, //30 min
                }
            );
            // res.cookie('token', token, { httpOnly: true, maxAge: 60*30*1000 });
            res.status(200).json({ status: 'success', token });
        }
        else {
            res.status(401).json({ status: 'fail' });
            // res.json({ status: 'fail' });
        }
    })



})

app.post('/loginFieldStaff', (req, res) => {


    const { username, password } = req.body.data;
    console.log("come", username, password);
    client.query("SELECT * FROM field_staff where username= $1 and password = $2", [username, password], (error, results) => {
        if (error) {
            throw error
        }
        var user = results.rows

        if (results.rowCount > 0) {
            console.log(user)
            const token = jwt.sign(
                { id: user.id, isAdmin: true },
                // process.env.JWT_SECRET,
                cs.JWT_SECRET_code,
                {
                    expiresIn: `${1000 * 60 * 30}ms`, //30 min
                }
            );
            // res.cookie('token', token, { httpOnly: true, maxAge: 60*30*1000 });
            res.status(200).json({ status: 'success', token });
        }
        else {
            res.status(401).json({ status: 'fail' });
            // res.json({ status: 'fail' });
        }
    })



})

//i will uncomment it after development, it is imp !!
//app.use(isValidAuth);


app.get('/getAllRecords', (req, res) => {

    client.query("SELECT * FROM borrower ", (error, results) => {
        if (error) {
            throw error
        }

        if (results.rowCount > 0) {

            var records = results.rows;
            res.status(200).json({ status: 'success', records });
        }
        else {
            res.status(200).json({ status: 'No_Data' });

        }

    })




})

app.get('/getAllocationDetails', async (req, res) => {


    // var AllocationDetails = await Allocation_util();
    // console.log(AllocationDetails)
    // res.status(200).json({ status: 'u get access to all details', AllocationDetails });

    //extract current date
    var today = new Date();
    var currentDate = today.toISOString().slice(0, 10)
    var AllocationDetails = [];
    await client.query('SELECT * FROM field_staff WHERE id NOT IN (SELECT field_staff_id FROM leave where ($1) between start_date and end_date )', [currentDate], (error, results) => {
        // client.query("SELECT * FROM field_staff", (error, results) => {
        if (error) {
            throw error
        }

        // var 1 = results.rows;
        AllocationDetails[0] = results.rows;
        //  console.log(results.rows);
        //  console.log(data)
    })

    await client.query('select count(id) from borrower where category = ($1)', [1], (error, results) => {
        if (error) {
            throw error
        }

        AllocationDetails[1] = results.rows[0];
        // console.log(results.rows[0]);
    })

    await client.query('select count(*) from allocation where allocation_date = ($1)', [currentDate], (error, results) => {

        if (error) {
            throw error
        }

        AllocationDetails[2] = results.rows[0];
        // console.log(data);
        res.status(200).json({ status: 'u get access to all details', AllocationDetails });
    })
})

app.post('/xyz', async (req, res) => {
    const { perFieldStaff, availableEmp } = req.body.data;
    console.log(perFieldStaff);
    console.log(availableEmp[0]['id']);
    console.log("length", availableEmp.length);

    var results;
    for (let i = 0; i < availableEmp.length; i++) {
        var akhil;
        try {
            akhil = await client.query("SELECT * FROM location where field_staff_id = ($1) ", [availableEmp[i]['id']]);
        } catch (err) {
            console.log(err)
        }


        //AllocationDetails[2] = results.rows[0];
        console.log("for employee ----------------" + (i + 1) + " all location preferences");
        if (akhil)
            console.log(akhil.rows);
        else {
            console.log("nhi aaya")
        }

        var allLocation = akhil.rows;
        let count = 0;
        //console.log("records are " + allLocation[0]['area_id'])
        // console.log(results.rows[0])
        for (let j = 0; j < akhil.rowCount; j++) {

            //console.log(results.rows[j])
            var bids;

            bids = await client.query("SELECT id from borrower where area_id =($1) and category =" + 1, [allLocation[j]['area_id']]);
            var condition;
            console.log("borrowers id who comes in prefered location")
            console.log(bids.rows)

            if (bids.rowCount > 0) {
                // console.log("j =" + j + "borrwers" + borrower_ids)
                if (bids.rowCount >= perFieldStaff || bids.rowCount >= count) {
                    count = perFieldStaff - count;
                    condition = count;
                }
                else {
                    condition = bids.rowCount;
                    count += bids.rowCount
                }
                console.log("individual id");
                console.log(bids.rows[0]);

                for (let k = 0; k < condition; k++) {

                    console.log([bids.rows[k]['id']]);
                    console.log([allLocation[j]['area_id']]);
                    client.query("update borrower set category =" + 2 + " where id = " + bids.rows[k]['id'] + " and area_id=" + allLocation[j]['area_id']);

                    // var day = '22-04-2021';
                    const todayDay = new Date();
                    const day = todayDay.toISOString().slice(0, 10)

                    client.query("insert into allocation(allocation_date,field_staff_id,borrower_id) values('" + day + "'," + availableEmp[i]['id'] + "," + bids.rows[k]['id'] + ")", (error, r2) => {
                        if (error) {
                            throw error
                        }
                    })

                } //for k
            }// null condition if 


            if (count >= perFieldStaff)
                break;


        }   //for loop j



    }//for loop i
    console.log('done');
    res.status(200).json({ status: 'allocation is complete' });
})


// //demo api for debugging
// app.post('/demo', (req, res) => {

//     var keys = "name";
//     var argKeys = "xxxx";
//     var id = 5;
//     // var query = ;
//     client.query("update t set name='" + keys + "' where id = ($1)", [3], (err, res) => {
//         // if (err) {
//         //     console.error(err);
//         //     return;
//         // }
//         // if (err) {
//         //     console.error(err);
//         //     return;
//         // }
//         console.log('Data update successful');
//         // client.end();
//     });


//     res.status(200).json({ status: 'debugging done' });


// })




/* API's for field staff*/
app.post('/myAllocation', async (req, res) => {

    const { field_staff_username } = req.body.data;
    console.log(field_staff_username);
    var MyAllocation = [];
    let id = await client.query("select id from field_staff  where username =($1)", [field_staff_username]);
    //console.log(id.rows[0]['id']);
    var result1 = await client.query("select * from Allocation where field_staff_id=($1)", [id.rows[0]['id']]);

    MyAllocation.push(result1.rows);
    var result2 = [];
    let B_record;
    for (let i = 0; i < result1.rowCount; i++) {

        B_record = await client.query("select * from borrower where id=($1)", [result1.rows[i]['borrower_id']]);
        //console.log(B_record.rows)
        result2.push(B_record.rows[0]);
    }
    MyAllocation.push(result2);
    console.log(MyAllocation);


    res.status(200).json({ status: 'success', MyAllocation });


})



app.post('/getBorrowerById', async (req, res) => {

    const { Borrower_id } = req.body.data;


    let B = await client.query("select * from borrower  where id =($1)", [Borrower_id]);


    let Borrower_data = B.rows;
    res.status(200).json({ status: 'success', Borrower_data });


})

app.post('/updateStatus', async (req, res) => {

    const { Borrower_id, status, special_note } = req.body.data;

    console.log(status)
    console.log(special_note)
    try {
        await client.query("update allocation set category=2 where borrower_id = " + Borrower_id);
        await client.query("update borrower set status='" + status + "' , special_note='" + special_note + "'where id =" + Borrower_id);
    } catch (err) {
        console.log(err)
    }
    // let Borrower_data = B.rows;
    res.status(200).json({ status: 'success' });


})

app.post('/deleteFieldStaff', async (req, res) => {
    const id = req.body.id//await getId();
    pool.query('DELETE FROM field_staff WHERE id=$1;', [id], (err, res) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(res)
            // res.send()
        }
    })
})


app.post('/insertFieldStaffRecords', async (req, res) => {
    const employee = req.body.employee
    const id = 501//await getId();
    pool.query('INSERT INTO field_staff VALUES($1,$2,$3,$4,$5,$6,$7,$8);', [id, employee.name, employee.username, employee.password, employee.contact_no, employee.alternate_contact_no, employee.email, employee.address], (err, res) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(res)
            // res.send()
        }
    })
})


app.get('/getAllFieldStaffRecords', (req, res) => {
    // console.log("Inside get")
    pool.query('SELECT * FROM field_staff;', (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json({ data: result.rows })
        }
    })
})



app.listen(3001, () => {
    console.log("Server started running!")
});

