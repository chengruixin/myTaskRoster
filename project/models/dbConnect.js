const mysql = require('mysql');


const con = mysql.createPool({
    host : 'localhost',
    //optional for local dev
    // user : 'root',
    // password : 'password',

});
const dbName = "YouTask_1";
const createUsersTable = `CREATE TABLE Users(
                            _id INT NOT NULL AUTO_INCREMENT,
                            username VARCHAR(256),
                            email VARCHAR(256),
                            password VARCHAR(256),
                            lookup VARCHAR(256),
                            identity VARCHAR(256),
                            available BOOLEAN,
                            preferences VARCHAR(1024),
                            isThirdParty BOOLEAN,
                            PRIMARY KEY(_id)
                            )`;

const createTasksTable = `CREATE TABLE Tasks(
                            _id INT NOT NULL AUTO_INCREMENT,
                            group_id INT, name varchar(256),
                            description varchar(1024),
                            start date,
                            due date,
                            primary key(_id),
                            FOREIGN KEY(group_id) REFERENCES Groups(_id)
                            )`;
const createGroupsTable = "CREATE TABLE Groups(_id INT NOT NULL AUTO_INCREMENT, name varchar(256), description varchar(1024) , start date, due date, primary key(_id) )"
const createUsers_TasksTable = "CREATE TABLE Users_Tasks (user_id INT, task_id INT, FOREIGN KEY(user_id) REFERENCES Users(_id), FOREIGN KEY (task_id) REFERENCES Tasks(_id) )";

function query(sql, values) {
    return new Promise((resolve, reject) => {
        con.getConnection( function(err, connection){
            if(err){
                reject(err);
            }
            else {
                connection.query(sql, values, (err, rows)=>{
                    connection.release();
                    if(err){
                        reject(err);
                    }
                    else {
                        resolve(rows)
                    }

                })
            }
        })
    })
}

function hasDatabase(arr, value) {
    for(let el of arr){
        if(el.Database == value){
            return true;
        }
    }
    return false;
}

function hasTable(arr, value, dbName){
    for(let el of arr){
        if(el['Tables'+'_in_' + dbName] == value){
            return true;
        }
        //console.log(el['Tables'+'_in_' + dbName]);
    }
    return false;
}

async function dbConnect(){
    try{

        //Create database dbName IF DONT HAVE
        let result = await query("show databases");
        if(!hasDatabase(result, dbName)){
            const result = await query("CREATE DATABASE ??", [dbName]);
            //const result = await query("CREATE DATABASE "+ dbName);
            console.log("create a database", dbName);
        }

        //Use dbName db
        await query("USE ??" , dbName);

        //Create tables Tasks, Users , Tasks_Users and Groups for dbName if DONT HAVE
        const tables = await query("show tables");

        if(!hasTable(tables, "Users", dbName)){
            await query(createUsersTable);
            console.log("Create Users table");
        }

        if(!hasTable(tables, "Groups", dbName)){
            await query(createGroupsTable);
            console.log("Create Groups table");

        }

        if(!hasTable(tables, "Tasks", dbName)){
            await query(createTasksTable);
            console.log("Create Tasks table");

        }


        if(!hasTable(tables, "Users_Tasks", dbName)){
            await query(createUsers_TasksTable);
            console.log("Create Users_Tasks table");
        }

        console.log("Connected to " + dbName);
    }
    catch(err){
        throw err;
    }
}

module.exports = {
    query,
    dbConnect
}


