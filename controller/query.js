async function main() {
    var dbF = require('../db');
    let db = await dbF.init();

    let result = await db.collection('chatmessage').findOne({ userId: 'xxyyzz' });
    console.log("find db: ", result.userId);

    dbF.close();
}

main();