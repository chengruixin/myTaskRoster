const express = require('express');
const {query} = require('../models/dbConnect.js');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    const results = await query("select * from Tasks");
    console.log(results);

    for( result of results){
        const assignees = await query(`SELECT Users.username, Users._id FROM Users \
                                        INNER JOIN Users_Tasks \   
                                        ON Users._id = Users_Tasks.user_id \
                                        INNER JOIN Tasks \
                                        ON Users_Tasks.task_id = Tasks._id \
                                        WHERE Tasks._id = ${result._id}`);
        console.log(assignees, result._id);

        result.avaUsers = await query(`select Users._id, Users.username from Users \
                                        where Users._id not in (\
                                              SELECT Users._id FROM Users \
                                              INNER JOIN Users_Tasks  ON Users._id = Users_Tasks.user_id  \
                                              INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id \
                                              WHERE Tasks._id = ${result._id} )`); 
        result.assignees = assignees;
        result.readyToAdd = [];
    }

    res.json(results);
});

router.post('/create', async (req,res) => {
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
});

router.get('/:taskId', async (req, res)=> {
    try{
        const task = await query(`select * from Tasks WHERE _id = ${req.params.taskId}`);
        
        console.log(task[0]);
        if(task) {
            task[0].assignees = await query(`SELECT Users.username, Users._id FROM Users \
                                            INNER JOIN Users_Tasks \   
                                            ON Users._id = Users_Tasks.user_id \
                                            INNER JOIN Tasks \
                                            ON Users_Tasks.task_id = Tasks._id \
                                            WHERE Tasks._id = ${task[0]._id}`);
            
            task[0].avaUsers = await query(`select Users._id, Users.username from Users \
                                                where Users._id not in (\
                                                    SELECT Users._id FROM Users \
                                                    INNER JOIN Users_Tasks  ON Users._id = Users_Tasks.user_id  \
                                                    INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id \
                                                    WHERE Tasks._id = ${task[0]._id} )`); 
            
            task[0].readyToAdd = [];
            
            res.json(task[0]);
        }
    }
    
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
    
    
});
router.post('/:taskId/addUser',async (req, res) => {
    try {
        const {usersId} = req.body;
        const taskId = req.params.taskId;
        
        //console.log(usersId, taskId);
        for(usrId of usersId) {
            console.log(await query(`INSERT INTO Users_Tasks (user_id, task_id) VALUES (${usrId}, ${taskId})`));
        }
        
        res.json({mess : "done!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        });
    }

})
module.exports = router;
