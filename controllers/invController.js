const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ************
 * Build inventory by classification view
 * ***************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid (data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/*******************************
 * Build inventory by inventory view
 *******************************/
invCont.buildByModelId = async function (req, res, next) {
    const model_id = req.params.inventoryId
    const data = await invModel.getModelById(model_id)
    const grid = await utilities.buildModelGrid (data)
    let nav = await utilities.getNav()
    const vehicle = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/inventory.ejs", {
        title: vehicle,
        nav,
        grid,
    })
}

module.exports = invCont