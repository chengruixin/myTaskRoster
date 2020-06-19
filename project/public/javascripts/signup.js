var mainApp = new Vue({
    el : "#main",
    data : {
        username : "",
        email : "",
        password : "",
        rePass : "",
        info : ""
    },

    methods : {
        createAccount : async function(){
            this.info = "";
            let newUser = {
                username: this.username,
                email : this.email,
                password : this.password,
                rePass : this.rePass
            }
           

            /*
            * Validation
            */
            const validator = new Validator();
            if(validator.hasEmptyInputs(newUser)){
                this.info = "Empty inputs!!!"
                console.log("empty inputs");
            }
            else {

                //validate Username
                if(!validator.isValidUsername(newUser.username)){
                    this.info += "/invalid username format";
                }

                if(!validator.isValidEmail(newUser.email)){
                    this.info += "/invalid email";
                }

                if(newUser.password !== newUser.rePass){
                    this.info += "/password not same";
                }

                else if(!validator.isValidPassword(newUser.password)){
                    this.info += "invalid password";
                }

                if(this.info.length === 0){
                    try{
                        const ajax = new Ajax();
                        console.log(await ajax.post('/users/signup', newUser));
                        window.location.replace('/');
                    }
                    
                    catch(err){
                        console.log(err);

                        this.info += err.data.message;
                    }
                }
                
            }   
            
        }
    }
})