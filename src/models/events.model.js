const db = require("../helpers/db.helper")
const table = "events"

exports.createManageEvent = async function (data) {
    const query = `
    INSERT INTO "${table}"
    ("event_name","vendor_name","date_confirmation","createdBy", "statusId")
    VALUES ($1,$2,$3,$4,$5) RETURNING *
    `
    const values = [data.event_name, data.vendor_name, data.date_confirmation, data.createdBy, data.statusId]
    const { rows } = await db.query(query, values)
    return rows[0]
}

exports.accRequestEvent = async function (id) {
    const query = `
    UPDATE "${table}"  SET "statusId" = 2 WHERE "id" = $1
    RETURNING *
    `
    const values = [id]
    const { rows } = await db.query(query, values)
    return rows[0]
}

exports.rejectRequestEvent = async (id, rejectionReason) => {
    const query = `
    UPDATE "${table}" SET "statusId" = 3, "rejectionReason" = $2 WHERE "id" = $1
    RETURNING *
    `
    const values = [id, rejectionReason];
    const { rows } = await db.query(query, values);
    return rows[0];
}


exports.findAll = async function (params, userRole) {
    params.page = parseInt(params.page) || 1;
    params.limit = parseInt(params.limit) || 10;
    params.search = params.search || "";
    params.sort = params.sort || "ASC";
    params.sortBy = params.sortBy || "id";

    const offset = (params.page - 1) * params.limit;

    const countQuery = `
    SELECT COUNT(*)::INTEGER
    FROM "${table}"
    WHERE "event_name" ILIKE $1 
    `;
    const countValues = [`%${params.search}%`];
    const { rows: countRows } = await db.query(countQuery, countValues);

    const query = `
    SELECT
        e.id,
        LEFT(e.vendor_name, 255) AS "vendor",
        LEFT(e.event_name, 255) AS "event",
        e."date_confirmation",
        u."userName" AS "sender",
        r."code" AS "role",
        s."name" AS "status",
        n."message" AS "notification_message",
        e."createdAt",
        e."updateAt"
    FROM
        "events" e
    LEFT JOIN
        "users" AS u ON u.id = e."createdBy"
    LEFT JOIN
        "role" AS r ON r.id = u."roleId"
    LEFT JOIN
        "status" AS s ON s.id = e."statusId"
    LEFT JOIN
        "notifications" AS n ON n."eventId" = e.id    
    WHERE
        e.event_name ILIKE $1
        AND "e"."statusId" = 2

    ORDER BY "${params.sortBy}" ${params.sort}
    LIMIT ${params.limit} OFFSET ${offset};
    `;

    const values = [`%${params.search}%`]; // Sesuaikan status yang ingin ditampilkan
    const { rows } = await db.query(query, values);
    return {
        rows,
        pageInfo: {
            totaData: countRows[0].count,
            page: params.page,
            limit: params.limit,
            totalPage: Math.ceil(countRows[0].count / params.limit)
        }
    };
}


exports.findAllManageEvent = async function (params, userId) {
    params.page = parseInt(params.page) || 1;
    params.limit = parseInt(params.limit) || 10;
    params.search = params.search || "";
    params.sort = params.sort || "ASC";
    params.sortBy = params.sortBy || "id";

    const offset = (params.page - 1) * params.limit;

    const countQuery = `
    SELECT COUNT(*)::INTEGER
    FROM "${table}"
    WHERE "event_name" ILIKE $1 
    AND "createdBy" = $2 
    `;
    const countValues = [`%${params.search}%`, userId];
    const { rows: countRows } = await db.query(countQuery, countValues);

    const query = `
    SELECT
        e.id,
        LEFT(e.vendor_name, 255) AS "vendor",
        LEFT(e.event_name, 255) AS "event",
        e."date_confirmation",
        u."userName" AS "sender",
        r."code" AS "role",
        s."name" AS "status",
        n."message" AS "notification_message",
        e."createdAt",
        e."updateAt"
    FROM
        "events" e
    LEFT JOIN
        "users" AS u ON u.id = e."createdBy"
    LEFT JOIN
        "role" AS r ON r.id = u."roleId"
    LEFT JOIN
        "status" AS s ON s.id = e."statusId"
    LEFT JOIN
        "notifications" AS n ON n."eventId" = e.id    
    WHERE
        e.event_name ILIKE $1
        AND e."createdBy" = $2 
        AND "e"."statusId" = 2

    ORDER BY "${params.sortBy}" ${params.sort}
    LIMIT ${params.limit} OFFSET ${offset};
    `;

    const values = [`%${params.search}%`, userId]; 
    const { rows } = await db.query(query, values);
    return {
        rows,
        pageInfo: {
            totaData: countRows[0].count,
            page: params.page,
            limit: params.limit,
            totalPage: Math.ceil(countRows[0].count / params.limit)
        }
    };
}


exports.findAllWait = async function (params, userRole) {
    params.page = parseInt(params.page) || 1;
    params.limit = parseInt(params.limit) || 10;
    params.search = params.search || "";
    params.sort = params.sort || "ASC";
    params.sortBy = params.sortBy || "id";

    const offset = (params.page - 1) * params.limit;

    const countQuery = `
    SELECT COUNT(*)::INTEGER
    FROM "${table}"
    WHERE "event_name" ILIKE $1 
    `;
    const countValues = [`%${params.search}%`];
    const { rows: countRows } = await db.query(countQuery, countValues);

    const query = `
    SELECT
        e.id,
        LEFT(e.vendor_name, 255) AS "vendor",
        LEFT(e.event_name, 255) AS "event",
        e."date_confirmation",
        u."userName" AS "sender",
        r."code" AS "role",
        s."name" AS "status",
        n."message" AS "notification_message",
        e."createdAt",
        e."updateAt"
    FROM
        "events" e
    LEFT JOIN
        "users" AS u ON u.id = e."createdBy"
    LEFT JOIN
        "role" AS r ON r.id = u."roleId"
    LEFT JOIN
        "status" AS s ON s.id = e."statusId"
    LEFT JOIN
        "notifications" AS n ON n."eventId" = e.id    
    WHERE
        e.event_name ILIKE $1
        AND "e"."statusId" IN (1, 2, 3)
        
    ORDER BY "${params.sortBy}" ${params.sort}
    LIMIT ${params.limit} OFFSET ${offset};
    `;

    const values = [`%${params.search}%`]; 
    const { rows } = await db.query(query, values);
    return {
        rows,
        pageInfo: {
            totaData: countRows[0].count,
            page: params.page,
            limit: params.limit,
            totalPage: Math.ceil(countRows[0].count / params.limit)
        }
    };
}


exports.findOne = async function (id) {
    const query = `
    SELECT
        e.*,
        s."name" AS "status_event",
        u."userName" AS "creator_name"
    FROM ${table} e
    LEFT JOIN "status" AS s ON e."statusId" = s.id
    LEFT JOIN "users" AS u ON e."createdBy" = u.id
    WHERE e.id = $1
    `
    const values = [id]
    const { rows } = await db.query(query, values)
    return rows[0]
}
