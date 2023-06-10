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

/***************************** 
 * Build inventory management view
*****************************/
invCont.buildManagment = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
    })
}

/******************
 * Build add classification view
 ******************/
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/**********************
 * Process Add classification
 ***********************/
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    
    
    const addClassRes = await invModel.addClassification(classification_name)

    if (addClassRes) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `${classification_name} has been added to classifications.`
        )
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", `Sorry, ${classification_name} could not be added to classifications.`)
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            
        })
    }
}

/******************
 * Build add inventory view
 ******************/
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const select = await utilities.getClassificationToAdd()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        select,
        errors: null,
    })
}

/**********************
 * Process Add Inventory
 ***********************/
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const select = await utilities.getClassificationToAdd()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    
    
    const addInventoryRes = await invModel.addInventory(
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
        )

    if (addInventoryRes) {
        req.flash(
            "notice",
            `${inv_year} ` + `${inv_make} ` + `${inv_model} has been added to inventory.`
            )
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            select,
            errors: null,
        })
    } else {
        req.flash("notice", 
        `Sorry, ${inv_year} ` + `${inv_make} ` + `${inv_model} could not be added to inventory.`
        )
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            
        })
    }
}
module.exports = invCont