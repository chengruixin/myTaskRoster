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
    
        console.log(payload);
        res.json(payload);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : "Failed in google verification",
            err: err
        })
    }
    
});


module.exports = router;