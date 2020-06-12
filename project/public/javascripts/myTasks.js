var main = new Vue({
    el: "#main",
    data : {
        scheduledTask : {
            grouped: [],
            ungrouped : []
        },

        todayTask : {
            grouped: [],
            ungrouped : []
        }
    },
    methods : {


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
            this.todayTask.ungrouped = await ajax.get('/tasks');
            console.log("Tasks mess:\n", this.todayTask);
        },

        getGroups : async function() {
            const ajax = new Ajax();
            this.todayTask.grouped = await ajax.get('/groups');
            console.log("Tasks mess:\n", this.todayTask);

        }
    },
    async beforeMount (){
        await this.getGroups();
        await this.getTasks();
    }
})