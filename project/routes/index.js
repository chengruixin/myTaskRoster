const express = require('express');
const router = express.Router();
const {query} = require('../models/dbConnect.js');
const authUsers = require('../middleware/authUsers');
const authManagers = require('../middleware/authManagers');
const {compareTimeInDate} = require('../helper/dateCompare');

//schemas

/* GET home page. */
router.get('/', async (req, res)=>{
    const {user} = req.session;
    if(!user){
        //get all tasks that need to be done today
        const today = new Date();
        console.log(today);

        const tasks = await query(`SELECT * FROM Tasks where isCompleted = false`);
        console.log(tasks);

        const todayTasks = [];
        const overdueTasks = [];
        for(task of tasks){
            //get related users for each tasks
            //ungrouped tasks
            if(task.group_id === null) {
                const assignees = await query(`
                    SELECT Users.username, Users._id FROM Users
                    INNER JOIN Users_Tasks ON Users._id = Users_Tasks.user_id
                    INNER JOIN Tasks ON Users_Tasks.task_id = Tasks._id
                    WHERE Tasks._id = ${task._id}
                `);

                task.assignees = assignees;
            }
            else {
                const assignees = await query(`
                    SELECT Users.username, Users._id FROM Users
                    INNER JOIN Users_Groups ON Users._id = Users_Groups.user_id
                    INNER JOIN Groups ON Users_Groups.group_id = Groups._id
                    WHERE Groups._id = ${task.group_id}
                `);

                task.assignees = assignees;
            }
            console.log(compareTimeInDate(task.due, today));
            // start <= today <= due
            if( compareTimeInDate(today, task.start) !== -1 && compareTimeInDate(task.due,today) !== -1 ){
                todayTasks.push(task);
            }

            else if( compareTimeInDate(today, task.due) === 1){
                overdueTasks.push(task);
            }
        }

        console.log({ todayTasks: todayTasks});
        console.log({overdue: overdueTasks});


        //get related users for each task;
        res.render('index.ejs',{todayTasks: todayTasks, overdueTasks: overdueTasks});
    }
    else{
        if(user.identity === 'manager'){
            res.redirect('/manageTasks');
        }
        else if(user.identity === 'normal') {
            res.redirect('/myTasks');
        }

        else {
            res.status(400).send("Unknown Identity");
        }

    }
});


router.get('/myTasks', authUsers, (req,res)=>{
    res.render('myTasks.ejs');
});

router.get('/manageTasks',  authUsers, authManagers, (req,res)=>{
    res.render('manageTasks.ejs');
});





router.get('/email',  authUsers, (req,res)=>{
    res.render('email.ejs');
});

module.exports = router;
