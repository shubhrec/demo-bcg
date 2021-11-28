const sql = require('mssql')
const express = require('express')
const moment = require('moment');
const bodyParser = require('body-parser');
require('dotenv').config()
// const { default: App } = require('../frontend-react/easy-insurance/src/App');



//SQL SETUP
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST, // You can use 'localhost\\instance' to connect to named instance
    database: 'DEMO_BCG',
    trustServerCertificate: true,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {}

}


const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log(moment().format() + ' : ', 'Connected to MSSQL')
        return pool
    })
    .catch(err => console.log(moment().format() + ' : ', 'Database Connection Failed! Bad Config: ', err))

sql.on('error', err => {
    // ... error handler
    console.log(moment().format() + ' : ', { sqlerror: err })
})



var genericQueryPromise = async function (req, res) {

    const conn = await poolPromise;
    const sqlRequest = new sql.Request(conn)

    //adding query parameters (if any)
    if (res.locals.sqlParametersArray.length != 0) {
        res.locals.sqlParametersArray.forEach(element => {
            // The requests go in this formatrequest.input('input_parameter', sql.Int, value)
            sqlRequest.input(element.paramVar, element.datatype, element.value)
        });
    }

    //Executing the query returns a promise with the data in the recordset property of the returned object
    sqlRequest.query(res.locals.query)
        .then(function (dbData) {

            res.setHeader('Content-Type', 'application/json');
            // res.send(dbData.recordset)
            res.end(JSON.stringify({ recordset: dbData.recordset, message: "Data refresh was successful" }));

            // }

        })
        .catch(function (error) {
            console.dir(moment().format() + ' : ', 'user: ' + res.locals.userName, 'genericQueryPromise' + '  ', res.locals.query);
            console.dir(moment().format() + ' : ', 'user: ' + res.locals.userName, 'genericQueryPromise' + '  ', error);
        });

}




var updatePolicyDetailsDatabase = async function (req, res) {
    const conn = await poolPromise;
    const sqlRequest = new sql.Request(conn)

    sqlRequest.input('POLICY_ID', sql.Int, req.body.POLICY_ID)
    sqlRequest.input('CUSTOMER_ID', sql.Int, req.body.CUSTOMER_ID)
    sqlRequest.input('FUEL', sql.NVarChar, req.body.FUEL)
    sqlRequest.input('VEHICLE_SEGMENT', sql.NVarChar, req.body.VEHICLE_SEGMENT)
    sqlRequest.input('PREMIUM', sql.Int, req.body.PREMIUM)
    sqlRequest.input('BODILY_INJURY_LIABILITY', sql.NVarChar, req.body.BODILY_INJURY_LIABILITY)
    sqlRequest.input('PERSONAL_INJURY_PROTECTION', sql.NVarChar, req.body.PERSONAL_INJURY_PROTECTION)
    sqlRequest.input('PROPERTY_DAMAGE_LIABILITY', sql.NVarChar, req.body.PROPERTY_DAMAGE_LIABILITY)
    sqlRequest.input('COLLISION', sql.NVarChar, req.body.COLLISION)
    sqlRequest.input('COMPREHENSIVE', sql.NVarChar, req.body.COMPREHENSIVE)
    sqlRequest.input('LAST_MODIFIED', sql.DateTime, req.body.LAST_MODIFIED)



    sqlRequest.execute('LIVE.UPDATE_POLICY_DETAILS_IF_UNCHANGED', (err, result) => {
        if (err) {

            res.send({ message: 'There was a problem' })
        }
        else {
            
            res.setHeader('Content-Type', 'application/json');
            if (result.returnValue == '200') {
                
                
                res.end(JSON.stringify({ message: "Policy was successfuly updated" , recordset : result.recordset }));
                // res.send({ message: "Policy was successfuly updated" , recordset : result.recordset[0] })
            }
            else if(result.returnValue == '202'){
                res.send({ message: "The Policy has changed. Please review before updating" , recordset : result.recordset } )
            }

        }

    })
}




//Express API part

var app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


//Gets the Policy Details
app.get('/getpolicydetails', function (req, res, next) {

    res.locals.sqlParametersArray = []
   if('searchable' in req.query){
    res.locals.sqlParametersArray.push(...[{            //template for adding a parameter in the query
        paramVar: 'POLICY_ID',                        //The parameter variable used in the query with @ 
        datatype: sql.Int,                         //The datatype of the parameter
        value: req.query.searchable                    //the value for the parameter (received from the request url)
    },
    {            //template for adding a parameter in the query
        paramVar: 'CUSTOMER_ID',                        //The parameter variable used in the query with @ 
        datatype: sql.Int,                         //The datatype of the parameter
        value: req.query.searchable                    //the value for the parameter (received from the request url)
    }
]);
    res.locals.query = `SELECT * FROM LIVE.POLICY_DETAILS WHERE POLICY_ID = @POLICY_ID OR CUSTOMER_ID = @CUSTOMER_ID order by DATE_OF_PURCHASE DESC `;

   }

   else{
    res.locals.query = `SELECT top 50 * FROM LIVE.POLICY_DETAILS order by DATE_OF_PURCHASE DESC `;
   }
   

    next()
}, genericQueryPromise);

app.get('/monthwisepolicies', function (req, res, next) {
    res.locals.query = `SELECT * FROM LIVE.MONTH_REGIION_WISE_NUMBER_OF_POLICIES order by 2,3 `;
    res.locals.sqlParametersArray = [];
     next()
 }, genericQueryPromise);


 app.get('/monthwisepremium', function (req, res, next) {
    res.locals.query = `SELECT * FROM LIVE.MONTH_REGION_WISE_PREMIUM order by 2,3 `;
    res.locals.sqlParametersArray = [];
     next()
 }, genericQueryPromise);

//Updates the Policy Details
app.post('/updatepolicydetails',function(req,res,next){
    next()
},updatePolicyDetailsDatabase)

app.listen(5000,()=>{
    console.log('server is now running')
})