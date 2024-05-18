const express = require('express')
const router = express.Router()
const controller = require('../controllers/product')

router.get('all', controller.getAllProduct)
router.get('/:id', controller.getProduct)
router.post('/', controller.addProduct)
router.put('/', controller.updateProduct)
router.delete('/', controller.deleteProduct)

module.exports = router
