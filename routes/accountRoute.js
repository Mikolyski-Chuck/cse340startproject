// Needed Resources
const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

//Route to build account management view
router.get("/", 
utilities.checkLogin,
utilities.handleErrors(accController.buildAccountManagement))

//Route to build account view
router.get("/login", 
utilities.checkIfLoggedIn,
utilities.handleErrors(accController.buildLogin))

//Route to build registration view
router.get("/register", utilities.handleErrors(accController.buildRegister))

//Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

//Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
    )


//Process the log out request 
router.get("/logout", utilities.handleErrors(accController.logOutAccount))

//route to build account update view
router.get("/update/:accountId", 
utilities.checkLogin,
utilities.handleErrors(accController.updateAccountView))

//route to process the account update form request
router.post("/update", 
utilities.checkLogin,
regValidate.updateRules(),
regValidate.checkUpdateData,
utilities.handleErrors(accController.updateAccount))

//route to process the accout password form request
router.post("/update/password",
utilities.checkLogin,
regValidate.updatePasswordRules(),
regValidate.checkUpdatePassword,
utilities.handleErrors(accController.updatePassword))

module.exports = router;
