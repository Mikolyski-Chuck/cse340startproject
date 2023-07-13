const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accModel = require("../models/account-model")

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
  const vehicle = data
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

/****************
 * Check if an account is already logged in
 ****************/
Util.checkIfLoggedIn = (req, res, next) => {
  if (res.locals.loggedin) {
    req.flash("notice", "An account is already logged in. Please log out before logging in with another account.")
    return res.redirect("/account")
  } else {
    next()
  }
}

/*****************
 * Middleware to check account type
 *****************/
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData.account_type
  if (accountType == "Client") { 
  req.flash("notice", "Access denied")
    return res.redirect("/account/login")
  } else {
    next()
  }

}

/******************
 * Check if messages are unread
*******************/
Util.checkIfUnread = async function(messages) {
  let unreadMessages = []  
  messages.forEach(message => {
      if (!message.message_read) {
          unreadMessages.push(message)
        }
    })
    return unreadMessages
  }

  /******************
 * Check if messages are archived
*******************/
Util.checkIfArchived = async function(messages) {
  let archivedMessages = []  
  messages.forEach(message => {
        if(message.message_archived) {
          archivedMessages.push(message)
        }
    })
    return archivedMessages
  }

/****************
 * Build inbox table
 ****************/
  Util.buildInboxTable = async function(messages) {
    
    // Set up the table labels
    let dataTable = '<table id="inbox">'
    dataTable += '<thead>'
    dataTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'
    dataTable += '</thead>'
    
    // Set up the table body
    dataTable += '<tbody>'
  
    // Iterate over all the messages in the array and put each in a row
    for (let message of messages) {
      let date = new Date(message.message_created)
      let formattedDate = date.toLocaleDateString();
      let formattedTime = date.toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true })
    dataTable += '<tr>'
    dataTable += `<td>${formattedDate} ${formattedTime}</td>`
    dataTable += `<td><a href="/message/read/${message.message_id}" title="Click to view message">${message.message_subject}</a></td>`
    dataTable += `<td>${message.message_from_firstname} ${message.message_from_lastname}</td>`
    dataTable += `<td>${message.message_read}</td>`
    dataTable += '</tr>'
    };
    
    dataTable += '</tbody>'
    dataTable += '</table>'
    
    return dataTable;
    }

/****************
 * Build message view
 ****************/
  Util.buildMessage = async function(message) {
    const date = new Date(message.message_created)
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([],{ hour: 'numeric', minute: '2-digit', hour12: true });
    let messageInfo = "<ul>" 
    messageInfo += `<li class="bold">Subject: <span class="no-bold">${message.message_subject}</span></li>`
    messageInfo += `<li class="bold">From: <span class="no-bold">${message.message_from_firstname} ${message.message_from_lastname}</span></li>`
    messageInfo += `<li class="bold">Sent: <span class="no-bold">${formattedDate} ${formattedTime}</span></li>`
    messageInfo += `<li class="bold">Message: <p class="no-bold" id="message_body">${message.message_body}</p></li>`
    messageInfo += "</ul>"
    return messageInfo
    }
/*****************
* Build account select
******************/
Util.getAccountToAdd = async function (selectedAccount) {
  let data = await accModel.getAccounts()
  let list = '<select name="message_to" id="message_to" required>'
  list += '<option value="">Select Account</option>'
  data.rows.forEach((row) => {
    let selected = ""
    if (selectedAccount == row.account_id) {
      selected = "selected"
    }
    list += '<option value="' + row.account_id + '" ' + selected + '>' + row.account_firstname + " " + row.account_lastname + '</option>';
  });   
    list += '</select>'
  return list
}

/*****************
* Build account select for reply
******************/
Util.getAccountForReply = async function (selectedAccount) {
  let data = await accModel.getAccountById(selectedAccount)
  let list = '<select name="message_to" id="message_to" required>'
  const selected = "selected"
  list += '<option value="' + data.account_id + '" ' + selected + '>' + data.account_firstname + " " + data.account_lastname + '</option>';
  list += '</select>'
  return list
}

module.exports = Util