require("dotenv").config()
require("./Connection/connection.js")
const userRouters = require("./Routes/userRouters.js")
const passwordRouters = require("./Routes/passwordRouters.js")
const mapRouters = require("./Routes/mapRouters.js")
const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

// Users
app.use("/api/v1/users",userRouters)

// Passwords
app.use("/api/v1/password",passwordRouters)

// Map
app.use("/api/v1/map",mapRouters)

PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Backend Server Start At=>${PORT}`);
})





