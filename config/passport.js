const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bycrpt = require("bcrypt");

//User model
const User = require("../models/schema");

module.exports = function(passport){
    passport.use( 
        new localStrategy({usernameField: "email"}, (email, pass, done) =>{

            //Match User
            User.findOne({ email: email})
                .then(user =>{
                    if(!user){
                        return done(null, false, {message: "Email is not found"});
                    }
            
            //Match Password
            bycrpt.compare(pass, user.pass, (err,isMatch) => {
                if(err) throw err;

                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: "Password Incorrect"});
                }
            });
        }).catch(err => console.log(err));
    }));

    // serialize and deserialize user
    passport.serializeUser((user,done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err,user) => {
            done(err, user);
        });
    });
}