const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function(data, carName){
  /*
    inv_id: 11,
    inv_make: 'Mechanic',
    inv_model: 'Special',
    inv_year: '1964',
    inv_description: 'Not sure where this car came from. however with a little tlc it will run as good a new.',
    inv_image: '/images/vehicles/mechanic.jpg',
    inv_thumbnail: '/images/vehicles/mechanic-tn.jpg',
    inv_price: '100',
    inv_miles: 200125,
    inv_color: 'Rust',
    classification_id: 5,
    classification_name: 'Sedan'
  */
  let details;
  if (data.inv_id != null) {
    const currency = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", currencyDisplay: "narrowSymbol"});
    const plainNumber = new Intl.NumberFormat("en-US");
    details = `<div id="detailPageContent">`; // Begin detailPageContent
    details += `<img id="carPic" src="${data.inv_image}" alt="carName">`;
    details += `<div id="carDetails"><h1>${carName}</h1>`; // Begin carDetails
    details += `<div id="detailHighlights"><div id="carMilage"><h2>Milage</h2>
      <p>${plainNumber.format(data.inv_miles)}</p></div>`; // Begin detailHighlights
    details += `<div id="carPrice"><h2>Price</h2>
      <p>${currency.format(data.inv_price)}</p></div></div>`; // End detailHighlights
    details += `<p id="carDesc">${data.inv_description}</p>`;
    details += `<ul id="detailList"><li><strong>Milage:</strong> ${plainNumber.format(data.inv_miles)}</li>`; // Begin detailList
    details += `<li><strong>Year:</strong> ${data.inv_year}</li>`;
    details += `<li><strong>Make:</strong> ${data.inv_make}</li>`;
    details += `<li><strong>Model:</strong> ${data.inv_model}</li>`;
    details += `<li><strong>Color:</strong> ${data.inv_color}</li>`;
    details += `<li><strong>Class:</strong> ${data.classification_name}</li></ul>`; // End detailList
    details += `</div>`; // End carDetails
    details += `</div>`; // End detailPageContent
  } else {
    details += `<p class="notice">Sorry, no vehicle was found.</p>`;
  }
  return details;
}

/* **************************************
* Build the classification select HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util