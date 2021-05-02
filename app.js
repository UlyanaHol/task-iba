var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    News  = require("./models/news"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");
    // seedDB      = require("./seeds");
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    newsRoutes = require("./routes/news"),
    indexRoutes      = require("./routes/index");

 //require moment
app.locals.moment = require('moment');

// connect to  database
var url = process.env.DATABASEURL || "mongodb://localhost/task";
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();
//seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "password",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//pass in path to view
app.use(function(req, res, next) {
  res.locals.current_path = req.path;
  next();
});

app.use("/", indexRoutes);
app.use("/news", newsRoutes);
app.use("/news/:id/comments", commentRoutes);


app.listen(3000, process.env.IP, function(){
   console.log("The Server Has Started!");
});