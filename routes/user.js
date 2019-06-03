const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
let router = express.Router();

//modles
let user = require("../models/schema");

// login route
router.get("/login", (req,res)=> res.render("login"));

//register login
router.get("/register", (req,res)=> res.render("register"));

//register handle
router.post("/register", (req,res)=>{ 
    const { name,email,pass,pass2 } = req.body; 
    
    let errors = [];     
    //Validation fields
    if(!name || !email || !pass || !pass2){
        errors.push({ msg: "Please fill in all fields"});
    }
    if( pass !== pass2 ){
        errors.push({ msg: "Password do not match"});
    }
    if( pass.length < 6 ){
        errors.push({ msg: "Password must be at least 6 char"});
    }
    if(errors.length > 0){
        res.render("register",{ errors,name,email,pass,pass2});
    }else{
            //Validation pass
            user.findOne({ email: email})
            .then(users=> {
                //email is used
                if(users){
                    errors.push({msg: "Email is already on used."});
                    res.render("register",{errors,name,email,pass,pass2}  );
                }
                else{
                    let newUser = new user({
                        name,email,pass
                    });
                    //bcrypt password
                    bcrypt.genSalt(5, (err,salt)=>
                        bcrypt.hash(newUser.pass, salt, (err,hash)=>{
                           if(err){ throw err; }

                        //hash password
                         newUser.pass = hash;

                        //save user
                        newUser.save()
                            .then(user =>{
                            //flash msg
                            req.flash("success_msg","You are now registered and can log in");
                            res.redirect("/user/login");
                        })
                        .catch( err => console.log(err));
                    }));
                }
            });
        }
    });

// login post
router.post("/login", (req,res,next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

module.exports = router;