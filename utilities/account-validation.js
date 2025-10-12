const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // email is required
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),
        
        // password is required and must be a strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage("Password does not meet requirements.")
    ];
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = utilities.getNav();
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email
        });
        return;
    }
    next();
}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be a string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        
        // lastname is required and must be a string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // email is required and must not already exsist in the Database
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExsists = await accountModel.checkExsistingEmail(account_email);
                if (emailExsists) {
                    throw new Error("Email already exsists. Please log in or use a different email.");
                }
            }),
        
        // password is required and must be a strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage("Password does not meet requirements.")
    ];
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = utilities.getNav();
        res.render("account/register", {
            errors,
            title: "Sign Up",
            nav,
            account_firstname,
            account_lastname,
            account_email
        });
        return;
    }
    next();
}

/*  **********************************
 *  Update Data Validation Rules
 * ********************************* */
 async function updateRules(req) {
    const { account_id } = req.body;
    return [
        // firstname is required and must be a string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        
        // lastname is required and must be a string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // email is required and must not match the email of a different account
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const oldInfo = await accountModel.getAccountById(account_id);
                if(account_email != oldInfo.account_email) {
                    const emailExsists = await accountModel.checkExsistingEmail(account_email);
                    if (emailExsists) {
                        throw new Error("Email already exsists. Please log in or use a different email.");
                    }
                }
            })
    ];
}

/* ******************************
 * Check data and return errors or continue to updating
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    updateRules(req);
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email
        });
        return;
    }
    next();
}

/*  **********************************
 *  Password Change Validation Rules
 * ********************************* */
validate.passwordRules = () => {
    return [
        // password is required and must be a strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage("Password does not meet requirements.")
    ];
}

/* ******************************
 * Check data and return errors or continue to changing password
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = utilities.getNav();
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email
        });
        return;
    }
    next();
}

/* ******************************
 * Check data and return errors or continue to editing
 * ***************************** */
validate.checkEditData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email, account_type } = req.body;
    let errors = [];
    updateRules(req);
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let typeSelect = await utilities.buildAccountTypeSelect(account_type);
        res.render("account/list/edit", {
            errors,
            title: "Account Editor",
            nav,
            typeSelect,
            account_id,
            account_firstname,
            account_lastname,
            account_email
        });
        return;
    }
    next();
}

module.exports = validate;