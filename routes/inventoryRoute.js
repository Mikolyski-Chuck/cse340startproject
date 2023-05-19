// Needed Resources
const express = require("express")
const router = new express.Router()
const invControllor = require("../controllers/invController")

//Route to build inventory by classification view
router.get("/type/:classificationId", invControllor.buildByClassificationId);

module.exports = router;