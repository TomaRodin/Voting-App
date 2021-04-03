var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var jsonfile = require('jsonfile')
let ejs = require('ejs')
var app = express();
var cookieParser = require('cookie-parser')


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    fs.readFile('data.json', function (err, data) {
        var data1 = JSON.parse(data)
        var total = Number(data1.vote1) + Number(data1.vote2)
        if (req.cookies.LoggedIn == undefined) {
            res.render(__dirname + '/public/index.ejs', { votefirst: data1.vote1, votesecond: data1.vote2, total: total });
        } else {
            res.render(__dirname + '/public/indexlog.ejs', { votefirst: data1.vote1, votesecond: data1.vote2, total: total });
        }
    })

})

app.post('/', function (req, res) {
    console.log(req.body.status)
    if (req.body.status === "first") {
        var data = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
        console.log(data)
        var newdata = Number(data.vote1) + 1
        data.vote1 = newdata
        console.log(data)
        change = JSON.stringify(data);
        fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
    }
    else if (req.body.status === "second") {
        var data = JSON.parse(fs.readFileSync('./data.json', 'UTF-8'));
        console.log(data)
        var newdata = Number(data.vote2) + 1
        data.vote2 = newdata
        console.log(data)
        change = JSON.stringify(data);
        fs.writeFileSync('./data.json', change, { encoding: 'utf8', flag: 'w' });
    }
})

app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/public/about.html')
})


app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html')
})


app.post('/login', function (req, res) {
    var username = req.body.user
    var password = req.body.pass
    console.log(username)
    console.log(password)
    var users = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));
    var user = users.find(u => u.name === req.body.user);
    if (username == user.name && password == user.pass) {
        console.log("Succesfully Login")
        res.cookie('LoggedIn', user.name)

        res.send({ redirect: true, url: "/user" })
    } else {
        res.redirect('/')
    }
});

app.get('/user', function (req, res) {
    if (req.cookies.LoggedIn == undefined) {
        res.redirect('/')
    }
    else {
        res.render(__dirname + '/public/user.ejs', { name: req.cookies.LoggedIn })
    }
})

app.get('/user/log_out', function (req, res) {
    res.clearCookie('LoggedIn')
    res.redirect('/')
})


app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/public/register.html')
})

app.post('/register', function (req, res) {
    console.log(req.body.nuser)
    console.log(req.body.npass)
    var JSONObject = fs.readFileSync(__dirname + '/data.json')

    if (JSONObject.includes(req.body.nuser)) {
        return true;
    }
    else if (JSONObject.includes(req.body.npass)) {
        return true;
    }

    else {
        var array = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
        array.push({
            "name": req.body.nuser,
            "pass": req.body.npass,
            "mail": req.body.nmail



        })

        var jsonArray = JSON.stringify(array);
        fs.writeFileSync('./users.json', jsonArray, { encoding: 'utf8', flag: 'w' });
        console.log('Created');

    }
});

app.get('/add', function (req, res) {
    if (req.cookies.LoggedIn == undefined) {
        res.redirect('/')
    }
    else {
        res.sendFile(__dirname + '/public/add.html')
    }
})

app.post('/add', function (req, res) {
    var name = req.body.name
    var first = req.body.first
    var second = req.body.second

    if (first == null || second == null || name == null) {
        return true
    }
    else {
        var votes = fs.readFileSync('./vote.json', 'utf8')
        if (votes.includes(first) || votes.includes(second)) {
            return true
        }
        else {
            var array = JSON.parse(fs.readFileSync('./vote.json', 'utf8'));
            array.push({
                "name": req.cookies.LoggedIn,
                "id": name,
                "first": first,
                "second": second,
                "numberfirst": "0",
                "numbersecond": "0"
            })

            var jsonArray = JSON.stringify(array);
            fs.writeFileSync('./vote.json', jsonArray, { encoding: 'utf8', flag: 'w' });
            res.redirect('/added')
        }
    }
})

app.get('/Search/:name', function (req, res) {
    var votes = JSON.parse(fs.readFileSync('./vote.json', 'UTF-8'));
    var vote = votes.find(u => u.id === req.params.name);
    res.render(__dirname + '/public/search.ejs', { id: vote.id, first: vote.first, second: vote.second, votefirst: vote.numberfirst, votesecond: vote.numbersecond })



})

app.post('/Search/:name', function (req, res) {
    console.log(req.body.status)
    if (req.body.status === "first") {
        var votes = JSON.parse(fs.readFileSync('./vote.json', 'UTF-8'));
        var vote = votes.find(u => u.id === req.params.name);
        console.log(votes)
        var newdata = Number(vote.numberfirst) + 1
        vote.numberfirst = newdata
        console.log(votes)
        change = JSON.stringify(votes);
        fs.writeFileSync('./vote.json', change, { encoding: 'utf8', flag: 'w' });
    }
    else if (req.body.status === "second") {
        var votes = JSON.parse(fs.readFileSync('./vote.json', 'UTF-8'));
        var vote = votes.find(u => u.id === req.params.name);
        console.log(votes)
        var newdata = Number(vote.numbersecond) + 1
        vote.numbersecond = newdata
        console.log(votes)
        change = JSON.stringify(votes);
        fs.writeFileSync('./vote.json', change, { encoding: 'utf8', flag: 'w' });
    }
})

app.get('/user/votes', function (req, res) {
    if (req.cookies.LoggedIn == undefined) {
        res.redirect('/')
    }
    else {
        var votes = JSON.parse(fs.readFileSync('./vote.json', 'UTF-8'));

        const user_votes = votes.filter((user) => user.name === 'Toma')
        res.send(user_votes)
    }
})

app.get('/added', function (req, res) {
    if (req.cookies.LoggedIn == undefined) {
        res.redirect('/')
    }
    else {
        res.sendFile(__dirname + '/public/added.html')
    }
})


app.listen(3000);