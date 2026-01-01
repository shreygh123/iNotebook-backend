const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ✅ MUST BE FIRST
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://i-notebook-sg.netlify.app",
        "https://i-notebook-frontend-ten.vercel.app",
      ];

      // Allow Postman / Server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Explicit preflight handler
app.options("*", cors());

app.use(express.json());

mongoose.connect(process.env.mongURI,()=>{console.log("Connected to Mongo Successfully")})
// Available Routes
app.get('/', (req, res) => res.send("Welcome "));
app.use('/api/notes', require('./Router/notes'))
app.use('/api/auth', require('./Router/auth'))

// const port = 5000;
// app.listen(process.env.PORT || 5000 , () => console.log(`Server running on port ${5000}`));
module.exports = app;

