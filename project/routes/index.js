const express = require('express');
const router = express.Router();
const {query} = require('../models/dbConnect.js');
const authUsers = require('../middleware/authUsers');
//schemas

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index.ejs');
});


router.get('/myTasks', authUsers, (req,res)=>{
    res.render('myTasks.ejs');
});

router.get('/manageTasks', (req,res)=>{
    res.render('manageTasks.ejs');
});



router.get('/profile', (req,res)=>{
    res.render('profile.ejs');
});

router.get('/email', (req,res)=>{
    res.render('email.ejs');
});

module.exports = router;
