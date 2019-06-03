const express = require("express");
const hbs = require("express-handlebars");
const mongoose =require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

let app =express();

//load passport config file
require("./config/passport")(passport);

//body-parser
app.use(express.urlencoded({ extended:false }));

//express-handlebars
app.engine("hbs", hbs({ extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname+ "/views"}));
app.set("view engine", "hbs");

//mongoose connection
mongoose.connect("mongodb://localhost:27017/passport",{useNewUrlParser: true})
.then( console.log("mongoDB is connected.."));

//Express-session
app.use(session({ secret: "shraddha", resave:true, saveUninitialized: true}));

// passport initilization
app.use(passport.initialize());
app.use(passport.session());

//flash 
app.use(flash());

//set global variables for flash msg
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));


const PORT = process.env.PORT || 8888;
app.listen(PORT, console.log(`Server is runnig in port no ${PORT}`));