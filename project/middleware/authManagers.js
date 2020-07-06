function authManagers(req, res, next) {
    const {user} = req.session;
    console.log("\nUsers coming through MANAGER middleware...");
    console.log(req.session, '\n');

    if(!user){
        res.status(403).redirect("/auth/login?error=loginfailed");
    }
    else if(user.identity !== 'manager'){
        res.status(401).redirect("/?error=unauthorized");
    }
    else {
        next();
    }


}

module.exports = authManagers;