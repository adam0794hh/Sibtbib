import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();

// middlewares
app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://sibtbib-frontend.vercel.app",
    "https://sibtbib-admin.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // autoriser les outils sans origin (comme Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// api endpoint
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(port, () => console.log("server listening on port", port));