var login = new Vue({
    el : "#login",
    data : {
        username : "",
        password : "",
        info: ""
    },
    methods : {
        login : async function(){
            this.info = "";
            try{
                const ajax = new Ajax();
                const result = await ajax.post('/users/login', {
                    username : this.username,
                    password : this.password
                });

                console.log(result);

                if(result.message === "Login Successfully"){
                    window.location.replace("/");
                }
            }
            catch(err){
                console.log(err);

                this.info += err.data.message;
            }
        }
    }
})