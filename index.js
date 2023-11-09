require("dotenv").config({
    path: ".env"
})

const express = require("express")
const cors = require("cors")

const app = express()
app.use(express.urlencoded({extended: false}))


// var whitelist = ["http://localhost:5173", "http://127.0.0.1:5173"]
// var corsOptions = {
//     origin: function (origin, callback) {
//         if ((origin === undefined ) || (whitelist.indexOf(origin) !== -1)) {
//             callback(null, true)
//         } else {
//             callback(new Error("Not allowed by CORS"))
//         }
//     }
// }
app.use(cors())

app.use("/uploads", express.static("uploads"))

app.use("/", require("./src/routers/index"))

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`)
})