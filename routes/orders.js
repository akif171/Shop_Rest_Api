const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const {
  get_All_Orders,
  create_Order,
  get_Single_Order,
  delte_Order,
} = require("../controller/orders");

//Get all Orders
router.get("/", checkAuth, get_All_Orders);

//Create a Orders
router.post("/", checkAuth, create_Order);

//Get a single Order by ID
router.get("/:orderId", checkAuth, get_Single_Order);

//Delete a Order
router.delete("/:orderId", checkAuth, delte_Order);

module.exports = router;
