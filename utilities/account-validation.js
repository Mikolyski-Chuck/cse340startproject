const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accModel = require("../models/account-model")

/* ************************
 * Registration Data Validation Rules
 * ************************ */

validate.registrationRules = () => {
    return [
        //firstname is required and must be a string
        body("account_firstname")
        .trim()
        .isLength({ min: 1})
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be a string
        body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), //on error this message is sent.

        //valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
            }
        }),

        //password is required and must be a strong password
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* *********************
 * Check data and return errors or continue to registration
 * ********************* */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
    return
    }
    next()
}

/* ******************
 * Login data validation rules
******************** */
validate.loginRules = () => {
    return [

        //valid email is required
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
        
        //password is required and must exist.
        body("account_password")
        .trim()
        .isLength({min: 1})
        .withMessage("Please enter a password."),
    ]
}

/* *********************
 * Check data and return errors or continue to login
 * ********************* */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
    return
    }
    next()
}

/* ************************
 * Update Account Data Validation Rules
 * ************************ */
validate.updateRules = () => {
     
    return [
        //account id is required and must be an integer
        body("account_id")
        .trim()
        .isInt(),
        
        //firstname is required and must be a string
        body("account_firstname")
        .trim()
        .isLength({ min: 1})
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be a string
        body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), //on error this message is sent.

        //valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email, {req}) => {
            const currentAccount = await accModel.getAccountById(req.body.account_id)
            if (account_email != currentAccount.account_email) {
                const emailExists = await accModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email already exists under a different account.")
            }
            }
        }),
    ]
}

/* *********************
 * Check data and return errors or continue to account update
 * ********************* */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
    return
    }
    next()
}


/*******************
 * Update account password rules
 *******************/
validate.updatePasswordRules = () => {
    return [

        //account id is required and must be an integer
        body("account_id")
        .trim()
        .isInt(),

        //password is required and must be a strong password
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* *********************
 * Check data and return errors or continue to account password update
 * ********************* */
validate.checkUpdatePassword = async (req, res, next) => {
    const { account_id } = req.body
    
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountInfo = await accModel.getAccountById(account_id)
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            account_firstname: accountInfo.account_firstname,
            account_lastname: accountInfo.account_lastname,
            account_email: accountInfo.account_email,
            account_id,
            
        })
    return
    }
    next()
}

module.exports = validate
