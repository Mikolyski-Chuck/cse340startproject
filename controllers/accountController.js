const utilities = require("../utilities")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Deliver login view
 * *********************** */

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************
 * Deliver registration view
* ************************ */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* *********************
* Process Registration
* ********************* */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
     res.status(500).render("account/register", {
          title: "Registration",
          nav,
          errors: null,
     })
    }
    
    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered, ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/***********************
 * Process login request
 ***********************/
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const {account_email, account_password} = req.body
    const accountData = await accModel.getAccountByEmail(account_email)
    
    if(!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
           title: "Login",
           nav,
           errors:null,
           account_email, 
        })
    return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
            return res.redirect("/account/")
        }
    }catch (error) {
        return new Error('Access Forbidden')
    }
}
/* ****************************
 * Deliver login management view
* ************************ */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Manage Account",
        nav,
        errors: null,
    })
}

/*******************
 * Process account log out
 *******************/
async function logOutAccount(req, res, next) {
    res.clearCookie("jwt")
    res.redirect("/")
}

/********************
 * Deliver the account update view
 ********************/
async function updateAccountView(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = parseInt(req.params.accountId)
    const accountInfo = await accModel.getAccountById(account_id)
    res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: account_id,
        account_firstname: accountInfo.account_firstname,
        account_lastname: accountInfo.account_lastname,
        account_email: accountInfo.account_email


    })
}

/********************
 * Process the account update request
 ********************/
async function updateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    
    const updateResult = await accModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
        )

    if (updateResult) {
        req.flash(
            "notice",
            "Account successfully updated."
            )
            res.clearCookie("jwt")
            const accountData = await accModel.getAccountByEmail(account_email)
            
            if(accountData) {
            try {
                    delete accountData.account_password
                    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
                    res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000 })
                    res.redirect("/account/")
                
            }catch (error) {
                throw new Error('Unable to Process account update at this time. Try back later.')
            }
        }
    } else {
        req.flash("notice", "Sorry, the insert failed." 
        )
        res.status(501).render("./account/update", {
            title: "Update Error",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    }
}

/********************
 * Process the account password update request
 ********************/
async function updatePassword(req, res, next) {
    const { account_id, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password.')
     res.status(500).redirect("/account")
    }
    
    
    const updateResult = await accModel.updatePassword(
        hashedPassword,
        account_id
        )

    if (updateResult) {
        req.flash(
            "notice",
            `Password was successfully updated.`
            )
        res.status(201).redirect("/account")
    } else {
        req.flash("notice", "Sorry, the insert failed." 
        )
        res.status(501).redirect("/account/update/"+account_id)
    }
    
    
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, logOutAccount, updateAccountView, updateAccount, updatePassword }