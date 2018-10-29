'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 619

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/hora', (req, res) => {
  var date = new Date()
  res.send({ 
    message: `It is ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  })
})

app.get('/api/lmgtfy/:search', (req, res) => {
  var searchString = req.params.search;
  replaceAll(searchString,"+", "%2B").then(content => {
    replaceAll(content, " ", "+").then(content => {
      var url = "http://lmgtfy.com/?q=" + content;
      
      console.log(url);

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

app.listen(port, () => {
  console.log(`API REST running on port ${port}`)
})
