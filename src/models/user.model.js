const db = require("../helpers/db.helper")

exports.insert = async function(data){
    const query = `
  INSERT INTO "users" ("userName", "password", "roleId") 
  VALUES ($1, $2, $3) RETURNING *
  `
    const values = [data.userName, data.password, data.roleId]
    const {rows} = await db.query(query, values)
    return rows [0]
}

exports.findOneByUserName = async function(userName){
  const query = `
  SELECT
  "u"."id",
  "u"."userName",
  "u"."password",
  "r"."code" as "role",
  "u"."createdAt",
  "u"."updatedAt"
  FROM "users" "u"
  JOIN "role" "r" ON "r"."id" = "u"."roleId"
  WHERE "u"."userName"=$1
`
  const values = [userName]
  const {rows} = await db.query(query, values)
  return rows[0]
}

exports.findOne = async function(id){
  const query = `
  SELECT
  "u"."id",
  "u"."userName",
  "u"."password",
  "r"."code" as "role",
  "u"."createdAt",
  "u"."updatedAt"
  FROM "users" "u"
  JOIN "role" "r" ON "r"."id" = "u"."roleId"
  WHERE "u"."id" = $1
`
  const values = [id]
  const {rows} = await db.query(query, values)
  return rows[0]
}