const navbar = new Vue({
    el : "#navbar",
    data : {
        isLoggedIn : null,
        username : null
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

            }
    },
    async beforeMount (){
        const ajax = new Ajax();
        const {isLoggedIn, username, userId} = await ajax.get('/auth/checkStatus');
        console.log(isLoggedIn, username, userId);
        this.isLoggedIn = isLoggedIn;
        this.username = username;

        gapi.load('auth2', function() {
            gapi.auth2.init();
        });
    }
})