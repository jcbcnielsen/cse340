const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
let accountCont = {};

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    });
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.loginAccount = async function (req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        });
        return;
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600000 });
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000, secure: true });
            }
            return res.redirect("/account/");
        } else {
            req.flash("notice", "Please check your credentials and try again.");
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email
            });
        }
    } catch (error) {
        throw new Error("Access Forbidden");
    }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegistration = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Sign Up",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav();
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
    } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", "Sorry, there was an error prossessing the request.");
        res.status(500).render("account/register", {
            title: "Sign Up",
            nav,
            errors: null
        });
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`);
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        });
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
            title: "Sign Up",
            nav,
            errors: null
        });
    }
}

/* ****************************************
*  Build the account management view
* *************************************** */
accountCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/manage", {
        title: "Your Account",
        nav,
        errors: null
    })
}

/* ****************************************
*  Build the account info update view
* *************************************** */
accountCont.buildUpdate = async function (req, res, next) {
    let nav = await utilities.getNav();
    const account_id = req.params.account_id;
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email

    });
}

/* ****************************************
*  Process account updates
* *************************************** */
accountCont.updateAccount = async function (req, res) {
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email
    } = req.body;
    const updResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    );

    let nav = await utilities.getNav();
    if (updResult) {
        req.flash("notice", "Your account information has been updated.");
        res.status(201).render("account/manage", {
            title: "Your Account",
            nav,
            errors: null
        });
    } else {
        req.flash("notice", "Sorry, updating your account information failed.");
        res.status(501).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id: account_id,
            account_firstname: account_firstname,
            account_lastname: account_lastname,
            account_email: account_email
        });
    }
}

/* ****************************************
*  Process password changes
* *************************************** */
accountCont.changePassword = async function (req, res) {
    const { account_id, account_password } = req.body;
    const accountData = await accountModel.getAccountById(account_id);
    let nav = await utilities.getNav();

    // Hash the password before storing
    let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", "Sorry, there was an error prossessing the request.");
        res.status(500).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id: account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email
        });
    }

    const changeResult = await accountModel.changePassword(
        account_id,
        hashedPassword
    );

    if (changeResult) {
        req.flash("notice", "Your password has been changed.");
        res.status(201).render("account/manage", {
            title: "Your Account",
            nav,
            errors: null
        });
    } else {
        req.flash("notice", "Sorry, changing your password failed.");
        res.status(501).render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id: account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email
        });
    }
}

/* ****************************************
*  Log out of the account
* *************************************** */
accountCont.logoutAccount = async function (req, res, next) {
    if (req.cookies.jwt) {
        res.clearCookie("jwt");
        res.redirect("/");
    }
}

/* ****************************************
*  Build the client account list and manager view
* *************************************** */
accountCont.buildAccountList = async function (req, res, next) {
    let nav = await utilities.getNav();
    let accountTable = await utilities.buildAccountListTable(res.locals.adminAuth);
    res.render("account/list", {
        title: "Account Manager",
        nav,
        errors: null,
        accountTable
    })
}

/* ****************************************
*  Build the system account editor view
* *************************************** */
accountCont.buildAccountEditor = async function (req, res, next) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.params.account_id);
    if (accountData.account_type == "Client" || res.locals.adminAuth) {
        let typeSelect = await utilities.buildAccountTypeSelect(accountData.account_type);
        res.render("account/edit", {
            title: "Account Editor",
            nav,
            typeSelect,
            errors: null,
            account_id: req.params.account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_type: accountData.account_type
        });
    } else {
        res.redirect("/account/list");
    }
}

/* ****************************************
*  Process editing accounts
* *************************************** */
accountCont.editAccount = async function (req, res) {
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email
    } = req.body;
    let { account_type } = req.body;
    if (!account_type) {
        const oldData = await accountModel.getAccountById(account_id);
        account_type = oldData.account_type;
    }

    const editResult = await accountModel.editAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email,
        account_type
    );

    let nav = await utilities.getNav();
    if (editResult) {
        let accountTable = await utilities.buildAccountListTable(res.locals.adminAuth);
        req.flash("notice", "The account information has been edited.");
        res.status(201).render("account/list", {
            title: "Account Manager",
            nav,
            errors: null,
            accountTable
        });
    } else {
        let typeSelect = await utilities.buildAccountTypeSelect(account_type);
        req.flash("notice", "Sorry, editing the account information failed.");
        res.status(501).render("account/edit", {
            title: "Account Editor",
            nav,
            errors: null,
            typeSelect,
            account_id: account_id,
            account_firstname: account_firstname,
            account_lastname: account_lastname,
            account_email: account_email,
            account_type: account_type
        });
    }
}

/* ****************************************
*  Process deleting accounts
* *************************************** */
accountCont.deleteAccount = async function (req, res) {
    const { account_id } = req.body;
    const accountData = await accountModel.getAccountById(account_id);
    const delResult = await accountModel.deleteAccount(account_id);

    let nav = await utilities.getNav();
    if (delResult) {
        let accountTable = await utilities.buildAccountListTable(res.locals.adminAuth);
        req.flash("notice", "The account has been deleted.");
        res.status(201).render("account/list", {
            title: "Account Manager",
            nav,
            errors: null,
            accountTable
        });
    } else {
        let typeSelect = await utilities.buildAccountTypeSelect(account_type);
        req.flash("notice", "Sorry, deleting the account failed.");
        res.status(501).render("account/edit", {
            title: "Account Editor",
            nav,
            errors: null,
            typeSelect,
            account_id: account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_type: accountData.account_type
        });
    }
}

module.exports = accountCont;