var main = new Vue({
    el: "#main",
    data : {
        // scheduledTask : {
        //     grouped: [],
        //     ungrouped : []
        // },

        todayTask : {
            grouped: [],
            ungrouped : []
        },

        todayDate : new Date().toLocaleDateString()
    },
    methods : {

        compareTimeInStr : compareTimeInStr,
        
        expandGroup : function(e){
            const targetDom = e.target;
            console.log($(targetDom).parents(".task-box").children(".expanded"));
            $(targetDom).parents(".task-box").children(".expanded").toggle("dplay-none");
            console.log($(targetDom).parents(".task-box")[0].querySelector(".toShowContent"));
            $($(targetDom).parents(".task-box")[0].querySelector(".toShowContent")).toggle("dplay-none");
            $($(targetDom).parents(".task-box")[0].querySelector(".toHideContent")).toggle("dplay-none");
            e.stopPropagation();
        },


        expandTask : function(e){
            const targetDom = e.target;
            console.log($(targetDom).parents(".task-unit").children(".expanded"));
            $(targetDom).parents(".task-unit").children(".expanded").toggle("dplay-none");
            console.log($(targetDom).parents(".task-unit")[0].querySelector(".toShowContent"));
            $($(targetDom).parents(".task-unit")[0].querySelector(".toShowContent")).toggle("dplay-none");
            $($(targetDom).parents(".task-unit")[0].querySelector(".toHideContent")).toggle("dplay-none");
            e.stopPropagation();
        },

        getTasks : async function(){
            const ajax = new Ajax();
            this.todayTask.ungrouped = await ajax.get('/tasks/individual');

        },

        getGroups : async function() {
            const ajax = new Ajax();
            this.todayTask.grouped = await ajax.get('/groups/individual');


        },
        getTaskInGroupById : async function(taskId){
            try{
                const ajax = new Ajax();
                return await ajax.get(`/tasks/${taskId}?scope=watch`);
            }

            catch(err) {
                console.log(err);
            }

        },
        completeTaskInGroup : async function(groupIdx, taskIdx){
            const ajax = new Ajax();
            const task = this.todayTask.grouped[groupIdx].tasks[taskIdx];
            console.log(this.todayTask.grouped[groupIdx].tasks[taskIdx]);

            await ajax.post(`/tasks/${task._id}/completion`,{
                complete: new Date(),
                isCompleted: true
            });


            //refresh task in this group
            const updatedTask = await this.getTaskInGroupById(task._id);

            this.todayTask.grouped[groupIdx].tasks.splice(taskIdx, 1, updatedTask);
        },
        completeTask: async function(taskIdx) {
            const ajax = new Ajax();
            const task = this.todayTask.ungrouped[taskIdx];
            console.log(task);

            await ajax.post(`/tasks/${task._id}/completion`,{
                complete: new Date(),
                isCompleted: true
            });


            //refresh task in this group
            const updatedTask = await this.getTaskInGroupById(task._id);

            this.todayTask.ungrouped.splice(taskIdx, 1, updatedTask);
        },
        inCompleteTaskInGroup : async function(groupIdx, taskIdx){
            const ajax = new Ajax();
            const task = this.todayTask.grouped[groupIdx].tasks[taskIdx];
            console.log(this.todayTask.grouped[groupIdx].tasks[taskIdx]);

            await ajax.post(`/tasks/${task._id}/completion`,{
                complete: null,
                isCompleted: false
            });


            //refresh task in this group
            const updatedTask = await this.getTaskInGroupById(task._id);

            this.todayTask.grouped[groupIdx].tasks.splice(taskIdx, 1, updatedTask);
        },
        inCompleteTask: async function(taskIdx) {
            const ajax = new Ajax();
            const task = this.todayTask.ungrouped[taskIdx];
            console.log(task);

            await ajax.post(`/tasks/${task._id}/completion`,{
                complete: null,
                isCompleted: false
            });


            //refresh task in this group
            const updatedTask = await this.getTaskInGroupById(task._id);

            this.todayTask.ungrouped.splice(taskIdx, 1, updatedTask);
        },
        alertInfo: function(){
            console.log("you clicked!");
        }
    },
    async beforeMount (){
        await this.getGroups();
        await this.getTasks();

        console.log({tasks: this.todayTask});
        // testing
        // const ajax1 = new Ajax();
        // this.todayTask.ungrouped = await ajax1.get('/tasks/individual');
        // console.log(this.todayTask.ungrouped);

        // const ajax2= new Ajax();
        // console.log(await ajax2.get('/groups/individual'));
    }
})