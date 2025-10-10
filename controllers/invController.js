const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);
  const carName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  const details = await utilities.buildDetailView(data, carName);
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: carName,
    nav,
    details
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/manage", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build classification addition view
 * ************************** */
invCont.buildClassAddition = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Proccess adding classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addResult = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();
  if (addResult) {
    req.flash("notice", `${classification_name} has been added to the list of classifications.`);
    res.status(201).render("inventory/manage", {
      title: "Inventory Management",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, adding that classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Build inventory addition view
 * ************************** */
invCont.buildInvAddition = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classSelect = await utilities.buildClassificationList();
  const nextYear = new Date().getFullYear() + 1;
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classSelect,
    nextYear,
    errors: null
  })
}

/* ***************************
 *  Proccess adding inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  const { inv_make, inv_model, inv_year } = req.body;
  const addResult = await invModel.addInventory(req.body);
  let nav = await utilities.getNav();
  const classSelect = await utilities.buildClassificationList();
  const nextYear = new Date().getFullYear() + 1;
  if (addResult) {
    req.flash("notice", `${inv_year} ${inv_make} ${inv_model} has been added to the inventory.`);
    res.status(201).render("inventory/manage", {
      title: "Inventory Management",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, adding that inventory item failed.");
    req.status(501).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      classSelect,
      nextYear,
      errors: null
    });
  }
}

module.exports = invCont