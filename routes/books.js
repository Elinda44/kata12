const express = require("express");
const router = express();
const Books = require("../models/Books");
const Books_transactions = require("../models/Books_transactions");


router.get("/", async (req,res) => {
    try{
        const books = await Books.find();
        res.send(books);
    }catch(err){
        res.send(err);
    }
});
router.get("/getsingle/:id", async (req,res) => {
    try{
        const book = await Books.findById(req.params.id);
        res.send(book);
        console.log(book);
    }catch(err){
        res.send(err);
    }
})
router.post("/sell", async (req,res) => {
    const {book_id,qty} = req.body;
    const current_date = new Date();
    let books;
    try{
        books = await Books.findById(book_id)
    }catch(err){
        res.send(err);
    }
    let qty_tosave;
    if(books.qty < qty){
        return res.status(400).send({msg:"Sorry, not enought stock for this book!"});
    }else{
        qty_tosave = books.qty - qty;
    }

    let bookToUpdate;
    try{
        bookToUpdate = await Books.findByIdAndUpdate(book_id,{qty: qty_tosave});
    }catch(err){
        res.send(err);
    }

    const books_tr = new Books_transactions({
        book_id: book_id,
        date: new Date(),
        qty: qty
    });
    
    try{
        let something = await books_tr.save();
        console.log(books_tr);
        res.send("Done")
    }catch(err){
        res.send(err);
    }
})


router.get("/getsoldbooks/everyhour", async (req,res) => {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth()+1;
    const currentDateString = currentDate.getDate()+"/" + currentMonth + "/" + currentDate.getFullYear() + " " + currentDate.getHours() + ":00";
    const dateInMilliseconds = Date.parse(currentDateString);
    const finalDateOne = new Date(dateInMilliseconds);
    const finalDateTwo = new Date(dateInMilliseconds - 86400000);
    console.log(finalDateOne,finalDateTwo)
    try{
        currentBooks = await Books_transactions.aggregate([
            {
                $match:{
                    $and:[
                        {date:{
                            $lte: finalDateOne
                        }},
                        {date:{
                            $gte: finalDateTwo
                        }},
                    ]
                }
            },
            {
                $group:{
                    _id:{book_id:"$book_id"},
                    qty:{$sum:"$qty"}
                }
            },
            {$addFields: {book_obj_id:{$toObjectId:"$_id.book_id"}}},
            {
                $lookup:{
                    from:"books",
                    localField:"book_obj_id",
                    foreignField:"_id",
                    as:"books"
                }
            },
            {
                $sort:{
                    qty:-1
                }
            },
            {$unwind:"$books"},
            {
                $project:{
                    _id:0,
                    book_name:"$books.name",
                    book_author:"$books.author",
                    qty_sold:"$qty"
                }
            }
        ]);
        res.send(currentBooks);
    }catch(err){
        res.send(err);
    }
});

router.get("/getsoldbooks/perday", async (req,res) => {
    let transactions;
    let currentDate = new Date();
    let pastDayMilliseconds = currentDate.getTime() - 79200000;
    let yesterday = new Date(pastDayMilliseconds);
    let month = ('0' + (yesterday.getMonth()+1)).slice(-2);
    let prevDay = new Date(`${yesterday.getFullYear()}-${month}-${('0' + (yesterday.getDate()-1)).slice(-2)}`);
    let nextDay = new Date(`${yesterday.getFullYear()}-${month}-${('0' + (yesterday.getDate())).slice(-2)}`);

    try{
        transactions = await Books_transactions.aggregate([
            {
                $match:{
                    date:{
                        $gte:prevDay,
                        $lt:nextDay
                    }
                }
            },
            {$addFields:{book_obj_id:{$toObjectId:"$book_id"}}},
            {
                $lookup:{
                    from:"books",
                    localField:"book_obj_id",
                    foreignField:"_id",
                    as:"book"
                }
            },
            {$unwind:"$book"},
            {
                $project:{
                    _id:0,
                    book_name:"$book.name",
                    book_author:"$book.author",
                    qty_sold:"$qty"
                }
            }
        ])
        res.send(transactions);
    }catch(err){
        res.send(err);
    }
});

router.get("/getsoldbooks/realtime", async (req,res) => {
    let transactions;
    let currentDate = new Date();
    let pastDayMilliseconds = currentDate.getTime() - 79200000;
    let yesterday = new Date(pastDayMilliseconds);
    
    try{
        transactions = await Books_transactions.aggregate([
            {
                $match:{
                    date:{
                        $gte:yesterday
                    }
                }
            },
            {$addFields:{book_obj_id:{$toObjectId:"$book_id"}}},
            {
                $lookup:{
                    from:"books",
                    localField:"book_obj_id",
                    foreignField:"_id",
                    as:"book"
                }
            },
            {$unwind:"$book"},
            {
                $project:{
                    _id:0,
                    book_name:"$book.name",
                    book_author:"$book.author",
                    qty_sold:"$qty"
                }
            }
        ])
        res.send(transactions);
    }catch(err){
        res.send(err);
    }
})
module.exports = router;