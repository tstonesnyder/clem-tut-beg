'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = function (app, db) {
  // Instantiate the ClickHandler function object, and pass it the db object:
  var clickHandler = new ClickHandler(db);
  
  // Use Express's route() function (alternative to Node's app.get):
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });
    
  // Run the getClicks function whenever there is an HTTP GET request on this route.
  // Run the addClick func when HTTP POST request on this route, etc.
  // [Note that in order to be called from app.route().get(), this function must have the 2 args req and res.]
  // When you go to this route in browser (a GET) you should see [{"clicks":0}]
  // localhost:3000/api/clicks
  // or on Cloud9:
  // https://clem-tutorial-beg-tstonesnyder.c9users.io/api/clicks
  app.route('/api/clicks')
    .get(clickHandler.getClicks)
    .post(clickHandler.addClick)
    .delete(clickHandler.resetClicks);
};