const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {}

/* ******************************
 * Classification Addition Validation Rules
 * ***************************** */
validate.classificationTools = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .custom(async (classification_name) => {
                            const classExsists = await invModel.checkExsistingClass(classification_name);
                            if (classExsists) {
                                throw new Error("Classification already exsists.");
                            }
                        })
    ];
}

/* ******************************
 * Check data and return errors or continue to adding a new classification
 * ***************************** */
validate.checkClassAddData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        });
        return;
    }
    next();
}

/* ******************************
 * Inventory Addition Validation Rules
 * ***************************** */
validate.inventoryTools = () => {
    const nextYear = new Date().getFullYear() + 1;
    return [
        // classification id is required and must be an int
        body("classification_id")
            .isInt()
            .withMessage("Please provide a classification."),
        
        // make is required and must be a string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha()
            .isLength({ min: 1 })
            .withMessage("Please provide a make."),

        // model is required and must be a string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha()
            .isLength({ min: 1 })
            .withMessage("Please provide a model."),

        // year is required and must be an int between 1900 and the current year
        body("inv_year")
            .isInt({ min: 1900, max: nextYear })
            .withMessage(`Please provide a year between 1900 and ${nextYear}.`),

        // description is required and must be a string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),

        // image url is required and must be a string
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide an image url."),

        // thumbnail url is required and must be a string
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide an thumbnail url."),
        
        // price is required and must be a number
        body("inv_price")
            .isInt()
            .withMessage("Please provide a price."),
        
        // miles is required and must be a number
        body("inv_miles")
            .isInt()
            .withMessage("Please provide a milage."),

        // color is required and must be a string
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a color.")
    ];
}

/* ******************************
 * Check data and return errors or continue to adding new inventory
 * ***************************** */
validate.checkInvAddData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classSelect = await utilities.buildClassificationList(classification_id);
        const nextYear = new Date().getFullYear() + 1;
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory Item",
            nav,
            classSelect,
            nextYear,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
        return;
    }
    next();
}

module.exports = validate;