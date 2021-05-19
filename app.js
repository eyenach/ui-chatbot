const express = require('express')
const app = express()
var path = require('path')

// connect database
let db;
// let col_name = 'chatMessege1';
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
    res.render('index', {
        title: 'roboshop'
    });
});


//contact
app.get('/roboshop/contacts/', async(req, res) => {


    let lastDate = req.query.lastDateQuery
    let currentDate = new Date()

    let match = {}; //{date: {$gte: new Date("2021-03-30 02:10:11.795Z")}}

    if (lastDate != null) {
        match = { date: { $gte: new Date(lastDate), $lt: currentDate } }; //between
    }

    let result = await db.collection(col_name).aggregate([ //edit query

        { $match: match },
        { $group: { _id: '$userId', userId: { $first: '$userId' }, date: { $max: '$date' } } },
        { $sort: { date: -1 } },
        { $project: { _id: 0, userId: 1 } }

    ]).toArray()

    let map_result = result.map(function(obj) {
        return obj.userId;
    });

    console.log("result contact ", map_result)

    // let final_result = { contact: { lastDateQuery: currentDate, contact: map_result } };

    let final_result = { "lastDateQuery": currentDate, "contact": map_result };

    console.log("final_result ", final_result)

    res.json(final_result)

})

app.get("/roboshop/chat/userId/:userId/", async(req, res) => {
    let currentDate = new Date();
    let match_date;
    let userId = req.params.userId;
    console.log("GET: /roboshop/chat/userId/" + userId + "?lastDateQuery=" + req.query.lastDateQuery + "&select=count");

    if (req.query.lastDateQuery == 'null') {
        let last30day = new Date(currentDate - 60 * 60 * 24 * 30 * 1000);
        match_date = { $gte: last30day, $lt: currentDate }
    } else {
        let lastDateQuery = new Date(req.query.lastDateQuery);
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