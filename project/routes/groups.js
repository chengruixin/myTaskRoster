const express = require('express');
const {query} = require('../models/dbConnect.js');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
    console.log("\nGET request to /groups");
    try{
        const groups = await query(`select * from Groups`);

        console.log('Groups length', groups.length);
        console.log(groups);
        console.log("\n");
        if(groups){

            
            // For each group, assign tasks and relevant values to this group
            for(group of groups){
                // Get all tasks belonged to this group from DB
                const tasks = await query(`SELECT * FROM Tasks WHERE group_id = ${group._id}`);

                if(tasks){
                    group.tasks = tasks;

                    // Fetch assignee and avaUsers for each task
                    for(task of tasks){
                        
                        const assignees = await query(`SELECT Users.username, Users._id FROM Users \
                                                        INNER JOIN Users_Tasks \   
                                                        ON Users._id = Users_Tasks.user_id \
                                                        INNER JOIN Tasks \
                                                        ON Users_Tasks.task_id = Tasks._id \
                                                        WHERE Tasks._id = ${task._id}`);
                        

                        const avaUsers = await query(`select Users._id, Users.username from Users \
                                                        where Users._id not in (\
                                                        SELECT Users._id FROM Users \
                                                        INNER JOIN Users_Tasks  ON Users._id = Users_Tasks.user_id  \
                                                        INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id \
                                                        WHERE Tasks._id = ${task._id} )`); 

                        //assign values
                        task.assignees = assignees;
                        task.avaUsers = avaUsers;
                        task.readyToAdd = [];
                    }
                
                }
            }

            console.log(groups);
            res.json(groups); 
        }
        else{
            res.status(400).send("no result found!");
        }
        
    }

    catch(err){
        console.log("something went wrong!");
        console.error(err);
        res.sendStatus(500);
    }
});

router.get('/:groupId', async (req,res) => {
    console.log("\nGET request to /groups/", req.params.groupId);

    try{
        const qryRes = await query(`select * from Groups WHERE _id = ${req.params.groupId}`);
        
        if(qryRes){
            const group = qryRes[0];
            
            const tasks = await query(`SELECT * FROM Tasks WHERE group_id = ${group._id}`);

            group.tasks = tasks;

                // Fetch assignee and avaUsers for each task
            for(task of tasks){
                
                const assignees = await query(`SELECT Users.username, Users._id FROM Users \
                                                INNER JOIN Users_Tasks \   
                                                ON Users._id = Users_Tasks.user_id \
                                                INNER JOIN Tasks \
                                                ON Users_Tasks.task_id = Tasks._id \
                                                WHERE Tasks._id = ${task._id}`);
                

                const avaUsers = await query(`select Users._id, Users.username from Users \
                                                where Users._id not in (\
                                                SELECT Users._id FROM Users \
                                                INNER JOIN Users_Tasks  ON Users._id = Users_Tasks.user_id  \
                                                INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id \
                                                WHERE Tasks._id = ${task._id} )`); 

                //assign values
                task.assignees = assignees;
                task.avaUsers = avaUsers;
                task.readyToAdd = [];

            }

            res.json(group);
        }
        else{
            res.status(400).send("no result found!");
        }
    }

    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.post('/create', async (req,res) => {
    console.log("\nPOST request to /groups/create");

    try{
        console.log(req.body);
        const obj = req.body;
        const sql = "insert into Groups (name, description, start, due) values (?,?,?,?)"
        const result = await query(sql, [obj.name, obj.description, obj.start, obj.due]);
        res.send(result);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;
