var mainManage = new Vue({
    el: "#mainManage",
    data : {
        tasks: [],
        groups : []
    },

    methods : {
        expandGroup : function(e){
            const targetDom = e.target;
            $(targetDom).parents(".task-box").children(".expanded").toggle("dplay-none");
            $($(targetDom).parents(".task-box")[0].querySelector(".toShowContent")).toggle("dplay-none");
            $($(targetDom).parents(".task-box")[0].querySelector(".toHideContent")).toggle("dplay-none");

            //debug
            //console.log($(targetDom).parents(".task-box")[0].querySelector(".toShowContent"));
            //console.log($(targetDom).parents(".task-box").children(".expanded"));


            e.stopPropagation();
        },

        expandTask : function(e){
            const targetDom = e.target;
            $(targetDom).parents(".task-unit").children(".expanded").toggle("dplay-none");
            $($(targetDom).parents(".task-unit")[0].querySelector(".toShowContent")).toggle("dplay-none");
            $($(targetDom).parents(".task-unit")[0].querySelector(".toHideContent")).toggle("dplay-none");

            //debug
            //console.log($(targetDom).parents(".task-box")[0].querySelector(".toShowContent"));
            //console.log($(targetDom).parents(".task-box").children(".expanded"));


            e.stopPropagation();
        },


        addNewPeople :async function(index, e) {
            const targetDom = $(e.target);
            targetDom.parents(".colleagues").children(".new-colleague").toggle("dplay-none");            
            e.stopPropagation();
        },
        highlight : function(e, index, i){
            try{
                console.log($(e.target).parents(".assignee"));     
                console.log(this.tasks[index]);   
                const curTask = this.tasks[index];
                const targetUser = this.tasks[index].avaUsers[i];

                if(!curTask.hasOwnProperty('readyToAdd')){
                    curTask.readyToAdd = [];
                    console.log("unknown");
                    console.log(curTask);
                }

                if($(e.target).parents(".assignee")[0].classList.toggle("clicked")){
                    curTask.readyToAdd.push(targetUser._id);
                }
                else {
                    curTask.readyToAdd = curTask.readyToAdd.filter( function(val, idx, arr){
                        return val != targetUser._id;
                    });
                }

                console.log(curTask.readyToAdd);
            }
            
            catch(err){
                console.log(err);
            }
            e.stopPropagation();
        },
        highlightInGroup : function(e, groupIdx, taskIdx, i){
            try{
                console.log($(e.target).parents(".assignee"));     
                  
                const curTask = this.groups[groupIdx].tasks[taskIdx]
                const targetUser = curTask.avaUsers[i];

                console.log(curTask); 
                console.log(targetUser);

                if(!curTask.hasOwnProperty('readyToAdd')){
                    curTask.readyToAdd = [];
                    console.log("unknown");
                    console.log(curTask);
                }

                if($(e.target).parents(".assignee")[0].classList.toggle("clicked")){
                    curTask.readyToAdd.push(targetUser._id);
                }
                else {
                    curTask.readyToAdd = curTask.readyToAdd.filter( function(val, idx, arr){
                        return val != targetUser._id;
                    });
                }

                console.log(curTask.readyToAdd);
            }
            
            catch(err){
                console.log(err);
            }
            e.stopPropagation();
        },
        addUsersToTask : async function(index, event){
            const taskId = this.tasks[index]._id;
            const selectedUsers = this.tasks[index].readyToAdd;
            console.log("Task id" , taskId);
            console.log(selectedUsers);

            const ajax = new Ajax();
            await ajax.post(`/tasks/${taskId}/addUser`, {
                usersId : selectedUsers
            }).then(data => {
                console.log(data);

                //refresh this task data
                this.refreshTaskById(taskId, index);

                //remove blue borders for all avaUsers
                $(event.target).parents(".new-colleague").children(".row").children(".assignee.clicked").toggleClass("clicked")
                
            });

            ///*
            //    Tesinng....
            //*/

            
        },

        addUsersToTaskInGroup : async function(groupIdx, taskIndex, event){
            const task = this.groups[groupIdx].tasks[taskIndex];
            const taskId = task._id;
            const selectedUsers = task.readyToAdd;
            console.log("Task id" , taskId, groupIdx);
            console.log(selectedUsers);

            const ajax = new Ajax();
            await ajax.post(`/tasks/${taskId}/addUser`, {
                usersId : selectedUsers
            }).then(async data => {
                console.log(data);

                //refresh this task data
                const newTask = await ajax.get(`/tasks/${taskId}`);
                this.groups[groupIdx].tasks.splice(taskIndex, 1, newTask);
                //remove blue borders for all avaUsers
                $(event.target).parents(".new-colleague").children(".row").children(".assignee.clicked").toggleClass("clicked")
                
            });

            ///*
            //    Tesinng....
            //*/

            
        },


        refreshTasks : async function(){
            const ajax = new Ajax();
            this.tasks = await ajax.get('/tasks');
            console.log("Tasks mess:\n", this.tasks);
        },

        refreshTaskById : async function(taskId, index){
            const ajax = new Ajax();
            const newTask = await ajax.get(`/tasks/${taskId}`);
            
            //use splice to refresh( delete and then add new) this specific task
            this.tasks.splice(index, 1, newTask);
            console.log(this.tasks[index]);
        },

        getTaskById : async function(taskId) {
            const ajax = new Ajax();
            const task = await ajax.get(`/tasks/${taskId}`);
            return task;
        },

        refreshGrops : async function(){
            const ajax = new Ajax();
            this.groups = await ajax.get('/groups');
            console.log("Groups mess: \n", this.groups);
        }
    },

    components : {
        createTask : {
            template : "#createTask",
            props: {
                index:Number, //group index
                id : Number    //group id
            },
            data : function (){
                return {
                    task_name : "",
                    description : "",
                    start : null,
                    due: null,
                    groupIdx: this.index,  //this is showing group index in html page
                    groupKey : this.id //this is showing group id in data
                    
                }
            },

            methods : {
                click : function(e){
                    $(e.target).parents(".task-new").children(".expanded").toggle("dplay-none");
                    e.stopPropagation();
                },
                create : async function(){
                    let obj = {
                        name : this.task_name,
                        start : this.start,
                        due : this.due,
                        description : this.description,
                        group_id : this.groupKey
                    }
                    if(obj.name == "" || obj.description == "" || obj.start == "" || obj.due  == ""){
                        console.log('rejected', "empty input\n", this.groupIdx, this.groupKey);
                    }
                    else{
                        console.log(obj);
                        //send post reques
                        const ajax = new Ajax();
                        const result = await ajax.post('/tasks/create', obj);
                        console.log("received message", result);


                        //refresh page
                        
                        if(this.groupIdx === -1){
                            const newTask = await ajax.get(`/tasks/${result.insertId}`);
                            this.$parent.tasks.push(newTask);
                            console.log("add to ", -1);
                            
                        }
                        else{
                            const newTask = await ajax.get(`/tasks/${result.insertId}`);
                            this.$parent.groups[this.groupIdx].tasks.push(newTask);
                            console.log("add to group");
                        }
                        this.task_name = "";
                        this.description = "";
                        this.start = null;
                        this.due = null;
                        
                    }
                    
                }
            }

        },

        createGroup : {
            template : "#createGroup",
            data : function(){
                return {
                    name : "",
                    description : "",
                    start : "",
                    due : ""
                }
            },
            methods : {
                click : function(e){
                    $(e.target).parents(".task-new").children(".expanded").toggle();
                    
                    e.stopPropagation();
                },

                addNewGroup : async function(){
                    let obj = {
                        name : this.name,
                        start : this.start,
                        due : this.due,
                        description : this.description

                    }
                    if(obj.name == "" || obj.description == "" || obj.start == "" || obj.due  == ""){
                        console.log('rejected', "empty input");
                    }
                    else{
                        console.log(obj);
                        //send post reques
                        const ajax = new Ajax();
                        const invoice = await ajax.post('/groups/create', obj);
                        console.log("received message", invoice);


                        //refresh page
                        
                        const newGroup = await ajax.get(`/groups/${invoice.insertId}`);
            
                        this.$parent.groups.push(newGroup);
                        this.name = "";
                        this.description = "";
                        this.start = null;
                        this.due = null;
                    }
                }
            }
        }

        
    },

    async beforeMount () {
        //get groups
        await this.refreshGrops();

        ////get tasks
        await this.refreshTasks();
    }
})