const requestRouter = require("express").Router()

const requestController = require("../controllers/request.controller")

requestRouter.get("/", requestController.getAllRequestForAdmin)
requestRouter.post("/acc_event", requestController.accRequestEvent)
requestRouter.post("/reject_event", requestController.rejectRequestEvent)

module.exports = requestRouter