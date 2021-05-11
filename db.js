const fs = require('fs');
const recoveryDir = "./recovery";
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 3
}
let dbxx;
let client;

function getDB() { return dbxx };

async function close() {
    client.close();
}

async function init() {
    client = await MongoClient.connect(url, options);
    dbxx = await client.db('dev_ais');

    console.log("connect to DB", client.isConnected());
    if (!fs.existsSync(recoveryDir)) {
        fs.mkdirSync(recoveryDir);
    }

    fs.readdirSync(recoveryDir).forEach(async file => {
        //TODO
        // let pathFile = recoveryDir + "/" + file;
        // let recTxt = fs.readFileSync(pathFile, "utf-8");
        // fs.unlinkSync(pathFile);

        // let fileToIns = JSON.parse(recTxt);
        // delete fileToIns._id;

        // let x = await dbxx.collection("usages").insertOne(fileToIns);
        // console.log("recovery", fileToIns);
    });
    console.log("INIT DB");
    return dbxx;

    // var i= 0;
    // setInterval(async () => {
    //     let insertObj = {"s":"x",i:i++};

    //     try {
    //         let x = await db.collection("stats").insertOne(insertObj);
    //         console.log(x.insertedCount);

    //     } catch (error) {
    //         fs.writeFileSync(recoveryDir +"/"+ uuidv4() + ".json", JSON.stringify(insertObj) ); 
    //         console.log("write recovery file" , insertObj);
    //     }

    // }, 1000);

}

module.exports = {
    init,
    getDB,
    close
};