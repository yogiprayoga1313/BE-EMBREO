const eventsRouter = require("express").Router()
const authMiddlewares = require("../middlewares/auth.middlewares")

const eventsController = require("../controllers/events.controller")

eventsRouter.get("/manage", eventsController.getAllEvents)
eventsRouter.get("/manage_detail", eventsController.getManageAllEvent)
eventsRouter.post("/manage", authMiddlewares,eventsController.createManageEvent)

eventsRouter.get("/admin_list", eventsController.getAllEventPending)
eventsRouter.get("/:id", eventsController.getEvent)

module.exports = eventsRouter