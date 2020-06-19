function authUsers(req, res, next) {
    const {user} = req.session;
    console.log(req.session);
    if(!user){
        res.status(400).redirect("/?error=loginfailed");
    }
    else {
        next();
    }
}

module.exports = authUsers;