const invModel = require("../models/inventory-model")
const Util = {}

/* *************************
 * Constrsucts the nav HTML unordered list
 *************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home Page">Home</a></li>'
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
    });
    list += "</ul>"
    return list
}

/* *************************
 * Constrsucts the select options for the add invetory form
 *************************** */
Util.getClassificationToAdd = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classification_id" required>'
  list += '<option value="">Select Classification</option>'
  data.rows.forEach((row) => {
    list += '<option value="'+ row.classification_id + '">' + row.classification_name +'</option>'
    });
  list += '</select>'
  return list
}

/* ******************************************
 * Build the classification view HTML
 * ****************************************** */
Util.buildClassificationGrid = async function(data){
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + ' details"><img src="' + vehicle.inv_thumbnail
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
      + ' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      +vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* *************************
* Build Model Grid
****************************/
Util.buildModelGrid = async function(data){ 
  const vehicle = data[0]
  let grid = '<section id="vehicle-cont">' 
  grid += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
  + ' on CSE Motors">'
  grid += '<div id="detail-cont">'
  grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + " Details" + '</h2>'
  grid += '<ul id="vehicle-details">'
  grid += '<li>' + '<span class="bold">' + "Price: " + '</span>' + "$" + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
  grid += '<li>' + '<span class="bold">' + "Description: " + '</span>' + vehicle.inv_description + '</li>'
  grid += '<li>' + '<span class="bold">' + "Color: " + '</span>' + vehicle.inv_color + '</li>'
  grid += '<li>' + '<span class="bold">' + "Miles: " + '</span>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>'
  grid += '</ul>'
  grid += '</div>'
  grid += '</section>'
  return grid
}

/* **********************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 * ********************************* */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util