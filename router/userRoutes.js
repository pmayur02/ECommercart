const userRouter = require("express").Router();
const userController = require("../controller/userController");
const {userRegisterSchema,userLoginSchema} = require("../utilities/validation")
const {validate} = require("../middleware/validationMiddleware");



userRouter.post("/register-user",validate(userRegisterSchema,"body"),userController.registerUser);
userRouter.post("/login",validate(userLoginSchema,"body"),userController.login);

module.exports = userRouter;