const express = require('express')
const app = express()
var path = require('path')

// connect database
let db;
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

app.get('/roboshop/admin', (req, res) => {
    res.render('index', {
        message: 'This is message sent from app.js'
    })
})

app.get("/roboshop/contacts", async(req, res) => {
    let result = await db.collection("chatmessage").find().toArray();
    res.render('index', {
            message: result[0]
                // contacts: result
        })
        // db.collection("chatMessege1").find().toArray(function(err, result) {
        //     // res.send(result)
        //     res.render('index', {message: result[2].userId})
        //     dbF.close()
        //     });
        // let result = await db.collection('chatmessage').findOne({ userId: "xxyyzz" });
        // res.json(result);
});

app.get("/roboshop/chat/userId/:userId", async(req, res) => {
    let userId = req.params.userId;
    console.log("GET: /roboshop/chat/userId/" + userId);

    let match = { "userId": userId };
    let project = { _id: 0, query: 1, responseMessages: 1 }
        // let group = { _id: { date: "$date", userId: "$userId", query: "$query", responseMessages: "$responseMessages" } };
    let sort = { date: 1 };
    let result = await db.collection('chatmessage').aggregate(
        [
            { $match: match },
            { $project: project },
            // { $group: group },
            { $sort: sort },
            { $limit: 30 }
        ]
    ).toArray();

    console.log("result: ", result);
    res.json(result);
})

app.listen(8080, () => {
    console.log(`Server is running on port : 8080`)
})

module.exports = app