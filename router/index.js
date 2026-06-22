const router = require("express").Router();
const userRouter = require("./userRoutes");
const cartRoutes = require("./cartRoutes");


router.use("/users",userRouter);
router.use("/carts",cartRoutes);

module.exports = router;