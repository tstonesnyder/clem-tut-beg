'use strict';

// This script is automatically downloaded and run by the browser 
// cuz it's linked at the bottom of the <body> of index.html.

// Use an IIFE to bind all vars within to the local scope of that function.
(function () {
  // var apiUrl = 'http://localhost:3000/api/clicks';
  var apiUrl = 'https://clem-tutorial-beg-tstonesnyder.c9users.io/api/clicks';
  // Store refs to HTML elements we need:
  var addButton = document.querySelector('.btn-add');
  var deleteButton = document.querySelector('.btn-delete');
  var clickNbr = document.querySelector('#click-nbr');
  
  // This function will set up a function to run when the page loads,
  // or run it NOW if page has already loaded.
  function ready (fn) {
    // Make sure the arg is a function:
    if (typeof fn !== 'function') {
     return;
    }
  
    // If the page is loaded, run the specified function and return its results:
    if (document.readyState === 'complete') {
     return fn();
    }
  
    // If page is not yet loaded, add an event listenter 
    // (type of event, listener callback func, useCapture (default=false, should all events of the specified type be executed w/ the listener arg))
    // that will run the specified function when it IS LOADED.
    document.addEventListener('DOMContentLoaded', fn, false);
  }
  
  // Retrieve the current nbr of clicks from the API
  // method = the HTTP Method for the request: GET/POST/DELETE
  // url = the url to make the HTTP request to
  // callback = the function to run after getting the response
  function ajaxRequest (method, url, callback) {
    // Create an instance of the XMLHttpRequest object using constructor notation (so we can call its methods):
    var xmlhttp = new XMLHttpRequest();

    // Assign a callback to run whenever the readyState property of the XMLHttpRequest obj changes.
    // The readyState changes multiple times during the data retrieval process.
    xmlhttp.onreadystatechange = function () {
      // A readyState of 4 means that the operation (i.e. data retrieval) has been completed.
      // Status of 200 means the request was OK (no errors).
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        // Run the specified callback, passing it the response we got from server (the data from the AJAX request).
        callback(xmlhttp.response);
      }
    };

    // Initiate an HTTP request of the specified type
    // 3rd arg = async (make the request asynchronously)
    xmlhttp.open(method, url, true);
    // Execute the open request made above 
    // (this will cause the readyState to change and invoke the callback above)
    xmlhttp.send();
  }
   
  // This will be run as a callback in the 'ajaxRequest' function.
  // The 'data' arg here will be the xmlhttp.response obj.
  // The AJAX request will make the appropriate HTTP request, and return a STRING with the value from the API.
  function updateClickCount (data) {
    // Our data object from the API looks like: { 'clicks': 0 }, but it's returned as a STRING from the Ajax request.
    // So, here convert it the string to JSON:
    var clicksObject = JSON.parse(data);
    // SET the contents of the <span> element on the page to the clicks property of the JSON obj returned in the data:
    clickNbr.innerHTML = clicksObject.clicks;
  }
  
  // Pass the 'ajaxRequest' function to the 'ready' function so it will be called when the page is done loading.
  // Specify that 'ajaxRequest' should be a GET request at the apiUrl,
  // and when that request returns, call the 'updateClickCount' function and pass it the response from the server.
  ready(ajaxRequest('GET', apiUrl, updateClickCount));
  
  // Attach a click handler to the "CLICK ME" button (which should increment the nbr of clicks in the db):
  addButton.addEventListener('click', function () {
    // Make a POST AJAX request (which will increment the number of clicks in the db).
    ajaxRequest('POST', apiUrl, function () {
      // After the POST request completes, 
      // make a GET request (which will get the new nbr of 'clicks')
      // when the GET request returns, call 'updateClickCount' passing it the returned data
      // (which will update the page in the browser).
      ajaxRequest('GET', apiUrl, updateClickCount)
    });
  }, false);

  // Attach a click handler to the "RESET" button (which should set the nbr of clicks in the db to zero):
  deleteButton.addEventListener('click', function () {
    // Make a DELETE AJAX request (which will set nbr of clicks in db to zero).
    ajaxRequest('DELETE', apiUrl, function () {
      // After the DELETE request completes, 
      // make a GET request (which will get the new nbr of 'clicks')
      // when the GET request returns, call 'updateClickCount' passing it the returned data
      // (which will update the page in the browser).
      ajaxRequest('GET', apiUrl, updateClickCount);
    });
  }, false);
   
})();