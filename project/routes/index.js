var express = require('express');
var router = express.Router();

//schemas
var people = ["mke", "jor", "fxdj", "unmon", "dfz", "fdcw", "fadex", "ofdww"];
var tasks = [{
    name : "a task name",
    description: "abcablhblahblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [0,3,5],
    isInGroup : 0
},{
    name : "another task name",
    description: "hblahblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [1,2,4],
    isInGroup: null
},{
    name : "third task",
    description: "hbasdfasdfasdlahblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [1,2,5],
    isInGroup: null
},{
    name : "a antoerhere name",
    description: "abcablhblafasdfashblah",
    start_date : new Date().toLocaleDateString(),
    due_date : new Date().toLocaleDateString(),
    people: [7],
    isInGroup : 0
}];

var groups = [{
    name : "a group name",
    tasks : [0,3],
    description : "a group description",
    start_date : new Date().toLocaleDateString(),
    due_date: new Date().toLocaleDateString(),
    people : null
}]
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

router.get('/tasks', (req,res) =>{
    let resObj = [];

    tasks.forEach(task => {
      if(task.isInGroup == null) {
        let tempObj = {
          name : task.name,
          description : task.description,
          start_date : task.start_date,
          due_date : task.due_date,
          people : []
        }

        task.people.forEach( person =>{
          tempObj.people.push(people[person]);
        })


        resObj.push(tempObj);
      };
    });


    res.json(resObj);
});

router.get('/groups', (req,res)=>{
    let resObj = [];

    groups.forEach( group => {
        console.log(group);
        let tempObj = {
            name : group.name,
            tasks : [],
            description : group.description,
            start_date : group.start_date,
            due_date : group.due_date,
            people : []
        };

        //propogate tasks
        group.tasks.forEach( i => {

            let tempTask = {
                name : tasks[i].name,
                description : tasks[i].description,
                start_date : tasks[i].start_date,
                due_date : tasks[i].due_date,
                people : []
            }

            tasks[i].people.forEach( person => {
                tempTask.people.push(people[person]);
            })
            tempObj.tasks.push(tempTask);


            tasks[i].people.forEach( j => {
                tempObj.people.push(people[j]);
            });
        });

        resObj.push(tempObj);
    })

    res.json(resObj);
})
router.get('/profile', (req,res)=>{
    res.render('profile.ejs');
});

router.get('/email', (req,res)=>{
    res.render('email.ejs');
});

module.exports = router;
