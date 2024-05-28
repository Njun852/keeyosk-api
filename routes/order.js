const express = require("express");
const router = express.Router();
const controller = require("../controllers/order");

router.get("/all", controller.getAllOrders);
router.put("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);
router.post("/", controller.addOrder);
router.get("/:id", controller.getOrder);

module.exports = router;
