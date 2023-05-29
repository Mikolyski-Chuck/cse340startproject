const pool = require("../database/")

/* *************************
 * Get all the classification data
 * ************************* */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ****************************
 * Get all inventory items and classification_name by classification_id
 * **************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.log("getclassificationbyid error " + error)
    }
}

/* ****************************
* Get inventory details by inventory_id
* ****************************/

async function getModelById(model_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory WHERE inv_id = $1",
            [model_id]
        )
        return data.rows
    } catch (error) {
        console.log("getclassificationbyid error " + error)
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getModelById};