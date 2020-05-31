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

        getTasks : function(){
            let xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/tasks', true);
            xhttp.send();

            let that = this;
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    let data = JSON.parse(this.responseText);
                    console.log(data);
                    that.todayTask.ungrouped = data;
                }
            }
        },

        getGroups : function() {
            let xhttp = new XMLHttpRequest();
            xhttp.open('GET', '/groups', true);
            xhttp.send();

            let that = this;
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    let data = JSON.parse(this.responseText);
                    console.log(data);
                    that.todayTask.grouped = data;
                }
            }
        }
    },
    beforeMount (){
        console.log(this.scheduledTask.ungrouped);
        this.getTasks();
        this.getGroups();
    }
})