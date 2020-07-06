const express = require('express');
const argon2 = require('argon2');
const {OAuth2Client} = require('google-auth-library');
const {query} = require('../models/dbConnect.js');

const CLIENT_ID = "648640230327-7lvnmudv7f718m32rl8ejvu7k65l2mlu.apps.googleusercontent.com";

const router = express.Router();
const client = new OAuth2Client(CLIENT_ID);

router.post('/google/verify', async (req, res) => {
    console.log("post request to /auth/google/verify...");
    console.log(req.body.token);
    try{
        const ticket = await client.verifyIdToken({
            idToken : req.body.token,
            audience : CLIENT_ID
        });

        const payload = ticket.getPayload();
        const {email_verified, email, name} = payload;

        if(email_verified){
            console.log(payload);
            const users = await query(`SELECT * FROM Users WHERE email = '${email}' AND isThirdParty = true`);

            if(users.length === 0){
                req.session.verification = {
                    email
                };
            }
            else {
                req.session.user = {
                    userId : users[0]._id,
                    username : users[0].username,
                    identity : users[0].identity
                }
            }


            res.json({
                name,
                email,
                email_verified
            });
        }
        else {
            res.status(403).json({
                error: "Access forbidden",
                message: "Google verification failed!"
            })
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : "Failed in google verification",
            err: err
        })
    }

});

router.get('/profile/new', (req,res) => {
    console.log(req.session);
    res.render('create-profile.ejs');
})

router.post('/profile/new', async (req, res)=> {

    try{
        const {verification} = req.session;
        if(!verification){
            res.status(403).json({
                message : "please have a google-authorised token ID first before you register with third party account"
            });

        }
        else {
            const users = await query(`SELECT * FROM Users WHERE username='${req.body.username}'`);
            if(users.length > 0){
                res.status(400).json({
                    message: "Repeated username, try again"
                });
            }
            else {

                const savedRes = await query(`INSERT INTO Users (username, email, identity,isThirdParty) VALUES ('${req.body.username}','${req.session.verification.email}', '${req.body.identity}',true)`);

                req.session.verification = null;
                req.session.user = {
                    username : req.body.username,
                    userId : savedRes.insertId,
                    identity: req.body.identity
                }


                res.json({
                    invoice : savedRes,
                    message : "signup successfully!"
                })

            }
        }
    }

    catch(err){
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
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
        userId : user.userId,
        identity : user.identity
    })
})
router.get('/signup', (req, res) => {
    res.render('signup.ejs');
})


router.get('/login', (req, res) => {
    res.render('login.ejs');
})

router.post('/signup', async (req, res) => {
    try{
        console.log(req.body);
        const repeatUsers = await query(`SELECT * FROM Users where (email = '${req.body.email}' or username = '${req.body.username}') AND isThirdParty = false`);
        if(repeatUsers.length > 0){
            res.status(400).json({
                message: "Repeated username or email"
            });
        }
        else {
            const {username, email, password, identity} = req.body;
            const hashed = await argon2.hash(password);
            console.log(username, email, hashed, password);
            const savedRes = await query(`INSERT INTO Users (username, email, password, lookup, identity, isThirdParty) VALUES (?,?,?,?,?,?)`, [username, email, hashed, password, identity, false]);

            console.log(savedRes);

            //assign session token
            req.session.user = {
                username : username,
                userId : savedRes.insertId,
                identity : identity
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
        const users = await query(`SELECT * FROM Users WHERE username = '${req.body.username}' AND isThirdParty = false`);
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

            //assign session token
            req.session.user = {
                userId : users[0]._id,
                username : users[0].username,
                identity : users[0].identity

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

        // else res.redirect("/");
        else res.json({
            message:"success"
        });
    })
});

module.exports = router;