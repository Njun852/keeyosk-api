const express = require('express')
const router = express.Router()
const controller = require('../controllers/category')

router.get('/all', controller.getAllCategory)
router.get('/', controller.getCategory)
router.post('/', controller.addCategory)
router.put('/', controller.editCategory)
router.delete('/', controller.removeCategory)

module.exports = router