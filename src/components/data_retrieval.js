var MongoClient = require("mongodb").MongoClient;
var http = require("http");
var express = require("express")
var app = express();
app.get('/sample',(req, res) => {
    if (req.method == "GET") {
        MongoClient.connect("mongodb://localhost:27017", function (err, client) {
            if (err) {
                throw err;
            }
            const db = client.db("Final_Project");
            db.collection("Sample_data").find({}, { projection: { _id: 0 } }).toArray(function (err, data) {
                if (err) {
                    throw err;
                }
                console.log(data);
                res.writeHead(200, { 'Content-type': 'application/json' })
                res.write(JSON.stringify(data))
                res.end();
                console.log("Data sent");
                client.close();
            })
        })
    }
})

app.get('/coords', (req, res) => {
    MongoClient.connect("mongodb://localhost:27017", function (err, client) {
        if (err) {
            throw err;
        }
        const db = client.db("Final_Project");
        db.collection("Coordinates").find({}, { projection: { _id: 0 } }).toArray(function (err, coordinates) {
            if (err) {
                throw err;
            }
            console.log(coordinates);
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.write(JSON.stringify(coordinates))
            res.end();
            console.log("Data sent");
            client.close();
        })
    })
})
app.listen(8080,()=>{console.log('Server running')})