const express = require('express');
const router = express.Router();
const {query} = require('../models/dbConnect.js');


/* GET users listing. */
const dbName = "YouTask_1";
router.get('/', async function(req, res) {
    //console.log(await query("show tables"));
    //res.send("hello");
    
    res.render('test.ejs');
});

router.post('/tasks/create', async function(req,res){
    try{
        let obj = req.body;
        console.log(obj);
        const sql = "insert into Tasks (name, description, start, due) values (?,?,?,?)"
        const result = await query(sql, [obj.name, obj.description, obj.start, obj.due]);
        console.log(result);
        res.send(result);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get('/tasks', async (req,res)=>{
    try{
        const result = await query("select * from Tasks");
        console.log(result);
        res.json(result);
    }
    catch(err){
        res.status(500).send(err);

    }
})
module.exports = router;