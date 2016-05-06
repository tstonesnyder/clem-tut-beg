'use strict';

function clickHandler (db) {
  // Mongo will create this collection if it doesn't exist:
  var clicks = db.collection('clicks');
  
  // Define a method to retrieve the current number of clicks from the db:
  // This takes a request obj and a response obj.
  this.getClicks = function (req, res) {
    // Don't include the _id field in the results:
    var clickProjection = { '_id': false };

    // Query the db (there should only be 1 document):
    clicks.findOne({}, clickProjection, function (err, result) {
      if (err) {
          throw err;
      }
      
      if (result) {
        // Send a response to the browser via JSON:
        res.json(result);
      } else {
        // No docs in collection, need to insert our doc:
        clicks.insert({ 'clicks': 0 }, function (err) {
          if (err) {
            throw err;
          }

          // Try to get the doc we just added:
          clicks.findOne({}, clickProjection, function (err, doc) {
            if (err) {
              throw err;
            }

            res.json(doc);
          });
        });
      }
    });
  };
  
  // Increment the clicks count in the db:
  this.addClick = function (req, res) {
    // return all docs, sorted by id, increment clicks field by 1:
    clicks.findAndModify(
      {},
      { '_id': 1 },
      { $inc: { 'clicks': 1 } },
      function (err, result) {
        if (err) { throw err; }

        // send the results to the browser in JSON format:
        res.json(result);
      }
    );
  };
  
  // Reset the clicks count to 0 in the db:
  this.resetClicks = function (req, res) {
    // return all docs, and update the clicks field to 0:
    clicks.update(
      {},
      { 'clicks': 0 },
      function (err, result) {
        if (err) { throw err; }

        // send the results to the browser in JSON format:
        res.json(result);
      }
    );
  };
}

module.exports = clickHandler;