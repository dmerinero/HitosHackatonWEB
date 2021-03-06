'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.PORT || 619
var router = express.Router();

const app = express()
require('events').EventEmitter.prototype._maxListeners = 100;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)

// API routes for News
var news = express.Router();
require('./routes/newsRoutes')(news)
app.use('/api', news);

// API routes for Users
var users = express.Router();
require('./routes/usersRoutes')(users)
app.use('/api', users);

app.get('/api/hora', (req, res) => {
  var date = new Date()
  res.send({
    message: `It is ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  })
})

app.get('/api/lmgtfy/:search', (req, res) => {
  var searchString = req.params.search;
  replaceAll(searchString, "+", "%2B").then(content => {
    replaceAll(content, " ", "+").then(content => {
      var url = `http://lmgtfy.com/?q=${content}`;

      res.json({
        message: `Let me Google that for you ${searchString}: ${url}`
      })
    });
  });
})

function replaceAll(s, search, replacement) {
  return new Promise(function (resolve, reject) {
    resolve(s.toString().split(search).join(replacement));
  });
}

mongoose.connect('mongodb://localhost/HackatonTeamAPI', function (err, res) {
  if (err) {
    console.log(`ERROR: connecting to Database. ${err}`);
  }
  app.listen(port, () => {
    console.log(`API REST running on port ${port}`)
  })
});
