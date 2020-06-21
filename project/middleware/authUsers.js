function authUsers(req, res, next) {
    const {user} = req.session;
    console.log(req.session);
    if(!user){
        res.status(400).redirect("/users/login?error=loginfailed");
    }
    else {
        next();
    }
}

module.exports = authUsers;