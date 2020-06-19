const express = require('express');
const router = express.Router();
const {query} = require('../models/dbConnect.js');
const authUsers = require('../middleware/authUsers');
//schemas

/* GET home page. */
router.get('/', (req, res) => {
    const {user} = req.session;
    if(!user){
        res.render('index.ejs');
    }
    else{
        res.redirect('/myTasks');
    }
});


router.get('/myTasks', authUsers, (req,res)=>{
    res.render('myTasks.ejs');
});

router.get('/manageTasks',  authUsers, (req,res)=>{
    res.render('manageTasks.ejs');
});



router.get('/profile',  authUsers,(req,res)=>{
    res.render('profile.ejs');
});

router.get('/email',  authUsers, (req,res)=>{
    res.render('email.ejs');
});

module.exports = router;
