const express = require('express')
const app = express()
var path = require('path')

// connect database
let db;
let col_name = 'chatMessege1';
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
app.get('/roboshop/contact/', async(req, res) => {
    
 
    let last_date = req.query.lastDateQuery;

    let match ;

    if (last_date != null) {
        match = { date: { $gte: new Date(last_date) , $lt: new Date() } };
    } 

    let t = await db.collection(col_name).aggregate([  //edit query

        { $match: {} }, 
        { $group: { _id: '$userId', userId: { $first: '$userId' }, date: { $max: '$date' } } },
        { $sort: { date: -1 } },
        { $project: { _id: 0, userId: 1 } }

    ]).toArray()

    console.log(t)


    // //find date now (!= local)
    let date_now = new Date()
    // console.log("date_now ",date_now)
    


    let result = { lastDateQuery: date_now , contact : t } ;
    
    // t.last_date = last_date

    console.log("test ", result)

    res.json(result)

})

app.get("/roboshop/chat/userId/:userId", async(req, res) => {
    let currentDate = new Date();
    let lastDateQuery, match_date, last30day;
    let userId = req.params.userId;
    console.log("GET: /roboshop/chat/userId/" + userId + "?lastDateQuery=" + req.query.lastDateQuery);

    if (req.query.lastDateQuery == 'null') {
        last30day = new Date(currentDate - 60 * 60 * 24 * 30 * 1000);
        match_date = { $gte: last30day, $lt: currentDate }
    } else {
        lastDateQuery = new Date(req.query.lastDateQuery);
        match_date = { $gte: lastDateQuery, $lt: currentDate }
    }

    let match = { "userId": userId, "date": match_date }
    console.log("match: ", match);
    let project = { _id: 0, query: 1, responseMessages: 1, date: 1 }
        // let group = { _id: { date: "$date", userId: "$userId", query: "$query", responseMessages: "$responseMessages" } };
    let sort = { date: 1 };
    let result = await db.collection(col_name).aggregate(
        [
            { $match: match },
            { $project: project },
            // { $group: group },
            { $sort: sort },
            { $limit: 30 }
        ]
    ).toArray();

    result.splice(0, 0, { "lastDateQuery": currentDate });
    console.log("result: ", result.length, " => ", result);
    res.json(result);
})

app.listen(8080, () => { console.log(`Server is running on port : 8080`) })

module.exports = app