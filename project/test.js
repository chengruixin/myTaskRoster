const mysql = require('mysql');
const con = mysql.createConnection({
    host : 'localhost'
});

con.connect( err => {
    if(err) console.log(err);
    else console.log("connected");
})