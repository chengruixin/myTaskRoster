var mainManage = new Vue({
    el: "#mainManage",
    data : {
        tempArr: [1,3],
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
                        this.$parent.tasks = await ajax.get('/tasks');
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
        console.log("hello");
        //get tasks
        const ajax = new Ajax();
        this.tasks = await ajax.get('/tasks');
        console.log(this.tasks);
    }
})