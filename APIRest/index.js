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
  var url = "http://lmgtfy.com/?q=" + searchString.toString().replace("+", "%2B").replace(" ", "+");

  res.json({
    message: `Let me Google that for you ${searchString}: ${url}`
  })
})

app.listen(port, () => {
  console.log(`API REST running on port ${port}`)
})
