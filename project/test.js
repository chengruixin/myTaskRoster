const mysql = require('mysql');
const con = mysql.createConnection({
    host : 'localhost',

    //optional for local dev
    user : 'root',
    password : 'password',

});

con.connect( err => {
    if(err) console.log(err);
    else console.log("connected");
});