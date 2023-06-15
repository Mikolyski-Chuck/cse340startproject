const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
 * Constructs the select options for the add invetory form
 *************************** */
Util.getClassificationToAdd = async function (selectedClassification, req, res, next) {
  let data = await invModel.getClassifications()
  
  let list = '<select name="classification_id" id="classification_id" required>'
  list += '<option value="">Select Classification</option>'
  data.rows.forEach((row) => {
    let selected = ""
    if (selectedClassification == row.classification_id) {
      selected = "selected"
    }
    list += '<option value="' + row.classification_id + '" ' + selected + '>' + row.classification_name + '</option>';
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

/*********************
 * Middleware to check token validity
 *********************/
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/*********************
 * Check Login
 *********************/
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}
module.exports = Util