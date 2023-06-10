const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/* ************************
 * Add Classification Data Validation Rules
 * ************************ */

validate.addClassificationRules = () => {
    return [
        
        //A classification is required, must be only alphabetic characters and must not already exist in DB.
        body("classification_name")
        .trim()
        .isLength({ min: 1})
        .withMessage("Please include a new classification.")
        .isAlphanumeric()
        .withMessage("Please use alphabetic characters.")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists){
                throw new Error("Classification already exists. Please only add new classifications.")
            }
        }),

    ]
}

/* *********************
 * Check data and return errors or continue to add classification
 * ********************* */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
    return
    }
    next()
}

/* ************************
 * Add Inventory Data Validation Rules
 * ************************ */

validate.addInventoryRules = () => {
    return [
        
        //Vehicle make is required and must be only alphabetic characters
        body("inv_make")
        .trim()
        .isLength({ min: 3})
        .withMessage("Please include vehicle make")
        .isAlphanumeric()
        .withMessage("Vehicle make can only be alphabetic characters."),

        //Vehicle model is required
        body("inv_model")
        .trim()
        .isLength({ min: 2})
        .withMessage("Please include a vehicle model"),

        //Vehicle year is required and must be a number consisting of 4 digits
        body("inv_year")
        .trim()
        .isLength({ min: 4, max: 4})
        .withMessage("Please include a vehicle year.")
        .isInt()
        .withMessage("Vehicle year must only consist of only numbers."),
        
        //Vehicle description is required
        body("inv_description")
        .trim()
        .isLength({min: 1, max: 200})
        .withMessage("Please add a vehicle description."),
        
        //Vehicle image path is required
        body("inv_image")
        .trim()
        .isLength({min: 1})
        .withMessage("Please include a vehicle image path."),
        
        //Vehicle thumbnail image path is required
        body("inv_thumbnail")
        .trim()
        .isLength({min: 1})
        .withMessage("Please include a vehicle thumbnail image path."),

        //Vehicle price is required and must be an integer
        body("inv_price")
        .trim()
        .isLength({min: 1})
        .withMessage("Please include vehicle price.")
        .isInt()
        .withMessage("Price must be an integer."),

        //Vehicle miles is required and must be an integer
        body("inv_miles")
        .trim()
        .isLength({min: 1})
        .withMessage("Please include vehicle miles.")
        .isInt()
        .withMessage("Miles must only include whole numbers."),

        //Vehicle color is required
        body("inv_color")
        .trim()
        .isLength({min: 3})
        .withMessage("Please include vehicle color."),

        //Vehicle classification is required
        body("classification_id")
        .trim()
        .isLength({min: 1})
        .isInt()
        .withMessage("Please include classification category.")
    ]
}


/* *********************
 * Check data and return errors or continue to add inventory
 * ********************* */
validate.checkAddInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const select = await utilities.getClassificationToAdd()
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            select,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
        })
    return
    }
    next()
}

module.exports = validate