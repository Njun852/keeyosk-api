const express = require("express");
const router = express.Router();
const controller = require("../controllers/product");

router.get("/all", controller.getAllProduct);
router.get('/:id', controller.getProduct)
router.post("/", controller.addProduct);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
