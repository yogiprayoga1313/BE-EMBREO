const profileRouter = require("express").Router()
const authMiddleware = require("../middlewares/auth.middlewares")
const profileController = require("../controllers/profile.controller")

profileRouter.get("/:id", profileController.getProfileById)
profileRouter.get("/",authMiddleware, profileController.getProfile)

module.exports = profileRouter