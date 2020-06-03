const express = require('express');
const router = express.Router();
const {query} = require('../models/dbConnect.js');
//schemas
var people = ["mke", "jor", "fxdj", "unmon", "dfz", "fdcw", "fadex", "ofdww"];
var tasks = [{
    name : "a task name",
    description: "abcablhblahblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [0,3,5],
    isInGroup : 0
},{
    name : "another task name",
    description: "hblahblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [1,2,4],
    isInGroup: null
},{
    name : "third task",
    description: "hbasdfasdfasdlahblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [1,2,5],
    isInGroup: null
},{
    name : "a antoerhere name",
    description: "abcablhblafasdfashblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [7],
    isInGroup : 0
}];

var groups = [{
    name : "a group name",
    tasks : [0,3],
    description : "a group description",
    start_date : new Date().toLocaleDateString(),
    due_date: new Date().toLocaleDateString(),
    people : null
}]
/* GET home page. */
router.get('/', (req, res) => {
    res.render('index.ejs');
});


router.get('/myTasks', (req,res)=>{
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
