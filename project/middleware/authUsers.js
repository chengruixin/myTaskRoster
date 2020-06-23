function authUsers(req, res, next) {
    const {user, verification} = req.session;
    console.log(req.session);
    if(verification){
        res.redirect('/auth/username/new');
    }
    else{
        if(!user){
            res.status(400).redirect("/auth/login?error=loginfailed");
        }
        else {

            //verify the users
            next();
        }
    }

}

module.exports = authUsers;