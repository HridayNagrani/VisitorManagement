const express = require("express");
let app = express();
var bodyParser =require("body-parser");
const mongoose = require("mongoose");
var alert=require("alert");
var flash = require("express-flash");
var passport = require("passport");
var LocalStrategy =require("passport-local");
var methodOverride=require("method-override");
var passportLocalMongoose =require("passport-local-mongoose");
var nodemailer = require('nodemailer');
var jsdom = require("jsdom");
var ObjectId = require('mongodb').ObjectID;
var FileSaver = require('file-saver');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
var download=require("downloadjs");
global.document = document;
var $ = require("jquery")(window);
var building1;
var name1;
var email1;
var password1;
var mailinfo;

mongoose.connect('mongodb://localhost:27017/VSM2', { useNewUrlParser: true , useUnifiedTopology :true ,useFindAndModify: false });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// app.use(alert());
// app.use($);
// window.onerror=function(){
//  alert('An error has occurred!')
//  return true
// }
var userr;
var user_schema=new mongoose.Schema({

	username:String,
	password:String,
	name:String,
	building:String
});

user_schema.plugin(passportLocalMongoose);

var User=mongoose.model("User",user_schema);
var info_schema=new mongoose.Schema({

	build:String,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		}},
	date:Date,
	numberOfVisitors:Number,
	isAllowed:Boolean,
	gateNum:Number,
	gname:String
});
var visit=mongoose.model("visit",info_schema);

var feedback_schema=new mongoose.Schema({

	camDes:Number,
	clean:Number,
	staff:Number,
	VSM:Number,
	GF:String,
	checkOutTime:String,
	egate:Number,
	userId:String
});
feedback_schema.plugin(passportLocalMongoose);
var Feedback=mongoose.model("feedback",feedback_schema);

var admin_schema=new mongoose.Schema({

	username:String,
	password:String
	
});
admin_schema.plugin(passportLocalMongoose);
var Admin=mongoose.model("Admin",admin_schema);
//PASSPORT Config

app.use(require("express-session")({
	secret: "Encryption Secret Here ... shhh!",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error =req.flash("error");
	res.locals.success =req.flash("success");	
	next();
});


// app.use(indexRoutes);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'psgo.hkh@gmail.com',
    pass: 'xxxxxxxxx'
  }
});

//Routes 
app.get("/",(req,res)=>{
	res.render("home");


// Admin.register(new Admin({username:"admin"}
// 					   // {name:req.body.fname},
// 					   // {building:req.body.fbuilding}
// 					   ),"admin@123456",function(err,user){
// 	if(err){
// 	console.log(err);
// 	req.flash("error", err.message);
		
// 	return res.redirect("/admin/login");
// 	}
// 	passport.authenticate("local")(req,res,function(){
// 		res.redirect("/admin");
// 	});
// });	
});

app.get("/users",isLoggedIn,(req,res)=>{
	userr=req.session.passport.user;
	User.find({username:userr},function(err,data){
		if(err){
			console.log(err);
		
		}
		else{
			var idd=data[0]._id;
			res.redirect("/users/"+idd);
		}
	});
	
	
});

app.get("/users/new",(req,res)=>{
	res.render("form");
});

app.get("/gatepass/:id",(req,res)=>{
	var url = req.url;
	var id = url.substring(url.lastIndexOf('/') + 1);
	res.render("gatePass",{id:id});
});

app.get("/users/login",(req,res)=>{
	res.render("login");
});

app.get("/checkout/:id",(req,res)=>{
	var url = req.url;
	var id = url.substring(url.lastIndexOf('/') + 1);
	res.render("checkout",{id:id});
})

app.get("/info",(req,res)=>{
	res.render("info");
});

app.get("/admin/login",function(req,res){
res.render("adminLogin");
});

app.get("/users/:id",isLoggedIn,(req,res)=>{
		User.findById(req.params.id,function(err,foundUser){
		if(err || !foundUser){
			//console.log("UserNotFound");
			res.redirect("back");
		}
		else{
			//render show template with that campground
			res.render("Userpage",{User:foundUser});
		}
	});
});


app.get("/admin",isLoggedInn,function(req,res){
	User.find({},function(err,foundUser){
		if(err){
			console.log(err);	
		}
		else{
			visit.find({},function(err,foundvisit){
				if(err){
					console.log(err);
				}
				else{
					Feedback.find({},function(err,foundFeedback){
						if(err){
							console.log(err);
						}
						else{
							res.render("admin",{User:foundUser,Visit:foundvisit,Feedback:foundFeedback});
						}
					});	
				}
			});
		}
	});
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});



app.get("/gates/:id",function(req,res){
	var url = req.url;
	var idd = url.substring(url.lastIndexOf('/') + 1);	
	User.findById(idd,function(err,foundUser){
		if(err || !foundUser){
			//console.log("UserNotFound");
			res.redirect("back");
		}
		else{
				visit.find({"user.id":ObjectId(idd)},function(err,foundvisit){
				if(err || !foundvisit){
				//console.log("UserNotFound");
				res.redirect("back");
				}
				else{
					console.log(foundvisit);
					res.render("gate",{User:foundUser,Visit:foundvisit[0]});
				}
				}
							)};
						   });
	   });


