const authRouter = require("express").Router()
const validate = require("../middlewares/validator.middlewares")

const authController = require("../controllers/auth.controller")


authRouter.post("/register",  authController.register)
authRouter.post("/login", validate("authLogin"), authController.login)


module.exports = authRouter

