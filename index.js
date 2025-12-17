const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors');
const path= require('path');
const mongoose =require("mongoose")
// const mongURI = 'mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
dotenv.config();
let app = express()

// const app = express();
app.use(cors({
  origin: [
    "https://i-notebook-frontend-ten.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.options("*", cors());
app.use(express.json()) // to accept json data

mongoose.connect(process.env.mongURI,()=>{console.log("Connected to Mongo Successfully")})
// Available Routes
app.get('/', (req, res) => res.send("Welcome "));
app.use('/api/notes', require('./Router/notes'))
app.use('/api/auth', require('./Router/auth'))

// const port = 5000;
// app.listen(process.env.PORT || 5000 , () => console.log(`Server running on port ${5000}`));
module.exports = app;

