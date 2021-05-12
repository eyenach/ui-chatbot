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


    //find => select * from db1 where userId = 1
    //project => select userId , displayName from db1

    db.collection("chatMessege1").find().project({ _id:0 , userId:1 , displayName:1 , date:1}).toArray(
        function(err, result) {
            console.log("dwsfda ",result)
            res.json(result)
            dbF.close()
        }
    );
    // res.json({"contact":["Shop","Eye"]});
})


app.get('/roboshop/admin', async (req, res) => {
 
    
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