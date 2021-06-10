const mongoose = require("mongoose");

const BooksTransactionsSchema = new mongoose.Schema({
    book_id:{
        type: String
    },
    date:{
        type: Date
    },
    qty:{
        type: Number
    }
});

module.exports = mongoose.model("books_transactions", BooksTransactionsSchema, "books_transactions");