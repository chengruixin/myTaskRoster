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

router.get('/checkStatus', async(req, res)=> {
    const {user} = req.session;
    if(!user){
        res.json({
            isLoggedIn : false,       
        });
    }
    else res.json({
        isLoggedIn : true,
        username : user.username,
        userId : user.userId
    })
})
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
            
            console.log(savedRes);
            //assign session token
            req.session.user = {
                username : username,
                userId : savedRes.insertId
            }
            
        
            res.json({
                message: "signup successfully!",
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
                userId : users[0]._id,
                username : users[0].username
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


router.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(err) res.status(500).redirect("/?error=status500");
        
        else res.redirect("/");
    })
})
module.exports = router;
