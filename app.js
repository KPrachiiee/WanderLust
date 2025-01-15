if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose= require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


//const MONGO_URL = "mongodb://127.0.0.1:27017/airnub";
const dbUrl ='mongodb+srv://Prachi_k:Prachi@123@cluster0.lca7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log(dbUrl);
console.log(dbUrl);

async function main()
{
    await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("Connected to DB");
    console.log(res);
})
.catch(err=>{
    console.log(err);
});



// main()
//   .then(() => {
//     console.log("connected to DB");
// })
//    .catch(err => {
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect(dbUrl);
   
// }

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded ({extended:true}));
app.use(methodOverride ("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,  //in ms
        httpOnly:true, // for security, search crossScripting
    },
};

// app.get("/",(req,res) => {
//     res.send("Hi ,, I am root");
// });

//using flash 
app.use(session(sessionOptions));
app.use(flash());

// session mw should be executed before this line, as it requires session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); //create route in listing.js and index.ejs
    res.locals.error= req.flash("error");
    res.locals.currUser=req.user;//to pass user info to ejs file, as req.user is not accessible in ejs directly.
    next();
});

// app.get("/demouser",async (req,res) =>{
//     let fakeUser = new User({
//         email:"Demo@gmail.com",
//         username:"Delta-student",
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send( registeredUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);



// for non-existing route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//client side error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong !"}=err;
    res.render("error.ejs" ,{message});
    //res.status(statusCode).send(message);
});

app.listen(8080,() => {
    console.log("server is listening to port 8080");
});


