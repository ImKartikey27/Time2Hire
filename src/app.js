import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

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
app.use(cookieParser())

// import routes
import jobRoutes from "./routes/job.routes.js"


app.get("/", (req, res) => {
    res.send("Server is running...");
});

//routes
app.use("/api/v1/jobs", jobRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/candidates", candidateRoutes)
app.use("/api/v1/voice", voiceRoutes)
app.use("/api/v1/appointment", appointmentRoutes)

//app.use(errorHandler)

export {app}