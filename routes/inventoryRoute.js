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
router.get("/", utilities.handleErrors(invController.buildManagment))

//Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

//Process the classification data
router.post(
    "/add-classification",
    classificationAndInventoryValidate.addClassificationRules(),
    classificationAndInventoryValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
    )

//Route to add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

//Process the add inventory data
router.post(
    "/add-inventory",
    classificationAndInventoryValidate.addInventoryRules(),
    classificationAndInventoryValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
    )

//route to get management JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//route to build edit inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildInventoryEditView))

// Process the update inventory
router.post("/update/", 
classificationAndInventoryValidate.addInventoryRules(),
classificationAndInventoryValidate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))

//route to build delete inventory view
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildInventoryDeleteView))

//Process the delete inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;