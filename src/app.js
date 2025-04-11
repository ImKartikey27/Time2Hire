import express from "express"
import cors from "cors"
import { ApiError } from "./utils/ApiError.js"
import { ApiResponse } from "./utils/ApiResponse.js"
import { asyncHandler } from "./utils/asyncHandler.js"

const app = express()   

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true
    })
)

//common middelwares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true , limit: "16kb"}))
app.use(express.static("public"))

// import routes


app.get("/", (req, res) => {
    res.send("Server is running...");
});

//routes

//app.use(errorHandler)

export {app}