function authUsers(req, res, next) {
    const {user, verification} = req.session;
    console.log("\nUsers coming through general middleware...");
    console.log(req.session, '\n');
    if(verification){
        res.redirect('/auth/profile/new');
    }
    else{
        if(!user){
            res.status(400).redirect("/auth/login?error=loginfailed");
        }
        else {
            next();
        }
    }

}

module.exports = authUsers;