var express = require('express')
var MongoClient = require('mongodb').MongoClient
//var sample = getSampleText()

var app = express()
const PORT = process.env.PORT || 8080

app.get("/sample",(req,res)=>{
    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        var db = client.db('Final_Project')
        db.collection('Sample').find({}).toArray((err, docs) => {
            console.log(docs)
            var sample = JSON.stringify(docs)
            console.log(sample)
            res.writeHead(200,{'Content-type':'application/json'})
            res.write(sample)
            client.close()
            res.end()
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

