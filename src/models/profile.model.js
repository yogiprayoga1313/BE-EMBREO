const db = require("../helpers/db.helper")

const table = "profile"

exports.findAll = async function (page, limit, search, sort, sortBy) {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    search = search || ""
    sort = sort || "id"
    sortBy = sortBy || "ASC"
    const offset = (page - 1) * limit

    const query = `
    SELECT * FROM "${table}" 
    WHERE "username" LIKE $3 
    ORDER BY "${sort}" ${sortBy} 
    LIMIT $1 OFFSET $2
    `
    const values = [limit, offset, `%${search}%`]
    const { rows } = await db.query(query, values)
    return rows
}

exports.findOne = async function (id) {
    const query = `
    SELECT "p"."id" as "profileId", "u"."id" as "userId", "u"."userName" as "userName", "r"."code" as "roleCode"
    FROM "${table}" "p"
    JOIN "users" "u" ON "u"."id" = "p"."userId"
    JOIN "role" "r" ON "r"."id" = "u"."roleId"
    WHERE "p"."id" = $1
    `;
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
};


exports.findOneUserId = async function (userId) {
    const query = `
    SELECT 
    "p"."id" as "profileId", 
    "u"."id" as "userId", 
    "u"."userName" as "userName", 
    "r"."code" as "roleCode"
    FROM "${table}" "p"
    JOIN "users" "u" ON "u"."id" = "p"."userId"
    JOIN "role" "r" ON "r"."id" = "u"."roleId"
    WHERE "p"."userId" = $1
    `;
    const values = [userId];
    const { rows } = await db.query(query, values);
    return rows[0];
};

exports.findOneByUserName = async function (userId) {
    const query = `
    SELECT 
    "u"."id",
    "u"."userName" as "name",
    "r"."code" as "role",
    "u"."createdAt",
    "u"."updatedAt"
    FROM "${table}" "p"
    JOIN "users" "u" ON "u"."id" = "p"."userId"
    JOIN "role" "r" ON "r"."id" = "u"."roleId"
    WHERE "p"."userId" = $1
    `
    const values = [userId]
    const { rows } = await db.query(query, values)
    return rows[0]
}


exports.insert = async function (data) {
    const query = `
    INSERT INTO "${table}" ("userId")
    VALUES ($1) RETURNING *
    `;
    const values = [data.userId];
    const { rows } = await db.query(query, values);
    return rows[0];
};
