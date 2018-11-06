var mongoose = require('mongoose');
require('../models/user');
var Users = mongoose.model('Users');

//GET - Return all Users in the DB
exports.findAllUsers = function (req, res) {
    Users.find(function (err, users) {
        if (err)
            res.status(500).send(err.message);

        console.log('GET /users')
        res.status(200).jsonp(users);
    });
};

//GET - Return a Users with specified ID
exports.findById = function (req, res) {
    Users.findById(req.params.id, function (err, users) {
        if (err){
            console.log("ERROR")
            return res.status(500).send(err.message);
        }

        console.log('GET /users/' + req.params.id);
        res.status(200).jsonp(users);
    });
};

//POST - Insert a new Users in the DB
exports.addUser = function (req, res) {
    console.log('POST');
    console.log(req.body);

    getNewId().then(id => {
        getHash(req.body.password).then(hash => {
            var users = new Users({
                _id: id,
                email: checkField(req.body.email, 'Email'),
                username: checkField(req.body.username, 'Username'),
                password: checkField(hash, 'Password'),
                creation: getDate(),
                lastLogin: getDate()
            });

            users.save(function (err, users) {
                if (err)
                    return res.status(500).send(err.message);

                console.log('POST /news/add/' + id);
                res.status(200).jsonp(users);
            });
        }).catch(err => {
            res.status(400).send(err.message);
        })
    })
};

function getNewId() {
    return new Promise(function (resolve, reject) {
        Users.find(function (err, users) {
            var max = 0;

            users.forEach(element => {
                if (element._id > max) { max = Number.parseInt(element._id); }
            })

            resolve(max + 1);
        });
    });
}

function getHash(pass) {
    return new Promise(function (resolve, reject) {
        var hash = 0, i, chr;
        if (pass === undefined || pass.length === 0){
            reject(hash);
        }

        for (i = 0; i < pass.length; i++) {
            chr   = pass.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        resolve(hash.toString());
    });
};

function checkField(field, name) {
    return field == '' ? res.status(400).send(name + " field is required") : field;
}

function getDate() {
    var date = new Date();
    return date;
}

function checkUpdateString(s, field){
    return s == '' ?  field : s;
}

//PUT - Update a register already exists
exports.updateUser = function (req, res) {
    Users.findById(req.params.id, function (err, users) {
        users.username = checkUpdateString(req.body.username, users.username);
        users.password = checkUpdateString(req.body.password, users.password);
        users.lastLogin = getDate();

        users.save(function (err) {
            if (err)
                return res.status(500).send(err.message);

            res.status(200).jsonp(users);
        });
    });
};

//DELETE - Delete a Users with specified ID
exports.deleteUser = function (req, res) {
    Users.findById(req.params.id, function (err, users) {
        users.remove(function (err) {
            if (err)
                return res.status(500).send(err.message);

            res.status(200).send('Deleted users with id ' + req.params.id);
        })
    });
};

// Extra functions:
// 1. GET Newer users
exports.newers = function (req, res) {
    Users.find(function (err, users) {
        if (err)
            return res.status(500).send(err.message);

        console.log('GET /users/newers');
        res.status(200).jsonp(users);
    });
};

// 2. POST Login
exports.login = function (req, res) {
    Users.find(news.date == getDate(), function (err, news) {
        if (err)
            return res.status(500).send(err.message);

        console.log('GET /users/login');
        res.status(200).jsonp(news);
    });
};
