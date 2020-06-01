class Ajax {
    get = (url) => {
        return new Promise((resolve, reject)=> {
            try{
                let xhttp = new XMLHttpRequest();
                xhttp.open('get', url, true);
                xhttp.send();
    
                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    }
                    
                }
            }

            catch(err){
                reject(err);    
            }

        });
    }


    post = (url, data) => {
        return new Promise((resolve, reject) => {
            try{
                let xhttp = new XMLHttpRequest();
                xhttp.open('POST', url, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(data));

                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    }
                    
                }
            }

            catch(err){
                reject(err);
            }
        })
    }
}

