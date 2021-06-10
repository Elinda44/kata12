const mongoose = require("mongoose");

const BooksSchema = new mongoose.Schema({
    name:{
        type: String
    },
    createdAt:{
        type: Date
    },
    qty:{
        type: Number
    },
    sold:{
        type: Number
    },
    author:{
        type: String
    },
    isbn:{
        type: String
    }
});

module.exports = mongoose.model("books", BooksSchema, "books");