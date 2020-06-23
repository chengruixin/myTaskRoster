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
                const result = await ajax.post('/auth/login', {
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
});

async function onSignIn(googleUser) {
    try{
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID_TOKEN: ", id_token );

        const ajax = new Ajax();
        const response = await ajax.post('/auth/google/verify', {
            token: id_token
        });

        if(response.email_verified){
            window.location.replace('/myTasks');
        }
    }
    catch(err){
        console.log(err);
    }

  }

function onFailure(error) {
      console.log(error);
    }

function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 400,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn,
        'onfailure': onFailure
      });
    }