const express = require("express");
const mongoose = require("mongoose");
const upload = require("./utils/multer");
const dotenv = require("dotenv");
dotenv.config();

const postRoute = require("./routes/post.route");

const app = express();

app.use(express.json());

const Port = process.env.PORT || 8000;

app.use(postRoute);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("connection was successful"))
    .catch(() => console.log("oops something went wrong"));

app.listen(Port, () => {
    console.log(`app is listening on Port: ${Port}`);
})