'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var api_key = process.env.SEARCH_API_KEY;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/search', function(req, res) {

  if (!isValidRequest(req, res)) {
    return;
  }

  sendRequest('search', api_key, req.query.text, function (err, url, places) {
    var response = makeResponse(url, places);
    res.send(response);
  });

});

app.get('/autocomplete', function(req, res) {

  if (!isValidRequest(req, res)) {
    return;
  }

  sendRequest('autocomplete', api_key, req.query.text, function (err, url, places) {
    var response = makeResponse(url, places);
    res.send(response);
  });

});


function isValidRequest(req, res) {
  /*
   token=<string>
   team_id=<string>
   team_domain=example
   channel_id=<string>
   channel_name=test
   user_id=<string>
   user_name=<string>
   command=/mapzen_search
   text=94070
   response_url=https://hooks.slack.com/commands/1234/5678
   */

  console.log('request', JSON.stringify(req.query, null, 2));

  if(!req.query.hasOwnProperty('text')){
    res.statusCode = 400;
    res.send('Error 400: Post syntax incorrect.');
    return false;
  }

  return true;
}

function sendRequest(endpoint, api_key, params, callback) {
  var url = 'https://search.mapzen.com/v1/' + endpoint + '?api_key=' + api_key + '&' + params;
  console.log('url', url);
  request.get(url, function (err, results) {
    if (err) {
      console.log(err);
      callback(err);
      return;
    }

    console.log(results.body);

    var places = JSON.parse(results.body);
    callback(null, url, places);
  });
}

function makeResponse(url, places) {
  var message = makeSearchLink(url);
  message += makeMapLink(places);
  message += makeResultList(places);

  return {
    "response_type": "in_channel",
    "text": message,
    "attachments": [
      {
        "text": JSON.stringify(places, null, 2),
        "color": "#F78181"
      }
    ]
  };
}

function makeSearchLink(url) {
  return '<' + url + '| Click to see original query>\n';
}

function makeMapLink(places) {
  return '<' + 'http://geojson.io/#data=data:application/json,' +
         encodeURIComponent(JSON.stringify(places)) + '| Click to see on a map>\n';
}

function makeResultList(places) {
  var message = '';
  var count = 0;

  if (!places || !places.features || places.features.length === 0) {
    return 'No results found';
  }

  places.features.forEach(function (feature) {
    count++;
    message += count + '.  _' + feature.properties.label + '_\n';
  });

  return message;
}

app.listen(process.env.PORT || 3000);