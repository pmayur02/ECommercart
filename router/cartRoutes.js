const express = require("express");
const cartRoutes = express.Router();
const cartController = require("../controller/cartController");
const {itemSchema, checkoutSchema, removeItemSchema} = require("../utilities/validation");
const {validate} = require("../middleware/validationMiddleware");
const {authenticateUser} = require("../middleware/authMiddleware")

cartRoutes.post("/items", authenticateUser, validate(itemSchema, "body"), cartController.addItemToCart);
cartRoutes.delete("/items/:userId/:productId", authenticateUser, validate(removeItemSchema, "params"), cartController.removeItemFromCart);
cartRoutes.get("/checkout/:userId", authenticateUser, validate(checkoutSchema, "params"), cartController.checkout);

module.exports = cartRoutes;