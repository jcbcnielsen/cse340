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
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Route to post the registration form
router.post(
    "/register",
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Route to build the account manager view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement)
);

// Route to build the account update view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdate)
);

// Route to post the account info update form
router.post(
    "/update/",
    utilities.checkLogin,
    accountValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
);

// Route to post the change password form
router.post(
    "/change-pw/",
    utilities.checkLogin,
    accountValidate.passwordRules(),
    accountValidate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
);

// Route to log out
router.get(
    "/logout",
    utilities.checkLogin,
    utilities.handleErrors(accountController.logoutAccount)
);

module.exports = router;