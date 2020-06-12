const express = require('express');
const {query} = require('../models/dbConnect.js');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    const sqlResult = await query("SELECT * FROM Users"); 
    console.log(sqlResult);
    res.json(sqlResult);
});


module.exports = router;
