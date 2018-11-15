var mongoose = require('mongoose');
require('../models/news');
var News = mongoose.model('News');

//GET - Return all News in the DB
exports.findAllNews = function (req, res) {
    News.find(function (err, news) {
        if (err)
            res.status(500).send(err.message);

        console.log('GET /news')
        res.status(200).jsonp(news);
    });
};

//GET - Return a News with specified ID
exports.findById = function (req, res) {
    News.findById(req.params.id, function (err, news) {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (news === null) {
            res.status(404).jsonp('News with id ' + req.params.id + ' not found');
        }
        else {
            console.log('GET /news/' + req.params.id);
            res.status(200).jsonp(news);
        }
    });
};

//POST - Insert a new News in the DB
exports.addNews = function (req, res) {
    console.log('POST');
    console.log(req.body);

    getNewId().then(content => {
        var news = new News({
            _id: content,
            title: checkField(req.body.title),
            date: getDate(),
            country: checkField(req.body.country),
            text: checkField(req.body.text),
            author: checkField(req.body.author),
            section: checkField(req.body.section)
        });

        news.save(function (err, news) {
            if (err)
                return res.status(500).send(err.message);

            console.log('POST /news/add/' + content);
            res.status(201).jsonp(news);
        });
    })
};

function checkField(field) {
    return checkUpdateString(field, '');
}

function getNewId() {
    return new Promise(function (resolve, reject) {
        News.find(function (err, news) {
            var max = 0;

            news.forEach(element => {
                if (element._id > max) { max = Number.parseInt(element._id); }
            })

            resolve(max + 1);
        });
    });
}

function getDate() {
    var date = new Date();
    return date;
}

//PUT - Update a register already exists
exports.updateNews = function (req, res) {
    News.findById(req.body.id, function (err, news) {
        news.title = checkUpdateString(req.body.title, news.title);
        news.country = checkUpdateString(req.body.country, news.country);
        news.text = checkUpdateString(req.body.text, news.text);
        news.author = checkUpdateString(req.body.author, news.author);
        news.section = checkUpdateString(req.body.section, news.section);

        news.save(function (err) {
            if (err)
                return res.status(500).send(err.message);

            res.status(200).jsonp(news);
        });
    });
};

function checkUpdateString(field, data) {
    return field != null ? field : data;
}

//DELETE - Delete a News with specified ID
exports.deleteNews = function (req, res) {
    News.findById(req.params.id, function (err, news) {
        if (users === null)
            return res.status(404).send('News with id ' + req.params.id + ' not found');
        else {
            news.remove(function (err) {
                if (err)
                    return res.status(500).send(err.message);

                res.status(200).send('Deleted news with id ' + req.params.id);
            })
        }
    });
};

// Extra functions:
// 1. GET News by section
exports.findBySection = function (req, res) {
    News.find(function (err, news) {
        if (err) {
            return res.status(500).send(err.message);
        }

        for (i = 0; i < news.length; i++) {
            if (news[i].section != req.params.section) {
                news.splice(i, 1);
                i--;
            }
        }

        console.log('GET /news/section/' + req.params.section);
        res.status(200).jsonp(news);
    });
};

// 2. GET Today's News
exports.todaysNews = function (req, res) {
    News.find(function (err, news) {
        if (err) {
            return res.status(500).send(err.message);
        }

        var today = getDate();

        for (i = 0; i < news.length; i++) {
            if (!isSameDay(news[i].date, today)) {
                news.splice(i, 1);
                i--;
            }
        }

        console.log('GET /news/todaysNews');
        res.status(200).jsonp(news);
    });
};

function isSameDay(date1, date2) {
    return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()
        && date1.getFullYear() == date2.getFullYear();
}
