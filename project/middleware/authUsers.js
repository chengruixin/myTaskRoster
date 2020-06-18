function authUsers(req, res, next) {
    const {user} = req.session;

    if(!user){
        res.status(401).send("not authorized");
    }
    else {
        next();
    }
}

module.exports = authUsers;