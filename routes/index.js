const express = require("express");

let router = express.Router();

//Welcome page
router.get("/", (req,res) => {
    res.render("welcome");
});

//Dashboar page
router.get("/dashboard",isAuthenticate, (req,res)=>{
    res.render("dashboard", {name: req.user.name});
});

//Logout
router.get("/logout", (req,res) => {
    req.logout();
    req.flash("success_msg","You are loged out");
    res.redirect("/user/login");
});

module.exports = router;

function isAuthenticate(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error_msg", "Please log in to view this page");
        res.redirect("/user/login");
    }
}