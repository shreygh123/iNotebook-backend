const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://i-notebook-frontend-ten.vercel.app",
  credentials: true
}));

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
