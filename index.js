const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const allowedOrigins = [
  "https://i-notebook-frontend-ten.vercel.app",
  "https://i-notebook-sg.netlify.app"
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
  }
  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.options("*", cors());

app.use(express.json());

mongoose.connect(process.env.mongURI,()=>{console.log("Connected to Mongo Successfully")})
// Available Routes
app.get('/', (req, res) => res.send("Welcome "));
app.use('/api/notes', require('./Router/notes'))
app.use('/api/auth', require('./Router/auth'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
