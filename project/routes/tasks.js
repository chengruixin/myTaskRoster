const express = require('express');
const {query} = require('../models/dbConnect.js');
const authUsers = require('../middleware/authUsers');
const authManagers = require('../middleware/authManagers');
const router = express.Router();

/* GET users listing. */

//this route currently only get tasks that are not in group
router.get('/', authUsers, async (req, res) => {
    try{

        const tasks = await query(`select * from Tasks where group_id is null`);
        console.log(tasks);

        for( task of tasks){

            task.avaUsers = [];
            task.unavaUsers = [];

            const assignees = await query(`
                SELECT Users.username, Users._id FROM Users
                INNER JOIN Users_Tasks ON Users._id = Users_Tasks.user_id
                INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id
                WHERE Tasks._id = ${task._id}
            `);

            //find preferences for each assignee
            for(assignee of assignees){
                const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${assignee._id}`);
                assignee.preferences = preferences;
            }
            task.assignees = assignees;

            // console.log(assignees, task._id);

            const unassinUsers = await query(`
                select Users._id, Users.username, Users.available from Users
                where Users._id not in (
                    SELECT Users._id FROM Users
                    INNER JOIN Users_Tasks  ON Users._id = Users_Tasks.user_id
                    INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id
                    WHERE Tasks._id = ${task._id}
                )
            `);

            //find preferences for each unassignedUser
            for(unassinUser of unassinUsers){
                const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${unassinUser._id}`);
                unassinUser.preferences = preferences;

                if(unassinUser.available){
                    task.avaUsers.push(unassinUser);
                }
                else {
                    task.unavaUsers.push(unassinUser);
                }
            }

            task.readyToAdd = [];
        }

        res.json(tasks);
    }

    catch(err){
        console.log(err);
        res.status(500).json({
            message : err
        });
    }

});

// get individual tasks
router.get('/individual', authUsers, async(req, res) => {
    try{
        // userId : users[0]._id,
        const {userId} = req.session.user;

        const qry = `select
                    Tasks._id, Tasks.group_id, Tasks.name, Tasks.description, Tasks.start, Tasks.due, Tasks.complete, Tasks.isCompleted
                    from Tasks
                    INNER JOIN Users_Tasks ON Tasks._id = Users_Tasks.task_id
                    inner join Users on Users._id = Users_Tasks.user_id
                    where Tasks.group_id is null AND Users._id = ${userId};`


        //only get tasks that are assigned to the user with userId

        const tasks = await query(qry);

        for(task of tasks){
            const assignees = await query(`SELECT Users.username, Users._id FROM Users \
                                        INNER JOIN Users_Tasks \
                                        ON Users._id = Users_Tasks.user_id \
                                        INNER JOIN Tasks \
                                        ON Users_Tasks.task_id = Tasks._id \
                                        WHERE Tasks._id = ${task._id}`);
            console.log(assignees, task._id);

            task.assignees = assignees;

        }

        res.json(tasks);
    }

    catch(err){
        console.log(err);
        res.status(400).json({
            message : err
        })
    }

})
router.post('/create', authUsers, async (req,res) => {
    try{
        console.log("\nPOST request to /tasks/create");
        let obj = req.body;
        console.log(obj);
        const sql = "insert into Tasks (name, description, start, due, group_id) values (?,?,?,?,?)"
        const result = await query(sql, [obj.name, obj.description, obj.start, obj.due, obj.group_id]);
        console.log(result);
        res.send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/:taskId', authUsers, async (req, res)=> {
    try{
        const task = await query(`select * from Tasks WHERE _id = ${req.params.taskId}`);

        console.log(task[0]);
        if(task.length > 0) {

            const {scope} = req.query;

            //if the task belonged to a group, then only fetch the task
            if(task[0].group_id != null){
                res.json(task[0]);
            }


            //if it does not belong to a group, then fetch assignees within the task
            else if(scope === 'watch' || req.session.user.identity == 'normal'){
                task[0].assignees = await query(`
                    SELECT Users.username, Users._id FROM Users
                    INNER JOIN Users_Tasks ON Users._id = Users_Tasks.user_id
                    INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id
                    WHERE Tasks._id = ${task[0]._id}
                `);

                res.json(task[0]);
            }

            // fetch all data if the request is from Managers
            else if(req.session.user.identity === 'manager') {

                task[0].avaUsers = [];
                task[0].unavaUsers = [];
                task[0].readyToAdd = [];

                const assignees = await query(`
                    SELECT Users.username, Users._id FROM Users
                    INNER JOIN Users_Tasks ON Users._id = Users_Tasks.user_id
                    INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id
                    WHERE Tasks._id = ${task[0]._id}
                `);

                //find preferences for each assignee
                for(assignee of assignees){
                    const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${assignee._id}`);
                    assignee.preferences = preferences;
                }
                task[0].assignees = assignees;



                const unassinUsers = await query(`
                    SELECT Users._id, Users.username, Users.available from Users
                    where Users._id not in (
                        SELECT Users._id FROM Users
                        INNER JOIN Users_Tasks  ON Users._id = Users_Tasks.user_id
                        INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id
                        WHERE Tasks._id = ${task[0]._id}
                    )`);

                //find preferences for each unassignedUser
                for(unassinUser of unassinUsers){
                    const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${unassinUser._id}`);
                    unassinUser.preferences = preferences;

                    if(unassinUser.available){
                        task[0].avaUsers.push(unassinUser);
                    }
                    else {
                        task[0].unavaUsers.push(unassinUser);
                    }
                }

                res.json(task[0]);
            }

            else {
                res.status(400).send("params or query is not correct");
            }

        }
        else {
            res.status(400).send('Task not found');
        }
    }

    catch(err){
        console.log(err);
        res.sendStatus(500);
    }


});

