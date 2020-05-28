var express = require('express');
var router = express.Router();

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

module.exports = router;
