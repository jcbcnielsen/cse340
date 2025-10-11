// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/manage", utilities.handleErrors(invController.buildManagementView));

// Route to build the view to add a classification
router.get("/add-class", utilities.handleErrors(invController.buildClassAddition));

// Route to post the classification addition form
router.post(
    "/add-class",
    invValidate.classificationRules(),
    invValidate.checkClassAddData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build the view to add an inventory item
router.get("/add-inv", utilities.handleErrors(invController.buildInvAddition));

// Route to post the inventory addition form
router.post(
    "/add-inv",
    invValidate.inventoryRules(),
    invValidate.checkInvAddData,
    utilities.handleErrors(invController.addInventory)
);

// Route to get JSON data for inventory with a given classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInvJSON));

// Route to edit the data for an inventory item with a given inv_id
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildInvEditor));

// Route to post the inventory editing form
router.post(
    "/edit/",
    invValidate.inventoryRules(),
    invValidate.checkInvEditData,
    utilities.handleErrors(invController.editInventory)
);

module.exports = router;