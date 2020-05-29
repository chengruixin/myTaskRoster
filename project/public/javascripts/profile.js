var profile = new Vue({
    el : '#profile',
    data : {
        isShowing : false
    },
    methods : {
        showPreferInput : function(){
            this.isShowing = true;
        },
        hidePreferInput : function(){
            this.isShowing = false;
        }
    }
})