const express = require('express')
const router = express.Router();
const controller = require('../controllers/productOption')

router.post('/', controller.addProductOption)
router.put('/:id', controller.editProductOption)
router.delete('/:id', controller.deleteProductOption)
module.exports = router