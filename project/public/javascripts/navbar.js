const navbar = new Vue({
    el : "#navbar",
    data : {
        isLoggedIn : null,
        username : null
    },

    async beforeMount (){
        const ajax = new Ajax();
        const {isLoggedIn, username, userId} = await ajax.get('/users/checkStatus');
        console.log(isLoggedIn, username, userId);
        this.isLoggedIn = isLoggedIn;
        this.username = username;
    }
})