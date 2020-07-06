var profile = new Vue({
    el : '#main',
    data : {
        isShowing : false,
        user: user,
        newPreference : null,
        newUsername: null,
        editingUsername: false,
        editingEmail : false,
        editingPhone : false,
        info: null
    },
    methods : {
        showPreferInput : function(){
            this.isShowing = true;
        },
        hidePreferInput : function(){
            this.isShowing = false;
        },

        addPreference : async function(){
            console.log("clicked");
            if(this.newPreference == null || this.newPreference == ""){
                this.isShowing = false;
            }
            else {

                try{
                    console.log(this.newPreference);
                    const ajax = new Ajax();
                    const invoice = await ajax.post('/users/profile/preferences', {
                        preference: this.newPreference
                    });

                    // update preferences
                    console.log(invoice);
                    console.log(invoice.insertId);

                    const newPre = await this.getPreference(invoice.insertId);
                    user.preferences.push(newPre);
                    this.isShowing =false;
                    this.newPreference = null;
                }
                catch(err){

                    this.info = err.data.message;
                    console.log(err);
                }

            }
        },

        getPreference : async function(id){
            try{
                const ajax = new Ajax();
                return await ajax.get('/users/profile/preferences/'+ id);
            }
            catch(err){

                this.info = err.data.message;
                console.log(err);
            }

        },

        deletePreference: async function(index){

            try{
                //get preference id
                const preId = user.preferences[index]._id;
                const ajax = new Ajax();
                await ajax.post('/users/profile/preferences/'+preId);

                user.preferences.splice(index, 1);
            }
            catch(err){

                this.info = err.data.message;
                console.log(err);
            }

        },

        turnon: async function(){
            try{
                const ajax = new Ajax();
                await ajax.post('/users/profile?column=available',{
                    newValue: true
                })

                this.user.available = true;
            }

            catch(err){

                this.info = err.data.message;
                console.log(err);
            }
        },

        turnoff: async function(){
            try{
                const ajax = new Ajax();
                await ajax.post('/users/profile?column=available',{
                    newValue: false
                })

                this.user.available = false;
            }

            catch(err){

                this.info = err.data.message;
                console.log(err);
            }
        },

        showUsernameInput: function(){
            this.editingUsername = true;
        },

        updateUsername : async function(){
            try{
                console.log($('#username').val());
                const newValue =$('#username').val();
                // validate username format

                const validator = new Validator();

                if(!validator.isValidUsername(newValue)){
                    this.info = 'Invalid username format!'
                }
                else{
                   const ajax = new Ajax();
                    await ajax.post('/users/profile?column=username', {
                        newValue: newValue
                    });

                    user.username = newValue;
                    this.editingUsername = false;
                }

            }
            catch(err){

                this.info = err.data.message;
                console.log(err);
            }
        },

        hideUsernameInput: function(){
            this.editingUsername = false;
        },

        showEmailInput: function(){
            this.editingEmail = true;
        },

        updateEmail : async function(){
            try{
                console.log($('#email').val());
                const newValue =$('#email').val();

                // validate email format
                const validator = new Validator();

                if(!validator.isValidEmail(newValue)){
                    this.info = 'Invali email format!'
                }
                else {
                   const ajax = new Ajax();
                    await ajax.post('/users/profile?column=email', {
                        newValue: newValue
                    });

                    user.email = newValue;
                    this.editingEmail = false;
                }


            }
            catch(err){

                this.info = err.data.message;
                console.log(err);
            }
        },

        hideEmailInput: function(){
            this.editingEmail = false;
        },

        showPhoneInput: function(){
            this.editingPhone = true;
        },

        updatePhone : async function(){
            try{
                console.log($('#phone').val());
                const newValue =$('#phone').val();
                const ajax = new Ajax();
                await ajax.post('/users/profile?column=phone', {
                    newValue: newValue
                });

                user.phone = newValue;
                this.editingPhone = false;
            }
            catch(err){

                this.info = err.data.message;
                console.log(err);
            }
        },

        hidePhoneInput: function(){
            this.editingPhone = false;
        },

        closeInfo : function(){
            // console.log($('#info'));
            var opacity = 1.0;
            const that = this;
            var timer = setInterval(function(){
                if(opacity <= 0.1 ){
                    that.info = null;
                    jQuery('#info').css('opacity', "0.6");
                    clearInterval(timer);

                }
                else {
                    opacity = opacity - 0.1;
                    jQuery('#info').css('opacity', opacity.toString());
                    // console.log(opacity);
                }

            }, 25);
            // this.info= null;
        }
    }
})