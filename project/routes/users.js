const express = require('express');
const {query} = require('../models/dbConnect.js');
const argon2 = require('argon2');
const authUsers = require('../middleware/authUsers');
const authManagers = require('../middleware/authManagers');

const router = express.Router();

/* GET users listing. */
router.get('/', authManagers, async (req, res) => {
    const sqlResult = await query("SELECT * FROM Users");
    console.log(sqlResult);
    res.json(sqlResult);
});

router.get('/profile',  authUsers, async (req,res)=>{
    try{
        const {userId} = req.session.user;
        if(userId){
            // get user data from database
            const user = await query(`
                SELECT username, email, identity, available, phone
                FROM Users
                WHERE _id = ${userId}
            `);


            //get user's preferences
            const preferences = await query(`SELECT * FROM Preferences WHERE user_id = ${userId}`);

            console.log(preferences);

            user[0].preferences = preferences;

            res.render('profile.ejs', { user: user[0] });
        }
        else {
            res.status(400).send("No such user!");
        }

    }
    catch(err){
        console.log(err);
        res.status(500).send("Some unexpected errors from server!");
    }

});


// add new preferences
router.post('/profile/preferences', authUsers, async (req, res) => {
    try{
        const {userId} = req.session.user;
        const {preference} = req.body;
        if(userId){
            // get user data from database
            const invoice = await query(
                `INSERT INTO Preferences ( name, user_id) VALUES(?,?)`,
                [preference, userId]
                );

            res.json(invoice);
        }
        else {
            res.status(400).json({
                message : "No such user!"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : "Some unexpected errors from server!"
        });
    }
});

router.get('/profile/preferences/:preId', authUsers, async (req, res) => {
   try{
        const {preId} = req.params;

        console.log("\ndisplay-------", preId);
        const preferences = await query(`select * from Preferences where _id = ${preId}`);
        console.log(preferences, "\n");
        if(preferences.length == 0) res.status(400).json({ message : "No such preference!" });
        else res.json(preferences[0]);

   }
   catch(err){
       console.log(err);
        res.status(500).json({
            message : "Some unexpected errors from server!"
        });
   }
});


// delete the preference
router.post('/profile/preferences/:preId', authUsers, async(req, res) => {
    try{
        const {preId} = req.params;


        const invoice = await query(`delete from Preferences where _id = ${preId}`);

        res.json(invoice);

   }
   catch(err){
       console.log(err);
        res.status(500).json({
            message : "Some unexpected errors from server!"
        });
   }
})

//update availability
router.post('/profile', authUsers, async (req, res) => {
    try{
        const {userId} = req.session.user;
        const {newValue} = req.body;
        const {column} = req.query;

        console.log(column);
        console.log(newValue);
        if(column){

            // check repeated users
            if(column == "username" || column == "email"){
                // const users = await query(`select * from Users where _id = ${userId}`);
                // if(usrs[0].isThirdParty){

                // }
                const repeated = await query(`select * from Users where ${column} = '${newValue}'`);
                if(repeated.length > 0){
                    return res.status(400).json({
                        message : "Repeated updation or existing user info(possibly from third party)"
                    });
                }
            }
            if(typeof newValue === 'string'){
                await query(`UPDATE Users SET ${column} = '${newValue}' WHERE _id = ${userId}`);
            }

            else {
                await query(`UPDATE Users SET ${column} = ${newValue} WHERE _id = ${userId}`);
            }
            res.json({
                message: "updated availability!"
            })
        }
        else{
            res.status(400).json({
                message : "no query found!"
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : "Some unexpected errors from server!"
        });
    }
});



module.exports = router;
