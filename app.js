const express = require('express')
const app = express()
var path = require('path')

var indexRouter = require('./routes/index')

var resultTest;


// connect database
let db;
var dbF = require('./db.js');

(async function() {
    db = await dbF.init();
})();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade')

//start 
app.get("/roboshop/admin", async (req,res) => {
    res.render('indexTest',{
        title: 'roboshop'
    });
});


//contact
app.get('/roboshop/contact', async (req, res) => {

    // db.collection("chatMessege1").find({ "date": { $gte: new Date("2021-04-30T00:00:00Z")}}).project({ _id:0 , userId:1 , displayName:1 , date:1}).toArray(
    //     function(err, result) {
    //         console.log("dwsfda ",result)
    //         res.json(result)
    //         dbF.close()
    //     }
    // );


    // db.collection('chatMessege1').aggregate([
    //     {
    //         $match: { date: {$gte: new Date("2021-04-30T00:00:00Z")}} 
    //     }
    // ]).toArray(
    //     function(err, result) {
    //         console.log("dwsfda ",result)
    //         // res.json(result)
    //         // dbF.close()
    //     }
    //  )

    // let t = await db.collection('chatMessege1').aggregate([

    //         { $match: { date: {$gte: new Date("2021-03-30T00:00:00Z")}}},
    //         { $sort: {date:-1}},
    //         { $group: {_id: "$userId"}}

    // ]).toArray()

    let t = await db.collection('chatMessege1').aggregate([

        { $match: { date: {$gte: new Date("2021-04-30T00:00:00Z")} } },
        { $group: { _id : '$userId', userId : { $addToSet: '$userId' } , date : { $max: '$date' } } },
        { $sort: { date : -1 } },
        { $project : {_id : 0 ,userId : 1 ,date:1 } }

    ]).toArray()
    
    console.log("test ",t ) 

    res.json(t)


})


app.listen(8080, () => {console.log(`Server is running on port : 8080`)})





// app.get('/', (req, res) => {
//     res.sendFile('app.js', { root: path.join(__dirname, './controller') });
// });

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug')


// app.get("/admin", async(req, res) => {
//     res.sendFile('admin.html', { root: path.join(__dirname, './views') });
// });

// app.use('/', indexRouter)

// app.get('/admin', (req, res) => {
//     res.render('index', {
//         message: 'This is message sent from app.js'
//     })
// })



// app.listen(8080, () => {console.log(`Server is running on port : 8080`)})

module.exports = app