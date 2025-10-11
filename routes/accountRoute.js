// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/");
const accountValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to post the login form
router.post(
    "/login",
    accountValidate.loginTools(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Route to post the registration form
router.post(
    "/register",
    accountValidate.registrationTools(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Route to build the account manager view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

module.exports = router;