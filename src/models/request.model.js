const db = require("../helpers/db.helper")
const tabel = "notifications"


exports.findOneByEventData = async function (params){
    const query =`
    SELECT * FROM ${tabel}
    WHERE "eventId" = $1 AND "senderId"= $2 AND "type_request" = $3 AND "status_request" = $4
    `
    const values = [params.eventId ,params.senderId, params.type_request, params.status_request]
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.insertRequestEvent = async function(data){
    const query = `
    INSERT INTO ${tabel} (
        "eventId",
        "senderId",
        "message",
        "type_request",
        "status_request",
        "recipientId",
        "recipientRole"
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `
    const values = [data.eventId, data.senderId, data.message, data.type_request, data.status_request, data.recipiectId, data.recipientRole]
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.changeStatusRequest = async function (id){
    const query =`
    DELETE FROM ${tabel} WHERE "id" = $1
    RETURNING *
    `
    const values = [id]
    const {rows} = await db.query(query,values)
    return rows[0]
}

exports.insertNotification = async function(data){
    const query = `
    INSERT INTO ${tabel} (
        "eventId",
        "senderId",
        "message",
        "type_request",
        "status_request",
        "recipientId"
    )
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `
    const values = [data.eventId, data.senderId, data.message, data.type_request, data.status_request, data.recipiectId]
    const {rows} = await db.query(query, values)
    return rows[0]
}

exports.findAll = async function(params){

    params.page = parseInt(params.page) || 1
    params.limit = parseInt(params.limit) || 100
    params.searchName = params.searchName || ""
    params.sort = params.sort || "DESC"
    params.sortBy = params.sortBy || "id"
    const offset = (params.page - 1) * params.limit

    const query = `
    SELECT 
    n.id,
    u.id as "senderId",
    u."userName" as "senderRequestName",
    e.id as "eventId",
    e."event_name" as "event",
    e."date_confirmation",
    n."type_request",
    n."status_request",
    n."createdAt",
    n."updateAt"
    FROM ${tabel} "n"
    LEFT JOIN "users" u ON u.id = n."senderId"
    LEFT JOIN "events" e ON e."id" = n."eventId"
    WHERE n."status_request" = 1 AND "senderId" != '${params.id}' AND ("recipientRole" = 'Vendor_Admin' OR "recipientId" = '${params.id}')  -- Ensure "recipientRole" is a string
    ORDER BY "${params.sortBy}" ${params.sort}
    LIMIT ${params.limit} OFFSET ${offset}
    `

    const {rows} = await db.query(query)
    return rows
}