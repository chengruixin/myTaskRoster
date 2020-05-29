var main = new Vue({
    el: "#main",
    data : {
        scheduledTask : {
            grouped: [1,2],
            ungrouped : [2,3,4]
        },

        todayTask : {
            grouped: [1,4,3],
            ungrouped : [1,2]
        }
    },
    methods : {
        //expand : function(e) {
        //    const targetDom = e.target;
        //    console.log($(targetDom).parents(".grouped").children(".expanded"));
        //    $(targetDom).parents(".grouped").children(".expanded").toggle("d-none");
        //    $(targetDom).parents(".grouped").children(".toHideContent").toggle("d-none");
        //    $(targetDom).parents(".grouped").children(".toShowContent").toggle("d-none");
        //    e.stopPropagation();
        //},

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
        }
    }
})