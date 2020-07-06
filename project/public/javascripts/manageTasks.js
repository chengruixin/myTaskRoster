var mainManage = new Vue({
    el: "#mainManage",
    data : {
        tasks: [],
        groups : [],
        todayDate : new Date().toLocaleDateString()
    },

    methods : {
        compareTimeInStr : compareTimeInStr,

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

        editingGroupDesc : function(event, groupIdx){
            // console.log(event.target);
            // console.log($(event.target).siblings('.expanded'));
            // console.log(event.target.value);
            // console.log(this.groups[groupIdx].description);
            $(event.target).siblings('.expanded').removeClass('dplay-none-im');


        },

        uneditingGroupDesc : function(event, groupIdx){
            // console.log(event.target);
            // console.log($(event.target).parents('.expanded.editing-control'));
            // // $(event.target).siblings('.expanded').addClass('dplay-none-im');

            // // reset textarea value
            // console.log($(event.target).parents('.expanded.editing-control').siblings('.description-input'));
            $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0].value = this.groups[groupIdx].description;
            $(event.target).parents('.expanded.editing-control').addClass('dplay-none-im');
        },

        updateGroupDesc : async function(event, groupIdx){
            // console.log($(event.target).parents('.expanded.editing-control').siblings('.description-input'));
            const textarea = $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0];
            // console.log(textarea.value);
            // console.log(this.groups[groupIdx].description);

            //shed the editing control
            $(event.target).parents('.expanded.editing-control').addClass('dplay-none-im');

            if(textarea.value !== this.groups[groupIdx].description){
                try{
                    //update description
                    const ajax = new Ajax();
                    await ajax.post(`/groups/${this.groups[groupIdx]._id}/description`,{
                        description: textarea.value
                    });

                    await this.refreshGroupsById(this.groups[groupIdx]._id, groupIdx);
                }

                catch(err){
                    console.log(err);
                }
            }

        },

        editingTaskDesc : function(event, taskIdx){

            $(event.target).siblings('.expanded').removeClass('dplay-none-im');


        },

        uneditingTaskDesc : function(event, taskIdx){
            $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0].value = this.tasks[taskIdx].description;
            $(event.target).parents('.expanded.editing-control').addClass('dplay-none-im');
        },

        updateTaskDesc : async function(event, taskIdx){
            // console.log($(event.target).parents('.expanded.editing-control').siblings('.description-input'));
            const textarea = $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0];
            // console.log(textarea.value);
            // console.log(this.groups[groupIdx].description);

            //shed the editing control
            $(event.target).parents('.expanded.editing-control').addClass('dplay-none-im');

            if(textarea.value !== this.tasks[taskIdx].description){
                try{
                    //update description
                    const ajax = new Ajax();
                    await ajax.post(`/tasks/${this.tasks[taskIdx]._id}/description`,{
                        description: textarea.value
                    });

                    // refreshTaskById : async function(taskId, index){
                    await this.refreshTaskById(this.tasks[taskIdx]._id, taskIdx);
                }

                catch(err){
                    console.log(err);
                }
            }

        },

        // /
        editingTaskDescFromGroup : function(event, taskIdx, groupIdx){

            $(event.target).siblings('.expanded').removeClass('dplay-none-im');


        },

        uneditingTaskDescFromGroup : function(event, taskIdx,groupIdx){
            console.log($(event.target).parents('.expanded.editing-control').siblings('.description-input').text());
            console.log(this.groups[groupIdx].tasks[taskIdx].description);
            // $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0].value = this.groups[groupIdx].tasks[taskIdx].description;
            $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0].value = this.groups[groupIdx].tasks[taskIdx].description ;
            $(event.target).parents('.expanded.editing-control').addClass('dplay-none-im');
        },

        updateTaskDescFromGroup : async function(event, taskIdx, groupIdx){
            // console.log($(event.target).parents('.expanded.editing-control').siblings('.description-input'));
            const textarea = $(event.target).parents('.expanded.editing-control').siblings('.description-input')[0];
            // console.log(textarea.value);
            // console.log(this.groups[groupIdx].description);

            //shed the editing control
            $(event.target).parents('.expanded.editing-control').addClass('dplay-none-im');

            if(textarea.value !== this.groups[groupIdx].tasks[taskIdx].description){
                try{
                    //update description
                    const ajax = new Ajax();
                    await ajax.post(`/tasks/${this.groups[groupIdx].tasks[taskIdx]._id}/description`,{
                        description: textarea.value
                    });

                    // refreshGroupsById: async function(groupId, index){
                    await this.refreshGroupsById(this.groups[groupIdx]._id, groupIdx);
                }

                catch(err){
                    console.log(err);
                }
            }

        },

        //

        addNewPeople :async function(index, e) {
            const targetDom = $(e.target);
            targetDom.parents(".colleagues").children(".new-colleague").toggle("dplay-none");
            e.stopPropagation();
        },

        // addNewPeopleToGroup: async function(groupIdx, event) {
        //     const targetDom = $(e.target);
        //     targetDom.parents(".colleagues").children(".new-colleague").toggle("dplay-none");
        //     e.stopPropagation();
        // },

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
        // highlightInGroup : function(e, groupIdx, taskIdx, i){
        //     try{
        //         console.log($(e.target).parents(".assignee"));

        //         const curTask = this.groups[groupIdx].tasks[taskIdx]
        //         const targetUser = curTask.avaUsers[i];

        //         console.log(curTask);
        //         console.log(targetUser);

        //         if(!curTask.hasOwnProperty('readyToAdd')){
        //             curTask.readyToAdd = [];
        //             console.log("unknown");
        //             console.log(curTask);
        //         }

        //         if($(e.target).parents(".assignee")[0].classList.toggle("clicked")){
        //             curTask.readyToAdd.push(targetUser._id);
        //         }
        //         else {
        //             curTask.readyToAdd = curTask.readyToAdd.filter( function(val, idx, arr){
        //                 return val != targetUser._id;
        //             });
        //         }

        //         console.log(curTask.readyToAdd);
        //     }

        //     catch(err){
        //         console.log(err);
        //     }
        //     e.stopPropagation();
        // },

        //                              index        i
        highlightInGroup2 : function(e, groupIdx, userIdx) {
            try{
                console.log($(e.target).parents(".assignee"));

                const curGroup = this.groups[groupIdx];
                const targetUser = this.groups[groupIdx].avaUsers[userIdx];

                if(!curGroup.hasOwnProperty('readyToAdd')){
                    curGroup.readyToAdd = [];
                    console.log("unknown");
                    console.log(curGroup);
                }

                if($(e.target).parents(".assignee")[0].classList.toggle("clicked")){
                    curGroup.readyToAdd.push(targetUser._id);
                }
                else {
                    curGroup.readyToAdd = curGroup.readyToAdd.filter( function(val, idx, arr){
                        return val != targetUser._id;
                    });
                }

                console.log(curGroup.readyToAdd);
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
                const elements = $(event.target).parents(".new-colleague").children(".row")[0].querySelectorAll(".clicked");
                elements.forEach(function(element){
                    element.classList.toggle("clicked");
                });

            });

            ///*
            //    Tesinng....
            //*/
            // console.log($(event.target).parents(".new-colleague").children(".row")[0].querySelectorAll(".clicked") );



        },


        addUsersToGroup : async function(groupIdx, $event){
            const groupId = this.groups[groupIdx]._id;
            const selectedUsers = this.groups[groupIdx].readyToAdd;
            console.log("Group id" , groupId);
            console.log(selectedUsers);

            const parent = $(event.target).parents(".new-colleague").children(".row")[0];


            const ajax = new Ajax();
            await ajax.post(`/groups/${groupId}/addUser`, {
                usersId : selectedUsers
            }).then(data => {
                console.log(data);

                //remove blue borders for all avaUsers
                const elements = parent.querySelectorAll(".clicked");
                console.log(elements);
                elements.forEach(function(element){
                    element.classList.toggle("clicked");
                });


                //refresh this task data
                this.refreshGroupsById(groupId, groupIdx);



            });




        },

        deleteGroup : async function(groupIdx){
            try{
                const groupId = this.groups[groupIdx]._id;
                const ajax = new Ajax();
                await ajax.delete(`/groups/${groupId}`);
                this.groups.splice(groupIdx, 1);
            }
            catch(err){
                console.log(err);
            }

        },

        deleteTask : async function(taskIdx){
            try{
                const taskId = this.tasks[taskIdx]._id;

                const ajax = new Ajax();
                await ajax.delete(`/tasks/${taskId}`);

                this.tasks.splice(taskIdx, 1);
            }
            catch(err){
                console.log(err);
            }

        },

        deleteTaskInGroup : async function(taskIdx, groupIdx){
            try{
                const taskId = this.groups[groupIdx].tasks[taskIdx]._id;

                const ajax = new Ajax();
                await ajax.delete(`/tasks/${taskId}`);

                this.groups[groupIdx].tasks.splice(taskIdx, 1);
            }
            catch(err){
                console.log(err);
            }

        },
        refreshTasks : async function(){
            const ajax = new Ajax();
            this.tasks = await ajax.get('/tasks');
            console.log({tasks : this.tasks});
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
            console.log({groups: this.groups});
        },

        refreshGroupsById: async function(groupId, index){
            const ajax = new Ajax();
            const newGroup = await ajax.get(`/groups/${groupId}`);

            this.groups.splice(index, 1, newGroup);
            console.log(this.groups[index]);
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
                create : async function(e){
                    let obj = {
                        name : this.task_name,
                        start : this.start,
                        due : this.due,
                        description : this.description,
                        group_id : this.groupKey
                    }
                    if(obj.name == "" || obj.description == "" || obj.start == null || obj.due  == null){
                        console.log('rejected', "empty input\n", this.groupIdx, this.groupKey);
                    }


                    // start > due
                    else if(compareTimeInStr(obj.start, obj.due) === 1){
                        console.log('start date should only equal to or earlier than due date');
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
                        this.click(e);
                        // testing




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
                    $(e.target).parents(".task-new").children(".expanded").toggle("dplay-none");
                    e.stopPropagation();
                },

                addNewGroup : async function(e){
                    let obj = {
                        name : this.name,
                        start : this.start,
                        due : this.due,
                        description : this.description

                    }
                    if(obj.name == "" || obj.description == "" || obj.start == "" || obj.due  == ""){
                        console.log('rejected', "empty input");
                    }
                    else if(compareTimeInStr(obj.start, obj.due) === 1){
                        console.log('start date should only equal to or earlier than due date');
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
                        this.click(e);
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