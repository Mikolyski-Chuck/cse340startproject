const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

baseController.five00error = async function (req, res){
    throw new Error("This is an 500 error")
}

module.exports = baseController