var mainManage = new Vue({
    el: "#mainManage",
    data : {
        tempArr: [1,2,3,3,2,32,3]
    },

    methods : {
        expand : function(e){
            const targetDom = e.target;
            $(targetDom).parents(".task-box").children(".expanded").toggle("dplay-none");
            $($(targetDom).parents(".task-box")[0].querySelector(".toShowContent")).toggle("dplay-none");
            $($(targetDom).parents(".task-box")[0].querySelector(".toHideContent")).toggle("dplay-none");

            //debug
            //console.log($(targetDom).parents(".task-box")[0].querySelector(".toShowContent"));
            //console.log($(targetDom).parents(".task-box").children(".expanded"));


            e.stopPropagation();
        },
        addNewPeople : function(e) {
            const targetDom = $(e.target);
            console.log(targetDom.parents(".colleagues").children(".new-colleague"));
            targetDom.parents(".colleagues").children(".new-colleague").toggle("dplay-none");
            
            console.log("activedd");
            //targetDom.parents(".colleagues").children(".new-colleague").css("display", "none");

            e.stopPropagation();
        },
        highlight : function(e){
            //$(e.target).parents(".assignee").toggle("highlight");
            console.log($(e.target).parents(".assignee")[0].classList.toggle("clicked"));
            e.stopPropagation();
        }
    },

    components : {
        createTask : {
            template : "#createTask",
            methods : {
                click : function(e){
                    $(e.target).parents(".task-new").children(".expanded").toggle("dplay-none");


                    e.stopPropagation();
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

        
    }
})