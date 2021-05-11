const express = require('express')
const app = express()
var path = require('path')

var indexRouter = require('./routes/index')

// connect database
let db;
var dbF = require('./db.js');
(async function() {
    db = await dbF.init();
})();

// app.get('/', (req, res) => {
//     res.sendFile('app.js', { root: path.join(__dirname, './controller') });
// });

app.use(express.static(__dirname + '/views'));

app.get("/admin", async(req, res) => {
    res.sendFile('admin.html', { root: path.join(__dirname, './views') });
});

app.use('/', indexRouter)

app.listen(8080, () => {
    console.log(`Server is running on port : 8080`)
})

module.exports = app