const express = require('express');
const {query} = require('../models/dbConnect.js');
const authUsers = require('../middleware/authUsers');
const authManagers = require('../middleware/authManagers');
const router = express.Router();

/* GET users listing. */
router.get('/', authUsers, async (req, res) => {
    console.log("\nGET request to /groups");
    try{
        const groups = await query(`select * from Groups`);

        console.log('Groups length', groups.length);
        console.log(groups);
        console.log("\n");
        if(groups){


            // For each group, assign tasks and relevant values to this group
            for(group of groups){

                //assign values
                group.assignees = [];
                group.readyToAdd = [];
                group.avaUsers = [];
                group.unavaUsers = [];


                // Get all tasks belonged to this group from DB
                const tasks = await query(`SELECT * FROM Tasks WHERE group_id = ${group._id}`);
                group.tasks = tasks;

                // find group-belonged users
                const assignees = await query(`
                    SELECT Users.username, Users._id FROM Users
                    INNER JOIN Users_Groups ON Users._id = Users_Groups.user_id
                    INNER JOIN Groups ON Users_Groups.group_id = Groups._id
                    WHERE Groups._id = ${group._id}
                `);

                //find preferences for each assignee
                for(assignee of assignees){
                    const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${assignee._id}`);
                    assignee.preferences = preferences;
                }

                group.assignees = assignees;

                const unassinUsers = await query(`
                    select Users._id, Users.username, Users.available from Users
                    where Users._id not in (
                        SELECT Users._id FROM Users
                        INNER JOIN Users_Groups  ON Users._id = Users_Groups.user_id
                        INNER JOIN Groups ON Users_Groups.group_id = Groups._id
                        WHERE Groups._id = ${group._id}
                    )
                `);


                //find preferences for each unassignedUser
                for(unassinUser of unassinUsers){
                    const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${unassinUser._id}`);
                    unassinUser.preferences = preferences;

                    if(unassinUser.available){
                        group.avaUsers.push(unassinUser);
                    }
                    else {
                        group.unavaUsers.push(unassinUser);
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
        res.status(500).json({
            message : err
        });
    }
});


router.get('/individual', authUsers, async(req, res) => {
    console.log("GET REQUEST TO /groups/individual");
    try {
        const {userId} = req.session.user;
        const qry = `
            SELECT Groups._id, Groups.name, Groups.description, Groups.start, Groups.due FROM Groups
            INNER JOIN Users_Groups ON Groups._id = Users_Groups.group_id
            INNER JOIN Users on Users._id = Users_Groups.user_id
            WHERE Users._id = ${userId}
        `;

        //get groups that are assigned to this user with this userId
        const groups = await query(qry);

        for(group of groups){
            // Get all tasks belonged to this group from DB
            const tasks = await query(`SELECT * FROM Tasks WHERE group_id = ${group._id}`);

            group.tasks = tasks;
            // find group belonged users
            const assignees = await query(`
                SELECT Users.username, Users._id FROM Users
                INNER JOIN Users_Groups ON Users._id = Users_Groups.user_id
                INNER JOIN Groups ON Users_Groups.group_id = Groups._id
                WHERE Groups._id = ${group._id}
            `);



            //assign values
            group.assignees = assignees;
        }

        res.json(groups);

    }
    catch(err){
        console.log("something went wrong!");
        console.error(err);
        res.status(500).json({
            message : err
        });
    }
});
router.get('/:groupId', authUsers, async (req,res) => {
    console.log("\nGET request to /groups/", req.params.groupId);

    try{
        const qryRes = await query(`select * from Groups WHERE _id = ${req.params.groupId}`);

        if(qryRes){

            //get group tasks
            const group = qryRes[0];
            const tasks = await query(`SELECT * FROM Tasks WHERE group_id = ${group._id}`);
            group.tasks = tasks;

            group.avaUsers = [];
            group.unavaUsers = [];

             // find group belonged users
            const assignees = await query(`
                SELECT Users.username, Users._id FROM Users
                INNER JOIN Users_Groups ON Users._id = Users_Groups.user_id
                INNER JOIN Groups ON Users_Groups.group_id = Groups._id
                WHERE Groups._id = ${group._id}
            `);

            //find preferences for each assignee
            for(assignee of assignees){
                const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${assignee._id}`);
                assignee.preferences = preferences;
            }

            group.assignees = assignees;

            const unassinUsers = await query(`
                select Users._id, Users.username, Users.available from Users
                where Users._id not in (
                    SELECT Users._id FROM Users
                    INNER JOIN Users_Groups  ON Users._id = Users_Groups.user_id
                    INNER JOIN Groups ON Users_Groups.group_id = Groups._id
                    WHERE Groups._id = ${group._id}
                )
            `);


            //find preferences for each unassignedUser
            for(unassinUser of unassinUsers){
                const preferences = await query(`SELECT name FROM Preferences WHERE user_id = ${unassinUser._id}`);
                unassinUser.preferences = preferences;

                if(unassinUser.available){
                    group.avaUsers.push(unassinUser);
                }
                else {
                    group.unavaUsers.push(unassinUser);
                }
            }


            group.readyToAdd = [];

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

router.post('/create', authUsers, async (req,res) => {
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
});

//delete group with groupId
router.delete('/:groupId', authUsers, authManagers, async (req, res) => {
    try{
        //get group id
        const {groupId} = req.params;

        //1 Delete all tasks that are in this group
        await query(`DELETE FROM Tasks WHERE group_id = ${groupId}`);

        //2 Delete the group with group id
        await query(`DELETE FROM Groups WHERE _id = ${groupId}`);

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

//add users to the group
router.post('/:groupId/addUser', authUsers, async (req, res) => {
    try {
        const {usersId} = req.body;
        const groupId = req.params.groupId;

        //console.log(usersId, taskId);
        for(usrId of usersId) {
            const repeated = await query(`SELECT * FROM Users_Groups WHERE Users_Groups.user_id = ${usrId} AND Users_Groups.group_id = ${groupId}`);
            if(repeated.length > 0){
                console.log("repeated adding!!!");
            }
            else{
                console.log(await query(`INSERT INTO Users_Groups (user_id, group_id) VALUES (${usrId}, ${groupId})`));
            }
        }

        res.json({mess : "done!"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
});


//update description
router.post('/:groupId/description', authUsers, authManagers, async(req, res) => {
    try{
        const {groupId} = req.params;
        const {description} = req.body;
        if(description !== null){
            await query(`
                UPDATE Groups
                SET description = '${description}'
                WHERE _id = ${groupId}
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
