const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')
mongoose.connect('mongodb+srv://elinda:krasniqi@cluster0.nj6k3.mongodb.net/kata12?authSource=admin&replicaSet=atlas-pzyc42-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {useNewUrlParser: true});

app.use('*',cors());
app.use(express.json());


const books = require("./routes/books");
app.use("/books",books);

app.get("/", (req,res) => {
    res.send("get");
})

app.listen(5000, () => {
    console.log("App is running in port 5000");
})