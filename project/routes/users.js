const express = require('express');
const {query} = require('../models/dbConnect.js');

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

router.post('/signup', (req, res) => {
    console.log(req.body);
    res.send({
        mess : "ok"
    });
})
router.post('/login', (req, res) => {
    console.log(req.body);
})

module.exports = router;
