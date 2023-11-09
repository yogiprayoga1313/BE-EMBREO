const eventModel = require("../models/events.model")
const eventStatusModel = require("../models/statusEvent.model")
const profileModel = require("../models/profile.model")
const requestEventModel = require("../models/request.model")
const errorHandler = require("../helpers/errorHandler.helper")

exports.createManageEvent = async function (req, res) {
    try {

        const { id } = req.user
        const data = {
            ...req.body,
            createdBy: id,
            statusId: 1
        }

        const dataEvent = await eventModel.createManageEvent(data)
        if (!data) {
            return res.json({
                status: false,
                message: "failed_create_event"
            })
        }

        const eventId = dataEvent.id
        const textMessage = "sent you request to publish event"
        const recipientRole = "Vendor_Admin"
        const dataRequest = {
            eventId: eventId,
            senderId: id,
            message: textMessage,
            type_request: "event",
            status_request: 1,
            recipientRole: recipientRole
        }
        await requestEventModel.insertRequestEvent(dataRequest)

        const status = await eventStatusModel.findOne(dataEvent.statusId)
        const userCreated = await profileModel.findOneByUserName(id)
        const results = {
            id: dataEvent.id,
            event_name: dataEvent.event_name,
            vendor_name: dataEvent.vendor_name,
            date_confirmation: dataEvent.date_confirmation,
            createdBy: userCreated.name,
            status: status.status,
            createdAt: dataEvent.createdAt,
            updatedAt: dataEvent.updatedAt
        }

        return res.json({
            success: true,
            message: "Create events Successfully!",
            results: results
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getAllEvents = async function (req, res) {
    try {

        const { rows: results, pageInfo } = await eventModel.findAll(req.query)

        return res.json({
            success: true,
            message: "List of all events",
            results,
            pageInfo,
        })
    } catch (error) {
        console.log(error)
        return errorHandler(res, error)
    }
}

exports.getAllEventPending = async (req, res) => {
    try {
        const { rows: results, pageInfo } = await eventModel.findAllWait(req.query)
        // return console.log(request.query)
        return res.json({
            success: true,
            message: "List of all waiting list Event",
            results,
            pageInfo
        })
    } catch (err) {
        return erorrHandler(response, err)
    }
}

exports.getManageAllEvent = async (request, response) => {
    try {
        const userId = request.user
        console.log(userId)
        if (!userId) {
            return response.status(404).json({
                success: false,
                message: "User not found!"
            })
        }
        console.log(request.user)
        const { rows: results, pageInfo } = await eventModel.findAllManageEvent(request.query, userId)
        return response.json({
            success: true,
            message: "List of all Manage Article",
            pageInfo,
            results
        })
    } catch (err) {
        console.log(err)
    }
}


exports.getEvent = async (request, response) => {
    try {
        const id = request.params.id
        const data = await eventModel.findOne(id)

        if (!data) {
            return response.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        return response.json({
            success: true,
            message: "List of events",
            results: data
        })
    } catch (err) {
        console.log(err)
        // return erorrHandler(response, err)
    }
}