//delete task with taskId
router.delete('/:taskId', authUsers, authManagers, async (req, res) => {
    try{
        //delete the task
        const {taskId} = req.params;
        await query(`DELETE FROM Tasks WHERE _id = ${taskId}`);

        res.json({
            message : "deleted successfully!"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : err
        });
    }
});


router.post('/:taskId/addUser',authUsers, async (req, res) => {
    try {
        const {usersId} = req.body;
        const taskId = req.params.taskId;

        //console.log(usersId, taskId);
        for(usrId of usersId) {
            const repeated = await query(`SELECT * FROM Users_Tasks WHERE Users_Tasks.user_id = ${usrId} AND Users_Tasks.task_id = ${taskId}`);
            if(repeated.length > 0){
                console.log("repeated adding!!!");
            }
            else{
                console.log(await query(`INSERT INTO Users_Tasks (user_id, task_id) VALUES (${usrId}, ${taskId})`));
            }

        }

        res.json({mess : "done!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        });
    }

});

router.post('/:taskId/completion', authUsers, async (req, res) => {
    try{
        console.log("\nPOST request to update task completion attribute");
        console.log(req.body, '\n');
        const {taskId} = req.params;
        const { complete, isCompleted } = req.body;
        await query(`
            UPDATE Tasks
            SET complete = ?, isCompleted = ?
            WHERE _id = ${taskId}
        `,[ new Date(complete), isCompleted ]);

        res.status(200).json({
            message: "updated successfully!"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message : err
        });
    }
});

router.post('/:taskId/description', authUsers, authManagers, async (req, res) => {
    try{
        const {taskId} = req.params;
        const {description} = req.body;
        if(description !== null){
            await query(`
                UPDATE Tasks
                SET description = '${description}'
                WHERE _id = ${taskId}
            `);

            res.json({
                message: "update successfully!"
            });
        }

        else {
            res.status(400).json({
                message: "description cannot be null"
            })
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
})
module.exports = router;