app.post("/users",function(req,res){
	email1=req.body.username;
	name1=req.body.fname;
	building1=req.body.fbuilding;
User.register(new User({username:req.body.username}
					   // {name:req.body.fname},
					   // {building:req.body.fbuilding}
					   ),req.body.password,function(err,user){
	if(err){
	console.log(err);
	req.flash("error", err.message);
		alert(err.message);
			// confirm("User already exixts");
	return res.redirect("/users/new");
	}
	passport.authenticate("local")(req,res,function(){
		req.flash("success","Registered successfully "+email1);
		User.findOneAndUpdate(
		{username:email1},{name:name1,building:building1},function(err,result){
			if(err){
				console.log(err);
			}
			else{
				console.log(result);
			}
		});
		res.redirect("/users");
	});
});	
});





app.post("/checkout/:id",function(req,res){
	var url = req.url;
	var idd = url.substring(url.lastIndexOf('/') + 1);
	// console.log(currentUser);
	Feedback.create({
	camDes:req.body.a,
	clean:req.body.b,
	staff:req.body.c,
	VSM:req.body.d,
	GF:req.body.txfeedback,
	checkOutTime:req.body.Time,		
	egate:req.body.gate,
	userId:idd
	},function(err,newFeedback){
	if(err){
		console.log(err);
	}
		else{
			console.log(newFeedback);
		}
	});
	res.send("ThankYou for your feedback and the visit");
 
});

app.post("/users/login",passport.authenticate("local",{
	successRedirect :"/users",
	failureRedirect:"/users/login",
	failureFlash: true 
}),function(req, res){
	
});

app.post("/admin/login",passport.authenticate("local",{
	successRedirect :"/admin",
	failureRedirect:"/admin/"
}),function(req, res){	
});

app.post("/users/:id",(req,res)=>{
	
	visit.create({
		build:req.body.build,
		user:{
		id:req.user.id
		},
		date:req.body.Date,
		numberOfVisitors:req.body.numberOfVisitors
	},function(err,newvisit){
		if(err){
console.log(err)
		}else{
			 mailinfo=newvisit + "\n" + "UserName:"+ req.user.name + "\n" +  " Verify/Allow User here:  https://wdc-gnquc.run-ap-south1.goorm.io/gatepass/"+req.user.id;
			var mailOptions = {
				  from: 'psgo.hkh@gmail.com',
				  to: 'kashishshah1411@gmail.com',
				  subject: 'Sending Email using Node.js',
				  text: 	mailinfo
	
			};

			transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response);
			  }
			});
			
			res.redirect("/");
		}
	});
	
});

app.post("/gatepass/:id",(req,res)=>{
	
	var url = req.url;
	var idd = url.substring(url.lastIndexOf('/') + 1);
	var allowed;
	if(req.body.ch=="on"){
	allowed=true;
	}
	else{
		allowed=false;
	}
	//  var vi=visit.find({"user.id":ObjectId("5ef0e3a7e3522505c417502f")});
	// console.log(vi);
	visit.findOneAndUpdate({"user.id":ObjectId(idd)},		{isAllowed:allowed,gateNum:req.body.gateno},function(err,foundUser){
		if(err){
			console.log(err);
		}
		else{
			if(allowed===true){
							var mailOptions = {
				  from: 'psgo.hkh@gmail.com',
				  to: 'kashishshah1411@gmail.com',
				  subject: 'Campus Tour',
				  text: "Open link to get your GatePass " + "https://wdc-gnquc.run-ap-south1.goorm.io/gates/"+idd			
	
			};
				transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response);
			  }
			});
			}
			else{
				
				var mailOptions = {
				  from: 'psgo.hkh@gmail.com',
				  to: 'kashishshah1411@gmail.com',
				  subject: 'Campus Visit',
				  text: "Sorry Your request has been rejected for campus tour due to some reason, pls apply again soon or contact to 9999955555"			
	
			};
				transporter.sendMail(mailOptions, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response);
			  }
			});
				
			}
		}
	});
	
	
});
app.post("/gates/:id",function(req,res){
	var url = req.url;
	var idd = url.substring(url.lastIndexOf('/') + 1);
	console.log(idd);
	visit.findOneAndUpdate({"user.id":ObjectId(idd)},	{gname:req.body.gname},function(err,foundguard){
		if(err){
		console.log(err);
		}
		else{
			res.redirect("/gates/:id");
			console.log(foundguard);
		}
	});
});


app.get("*",function(req,res){
	res.send("Congratulations!!");
});


app.listen(process.env.PORT || 3000, process.envIP ,function(){
	console.log("The Server Has Started");
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be Logged In to do that!");
	res.redirect("/users/login");
}
function isLoggedInn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be Logged In to do that!");
	res.redirect("/admin/login");
}

