const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl}=require("../middleware.js");

const userController = require("../controllers/users.js");

//for signup
router.get("/signup",userController.renderSignupForm);
router.post(
    "/signup",
    wrapAsync(userController.signup)
);

//for login
router.get("/login",userController.renderLoginForm);
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
    }),
    userController.login
);

//for log out
router.get("/logout",userController.logout);

module.exports = router;