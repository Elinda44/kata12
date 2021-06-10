const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser')
mongoose.connect('mongodb://localhost:27017/kata12', {useNewUrlParser: true});

app.use(bodyParser());

const books = require("./routes/books");

app.use("/books",books);

app.get("/", (req,res) => {
    res.send("get");
})

app.listen(5000, () => {
    console.log("App is running in port 5000");
})