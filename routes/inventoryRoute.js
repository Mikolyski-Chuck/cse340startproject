// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationAndInventoryValidate = require('../utilities/inventory-validation')

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

//Route to build inventory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByModelId))

//Route to management inventory
router.get("/", 
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.buildManagment))

//Route to add classification
router.get("/add-classification",
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.buildAddClassification))

//Process the classification data
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    classificationAndInventoryValidate.addClassificationRules(),
    classificationAndInventoryValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
    )

//Route to add inventory
router.get("/add-inventory", 
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.buildAddInventory))

//Process the add inventory data
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    classificationAndInventoryValidate.addInventoryRules(),
    classificationAndInventoryValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
    )

//route to get management JSON
router.get("/getInventory/:classification_id", 
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.getInventoryJSON))

//route to build edit inventory view
router.get("/edit/:inventoryId", 
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.buildInventoryEditView))

// Process the update inventory
router.post("/update/", 
utilities.checkLogin,
utilities.checkAccountType,
classificationAndInventoryValidate.addInventoryRules(),
classificationAndInventoryValidate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))

//route to build delete inventory view
router.get("/delete/:inventoryId", 
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.buildInventoryDeleteView))

//Process the delete inventory
router.post("/delete/", 
utilities.checkLogin,
utilities.checkAccountType,
utilities.handleErrors(invController.deleteInventory))

module.exports = router;