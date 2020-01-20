require("dotenv").config();

const express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	flash = require("connect-flash");

//requiring routes
const commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/yelp_camp_14");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(
	require("express-session")({
		secret: "I like vittel tone",
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

app.listen(3000, function() {
	console.log("Connected to port 3000, YelpCamp");
});

// app.listen(process.env.PORT, process.env.IP, function(){
// 	console.log("The YelpCamp Server Has Started!");
//  });
