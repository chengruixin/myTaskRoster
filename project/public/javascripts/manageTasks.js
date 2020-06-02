var mainManage = new Vue({
    el: "#mainManage",
    data : {
        tasks: []
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
        addUsersToTasks : async function(index){
            const taskId = this.tasks[index]._id;
            const selectedUsers = this.tasks[index].readyToAdd;
            console.log("Task id" , taskId);
            console.log(selectedUsers);

            const ajax = new Ajax();
            await ajax.post(`/tasks/${taskId}/addUser`, {
                usersId : selectedUsers
            }).then(data => {
                console.log(data);
                this.refreshTasks();
            });
        },
        refreshTasks : async function(){
            const ajax = new Ajax();
            this.tasks = await ajax.get('/tasks');
            console.log(this.tasks);
        }
    },

    components : {
        createTask : {
            template : "#createTask",

            data : function (){
                return {
                    task_name : "",
                    description : "",
                    start : null,
                    due: null
                    
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
                        description : this.description

                    }
                    if(obj.name == "" || obj.description == "" || obj.start == "" || obj.due  == ""){
                        console.log('rejected', "empty input");
                    }
                    else{
                        console.log(obj);
                        //send post reques
                        const ajax = new Ajax();
                        const result = await ajax.post('/dbTest/tasks/create', obj);
                        console.log("received message", result);


                        //refresh page
                        this.$parent.refreshTasks();
                    }
                    
                }
            }

        },

        createGroup : {
            template : "#createGroup",
            methods : {
                click : function(e){
                    $(e.target).parents(".task-new").children(".expanded").toggle("dplay-none");
                    e.stopPropagation();
                }
            }
        }

        
    },

    async beforeMount () {
        //get tasks
        this.refreshTasks();
        
    }
})