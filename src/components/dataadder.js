var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        throw err;
    }
    var db = client.db("Final_Project");
    const Sample = {'values': [[30, 20, 10, 5, 3, 6, 14, 11, 17, 26, 24, 22, 25, 28, 27, 29, 40, 36, 33, 38, 31, 35, 37, 39, 50, 44, 56, 43, 46, 54, "58"], [20, 5, 10, 7, 9, 30, 22, 25, 23], [15, 3, 2, 7, 5, 30, 40, 35, 33, 37, 47, 46, 49]]}
    db.collection("Sample").insertOne(Sample, function (err) {
        if (err) {
            throw err;
        }
        console.log("Successfully inserted");
        client.close();
    })
})