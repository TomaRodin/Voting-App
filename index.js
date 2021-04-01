var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
let ejs = require('ejs')
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req,res){
    fs.readFile('data.json',function(err,data){
        var data1 = JSON.parse(data)
        var total = Number(data1.vote1) +  Number(data1.vote2)
        res.render(__dirname+'/public/index.ejs',{votefirst:data1.vote1, votesecond:data1.vote2, total:total});
    })
    
})

app.post('/',function(req,res){
    console.log(req.body.status)
    if (req.body.status === "first"){
        var data = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
        console.log(data)
        var newdata = Number(data.vote1) + 1
        data.vote1 = newdata
        console.log(data)
        change = JSON.stringify(data);
        fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
    } 
    else if (req.body.status === "second"){
        var data = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
        console.log(data)
        var newdata = Number(data.vote2) + 1
        data.vote2 = newdata
        console.log(data)
        change = JSON.stringify(data);
        fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
    }
})


app.listen(3000);