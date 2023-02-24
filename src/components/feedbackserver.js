var fs = require("fs");
var express = require("express")
var app = express();
const cors = require("cors")
app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
);

app.post('/feedback', (req, res) => {
    fs.writeFile("feedback.txt", req.body, function (err) {
        if (err) {
            throw err;
        } 
        console.log(req.body)   
        console.log("File Saved")
    })
})

app.listen(8080, () =>{console.log("Server listening at port 8080")})