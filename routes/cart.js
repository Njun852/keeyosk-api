const express = require("express");
const router = express.Router();
const controller = require("../controllers/cart");

router.get("/:id", controller.getCart);
router.post("/", controller.addCart);
router.put("/:id", controller.editCart);
router.delete("/:id", controller.removeCart);

router.get("/all/:id", controller.getAllCart);
module.exports = router;
