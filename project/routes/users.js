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



module.exports = router;
