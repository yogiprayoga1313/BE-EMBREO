const router = require("express").Router()
const authMiddleware = require("../middlewares/auth.middlewares")

router.get("/", (request, response) => {
    return response.json({
        success: true,
        message: "Backend is running well"
    })
})

router.use("/auth", require("./auth.router"))
router.use("/profile", authMiddleware, require("./profile.router"))
router.use("/events", require("./events.router"))
router.use("/request", authMiddleware, require("./request.router"))


router.use("*", (request, response) => {
    return response.status(404).json({
        success: false,
        message: "Resource not found"
    })
})

module.exports = router
