const express = require('express')
const app = express()
var path = require('path')

// connect database
let db;
let col_name = 'chatmessage';
var dbF = require('./db.js');

(async function() {
    db = await dbF.init();
})();

// view engine setup
app.use(express.static('views'))
app.set('view engine', 'jade')

// var indexRouter = require('./routes/index')
// var roboRouter = require('./routes/roboshop')
// app.use('/', indexRouter)
// app.use('/roboshop', roboRouter)

//start 
app.get("/roboshop/admin", async(req, res) => {
    // res.render('indexTest', {
    //     title: 'roboshop'
    // });
    res.render('index', {
        title: 'roboshop'
    });
});


//contact
app.get('/roboshop/contact', async(req, res) => {

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

    let t = await db.collection(col_name).aggregate([

        { $match: { date: { $gte: new Date("2021-04-30T00:00:00Z") } } },
        { $group: { _id: '$userId', userId: { $addToSet: '$userId' }, date: { $max: '$date' } } },
        { $sort: { date: -1 } },
        { $project: { _id: 0, userId: 1, date: 1 } }

    ]).toArray()

    console.log("test ", t)

    res.json(t)

})

app.get("/roboshop/chat/userId/:userId", async(req, res) => {
    let currentDate = new Date();
    let lastDateQuery, match_date, last30day;
    let userId = req.params.userId;
    // console.log("GET: ", req.baseUrl);

    if (req.query.lastDateQuery == 'null') {
        last30day = new Date(currentDate - 60 * 60 * 24 * 30 * 1000);
        match_date = { $gte: last30day, $lt: currentDate }
    } else {
        lastDateQuery = new Date(req.query.lastDateQuery);
        match_date = { $gte: lastDateQuery, $lt: currentDate }
    }

    // if (req.query.lastDateQuery) {
    //     lastDateQuery = new Date(req.query.lastDateQuery);
    //     match_date = { $gte: lastDateQuery, $lt: currentDate }
    // } else {
    //     last30day = new Date(currentDate - 60 * 60 * 24 * 30 * 1000);
    //     match_date = { $gte: last30day, $lt: currentDate }
    // }

    let result;
    let match = { "userId": userId, "date": match_date }
    console.log("match: ", match);

    if (req.query.select == 'count') {
        result = await db.collection(col_name).aggregate(
            [
                { $match: match },
                { $count: "count" }
            ]
        ).toArray();
        console.log("result count: ", result);
    } else {
        let project = { _id: 0, query: 1, responseMessages: 1, date: 1 }
            // let group = { _id: { date: "$date", userId: "$userId", query: "$query", responseMessages: "$responseMessages" } };
        let sort = { date: 1 };
        result = await db.collection(col_name).aggregate(
            [
                { $match: match },
                { $project: project },
                // { $group: group },
                { $sort: sort },
                { $limit: 30 }
            ]
        ).toArray();

        result.push({ "lastDateQuery": currentDate });
        console.log("result: ", result.length, " => ", result);
    }

    res.json(result);
})

app.listen(8080, () => { console.log(`Server is running on port : 8080`) })

module.exports = app