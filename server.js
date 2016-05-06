'use strict';

// Express.js
var express = require('express');
// Our code for handling routes:
var routes = require('./app/routes/index.js');
// For communicating with the db:
var mongo = require('mongodb').MongoClient;

// Initialize Express BEFORE connecting to the db (so we can use it in callback below):
var app = express();

// First try to connect to the Mongo db named 'clementinejs' on port 27017.
// If this db doesn't exist, Mongo will create it.
// Port 27017 is the default port that MongoDB uses.
mongo.connect('mongodb://localhost:27017/clementinejs', function (err, db) {
  if (err) {
    //console.log(err);
    throw new Error('Database failed to connect!');
  } else {
    console.log('MongoDB successfully connected on port 27017.');
  }

  // Tell server how to find static files in this routes:
  app.use('/public', express.static(process.cwd() + '/public'));
  app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

  // // Use Node's get() function to check the user's route:
  // app.get('/', function (req, res) {
  //   //res.send('Hello world!');
  //   res.sendFile(process.cwd() + '/public/index.html');
  // });
  // Moved the code above to the routes module, pass it both the Express app and the db:
  routes(app, db);

  // Change port for Cloud9:
  // app.listen(3000, function () {
  app.listen(8080, function () {
      console.log('Listening on port 8080...');
  });
});
