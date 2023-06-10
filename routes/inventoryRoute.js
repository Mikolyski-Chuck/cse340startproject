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


module.exports = router;