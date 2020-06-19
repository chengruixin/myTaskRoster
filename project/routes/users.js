const express = require('express');
const {query} = require('../models/dbConnect.js');
const argon2 = require('argon2');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    const sqlResult = await query("SELECT * FROM Users"); 
    console.log(sqlResult);
    res.json(sqlResult);
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
})

router.post('/signup', async (req, res) => {
    try{
        console.log(req.body);
        const repeatUsers = await query(`SELECT * FROM Users where email = '${req.body.email}' or username = '${req.body.username}'`);
        if(repeatUsers.length > 0){
            res.status(400).json({
                message: "Repeated username or email"
            });
        }
        else {
            const {username,email,password} = req.body;
            const hashed = await argon2.hash(password);
            console.log(username, email, hashed, password);
            const savedRes = await query(`INSERT INTO Users (username, email, password, lookup) VALUES (?,?,?,?)`, [username,email,hashed, password]);
            
            //assign session token
            req.session.user = {
                username : username
            }
            
            req.session.save();
            res.json({
                message: "signup successfully!",
                invoice : savedRes
            });
        }
        
    }
    catch (err){
        console.log(err);
        res.status(500).json({
            message : err
        })
    }
})
router.post('/login', async (req, res) => {
    try{
        console.log(req.body);
        const users = await query(`SELECT * FROM Users WHERE username = '${req.body.username}'`);
        console.log(users);
        if(users.length === 0) 
            res.status(400).json({
                message: "User does not exist"
            });

        else if (!await argon2.verify(users[0].password, req.body.password)) 
            res.status(400).json({
                message: "Incorrect password"
            });

        else{
            req.session.user = {
                userId : users[0]._id
            }
            console.log(req.session);
            
            res.json({
                message : "Login Successfully"
            })
        }
           
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : err
        });
    }
})

module.exports = router;
