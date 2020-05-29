
$($(".temp")[0]).css({
    border: "1px solid rgb(221,221,221)",
    padding: "0.5em 1em",
    borderBottom : "none",
    borderRight : "none"
});

$($(".temp")[1]).css({
    border: "1px solid rgb(221,221,221)",
    padding: "0.5em 1em"
});

var main = new Vue({
    el:'#main',
    data : {
        isEmails : true,
        isSettings : false
    },
    methods : {
        expandTask : function(e){
            const targetDom = e.target;
            console.log($(targetDom).parents(".task-unit").children(".expanded"));
            $(targetDom).parents(".task-unit").children(".expanded").toggle("dplay-none");
            console.log($(targetDom).parents(".task-unit")[0].querySelector(".toShowContent"));
            $($(targetDom).parents(".task-unit")[0].querySelector(".toShowContent")).toggle("dplay-none");
            $($(targetDom).parents(".task-unit")[0].querySelector(".toHideContent")).toggle("dplay-none");
            e.stopPropagation();
        },

        toEmails : function(e){
            this.isEmails = true;
            this.isSettings = false;

            $($(".temp")[0]).css({
                border: "1px solid rgb(221,221,221)",
                padding: "0.5em 1em",
                borderBottom : "none",
                borderRight : "none"
            });
            
            $($(".temp")[1]).css({
                border: "1px solid rgb(221,221,221)",
                padding: "0.5em 1em"
            });

            
        },

        toSettings : function(e) {
            this.isSettings = true;
            this.isEmails = false;

            $($(".temp")[1]).css({
                border: "1px solid rgb(221,221,221)",
                padding: "0.5em 1em",
                borderBottom : "none",
                borderLeft : "none"
            });
            
            $($(".temp")[0]).css({
                border: "1px solid rgb(221,221,221)",
                padding: "0.5em 1em"
            });
            
        }
    }
})