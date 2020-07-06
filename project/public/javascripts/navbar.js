const navbar = new Vue({
    el : "#navbar",
    data : {
        isLoggedIn : null,
        username : null,
        identity : null,
        toShow : true
    },
    methods : {
        signOut : async function() {
            try {

                var auth2 = gapi.auth2.getAuthInstance();
                if(auth2){
                    await auth2.signOut();
                }

                const ajax = new Ajax();
                const response = await ajax.get('/auth/logout');
                if(response.message){
                    window.location.replace("/");
                }
            }
            catch(err){
                console.log(err);
            }

        },

        showSidebar : function(){
            this.toShow = false;
            $('#sidebar-content').slideDown();
        },

        hideSidebar : function(){
            this.toShow = true;
            $('#sidebar-content').slideUp();
        }
    },
    async beforeMount (){
        const ajax = new Ajax();
        const {isLoggedIn, username, userId, identity} = await ajax.get('/auth/checkStatus');
        console.log(isLoggedIn, username, userId);
        this.isLoggedIn = isLoggedIn;
        this.username = username;
        this.identity = identity;

    }
})