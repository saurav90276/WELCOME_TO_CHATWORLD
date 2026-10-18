const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const { app, server } = require('./socket/index')

// const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(cookiesParser())
app.use(express.json())

const PORT = process.env.PORT || 8080

app.get('/',(request,response)=>{
    response.json({
        message : "Server running at " + PORT
    })
})

//api endpoints
app.use('/api',router)


connectDB().then(() => {
    server.listen(PORT, "0.0.0.0", () => {
        console.log("Server running at " + PORT);
    });
}).catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
});

