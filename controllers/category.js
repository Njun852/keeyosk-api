const db = require('../db')

async function addCategory(req, res) {
    const category = req.body
    try {
        const [results] = await db.query('INSERT INTO category(category_id, category_name) VALUES (?, ?)', 
        [category.category_id, category.category_name])
        res.json({success: true, message: "Added Category"})
    } catch (e ) {
        res.send(400)
    }
}

async function editCategory(req, res) {
    const newData = req.body.new_data
    const id = req.body.category_id

    try {
        const [results] = await db.query('UPDATE category SET category_name = ? WHERE category_id = ?'
        , [newData.category_name, id])
        res.json({success: true, message: "Updated category"})
    } catch(e) {
        res.send(400)    
    }
}

async function removeCategory(req, res) {
    const id = req.body.category_id 
    try {
        const [results] = await db.query("DELETE FROM category WHERE category_id = ?", [id])
        res.json({success: true, message: "Removed Category"})
    } catch(e) {
        res.send(400)
    }
}

async function getCategory(req, res) {
    const id = req.body.category_id
    try {
        const [results] = await db.query("SELECT * FROM category WHERE category_id = ?", [id])
        res.json({success: true, message: "Got Category", data: results})
    } catch(e) {
        res.send(400)

    }
}

async function getAllCategory(req, res) {
    try {
        const [results] = await db.query('SELECT * FROM category')
        res.json({success: true, message: "Got all categories", data: results})
    } catch {
        res.send(400)
    }
}

module.exports = {getAllCategory, getCategory, removeCategory, addCategory, editCategory}