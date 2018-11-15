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
        if (err) {
            return res.status(500).send(err.message);
        }

        if (users === null) {
            res.status(404).jsonp('User with id ' + req.params.id + ' not found');
        }
        else {
            console.log('GET /users/' + req.params.id);
            res.status(200).jsonp(users);
        }
    });
};

//POST - Insert a new Users in the DB
exports.addUser = function (req, res) {
    checkUsersFieldsForAdd(req.body).then(values => {
        getNewId().then(id => {
            getHash(req.body.password).then(hash => {
                var users = new Users({
                    _id: id,
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    creation: getDate(),
                    lastLogin: getDate()
                });

                users.save(function (err, users) {
                    if (err)
                        return res.status(500).send(err.message);

                    console.log('POST /users/add/' + id);
                    res.status(201).jsonp(users);
                });
            }).catch(err => {
                return res.status(500).send(err.message);
            })
        })
    }).catch(reason => {
        return res.status(500).send(reason.message);
    });
};

function checkUsersFieldsForAdd(usersJson) {
    var p1 = checkAField(usersJson.email, 'Email');
    var p2 = checkAField(usersJson.username, 'Username');
    var p3 = checkAField(usersJson.password, 'Password');

    return Promise.all([p1, p2, p3]);
}

function checkAField(data, field) {
    return new Promise(function (resolve, reject) {
        checkField(data, field).then(content => {
            resolve(content);
        }).catch(err => {
            reject(err);
        });
    });
}

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
        if (pass === undefined || pass.length === 0) {
            reject(new Error('A password is required'));
        }

        for (i = 0; i < pass.length; i++) {
            chr = pass.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        resolve(hash.toString());
    });
};

function checkField(field, name) {
    return new Promise(function (resolve, reject) {
        field != undefined ? resolve() : reject(new Error(name.toString() + " field is required"));
    });
}

function checkUpdateString(field, data) {
    return field != null ? field : data;
}

function getDate() {
    var date = new Date();
    return date;
}

function checkUpdateString(field, data) {
    // return field !== null ? field : data;
    if (field !== null && field !== undefined) {
        return field;
    } else {
        return data;
    }
}

//PUT - Update a register already exists
exports.updateUser = function (req, res) {
    Users.findById(req.body.id, function (err, users) {
        if (users === null) {
            res.status(404).jsonp('User with id ' + req.body.id + ' not found');
        }
        else {
            users.email = checkUpdateString(req.body.email, users.email);
            users.username = checkUpdateString(req.body.username, users.username);

            getHash(req.body.password).then(hash => {
                users.password = hash;
            });

            users.lastLogin = getDate();

            users.save(function (err) {
                if (err)
                    return res.status(500).send(err.message);

                res.status(200).jsonp(users);
            });
        }
    });
};

//DELETE - Delete a Users with specified ID
exports.deleteUser = function (req, res) {
    Users.findById(req.params.id, function (err, users) {
        if (users === null)
            return res.status(404).send('User with id ' + req.params.id + ' not found');
        else {
            users.remove(function (err) {
                if (err)
                    return res.status(500).send(err.message);

                res.status(200).send('Deleted users with id ' + req.params.id);
            });
        }
    });
};

// Extra functions:
// 1. GET Newer users
exports.newers = function (req, res) {
    Users.find(function (err, users) {
        if (err)
            return res.status(500).send(err.message);

        users.sort(function (a, b) {
            return b.creation - a.creation;
        });

        console.log('GET /users/newers');
        res.status(200).jsonp(users);
    });
};

// 2. POST Login
exports.login = function (req, res) {
    Users.find(function (err, users) {
        if (err)
            return res.status(500).send(err.message);

        checkUsersFieldsForLogin(req.body).then(values => {
            getHash(req.body.password).then(hash => {
                let notFound = true, wrongPass = false, saved = false;
                var i = 0;

                do {
                    if (req.body.username == users[i].username) {
                        notFound = false;
                        if (hash != users[i].password) {
                            wrongPass = true;
                        } else {
                            users[i].lastLogin = getDate();

                            users[i].save(function (err) {
                                if (err)
                                    return res.status(500).send(err.message);
                            });
                        }
                    }

                    i++;
                } while (notFound && i < users.length);

                console.log('GET /users/login');
                if (notFound) {
                    res.status(404).jsonp('The user ' + req.body.username + 'is not in our datebase');
                } else {
                    if (wrongPass) {
                        res.status(404).jsonp('The password is wrong');
                    } else {
                        res.status(200).jsonp('User loged in successfully');
                    }
                }
            }).catch(err => {
                return res.status(500).send(err.message);
            })
        }).catch(reason => {
            return res.status(500).send(reason.message);
        });
    });
};

function checkUsersFieldsForLogin(usersJson) {
    var p1 = checkAField(usersJson.username, 'Username');
    var p2 = checkAField(usersJson.password, 'Password');

    return Promise.all([p1, p2]);
}