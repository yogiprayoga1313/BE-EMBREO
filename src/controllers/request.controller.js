const requestModel = require("../models/request.model")
const userModel = require("../models/user.model")
const eventModel = require("../models/events.model")
const errorHandler = require("../helpers/errorHandler.helper")

exports.accRequestEvent = async function (req, res) {
    try {
        const { id, role } = req.user;
        if (role !== "Vendor_Admin") {
            throw Error("please_sign_in");
        }
        const { eventId } = req.body;
        const accRequestEvent = await eventModel.accRequestEvent(eventId);

        if (accRequestEvent) {
            const dataFindRequest = {
                eventId: accRequestEvent.id,
                senderId: accRequestEvent.createdBy,
                type_request: "event",
                status_request: 1
            };

            const resultRequestRow = await requestModel.findOneByEventData(dataFindRequest);
            if (resultRequestRow) {
                await requestModel.changeStatusRequest(resultRequestRow.id);
            }

            const message = "your event has been published";
            const type = "acc_event";
            const status = 1;
            const recipientId = accRequestEvent.createdBy;
            const event = accRequestEvent.id;

            const recipientData = {
                eventId: event,
                senderId: id,
                message: message,
                type_request: type,
                status_request: status,
                recipientId: recipientId 
            };

            await requestModel.insertRequestEvent(recipientData);

            return res.json({
                success: true,
                message: "request accepted",
                results: accRequestEvent
            });
        } else {
            return res.json({
                success: false,
                message: "Event not found"
            });
        }
    } catch (error) {
        console.log(error);
        return errorHandler(res, error);
    }
}


exports.rejectRequestEvent = async function (req, res) {
    try {
        const { id, role } = req.user
        if (role !== "Vendor_Admin") {
            throw Error("please_sign_in")
        }
        const { eventId, rejectionReason  } = req.body
        const rejectRequestEvent = await eventModel.rejectRequestEvent(eventId, rejectionReason)
        const dataFindRequest = {
            eventId: rejectRequestEvent.id,
            senderId: rejectRequestEvent.createdBy,
            type_request: "event",
            status_request: 1
        }
        const reslutRequestRow = await requestModel.findOneByEventData(dataFindRequest)
        if (reslutRequestRow) {
            await requestModel.changeStatusRequest(reslutRequestRow.id)
        }

        const message = "your event has been rejected! Reason: " + rejectionReason;
        const type = "reject_event"
        const status = 1
        const recipiectId = rejectRequestEvent.createdBy
        const event = rejectRequestEvent.id

        const recpientData = {
            eventId: event,
            senderId: id,
            message: message,
            type_request: type,
            status_request: status,
            recipientId: recipiectId
        }

        await requestModel.insertRequestEvent(recpientData)

        return res.json({
            success: true,
            message: "request rejected",
            results: rejectRequestEvent
        })
    } catch (error) {
        console.log(error)
        return errorHandler(res, error)
    }
}

exports.getAllRequestForAdmin = async (req, res) => {
    try {
        const { role } = req.user
        if (role !== "Vendor_Admin") {
            throw Error("please_sign_in_to_admin_for_read_notif_admin")
        }
        const params = { ...req.user, ...req.query }
        const requestEvent = await requestModel.findAll(params)
        return res.json({
            success: true,
            message: "list all request post events",
            results: requestEvent
        })
    } catch (error) {
        console.log(error)
        return errorHandler(res, error)
    }
}


exports.getAllRequestForUser = async (req, res) => {
    try {
        const { id } = req.user
        if (!id) {
            throw Error("please_sign_in_for_read_notif")
        }
        const params = { ...req.user, ...req.query }
        const requestArticle = await requestModel.findAllNotifUser(params)
        return res.json({
            success: true,
            message: "list all request post article",
            results: requestArticle
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}