var request = require('request');

function isValidRequest(req, res) {
  /*
   token=<string>
   team_id=<string>
   team_domain=example
   channel_id=<string>
   channel_name=test
   user_id=<string>
   user_name=<string>
   command=/pelias_search
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

function sendRequest(pelias_host, endpoint, api_key, params, callback) {
  var url = pelias_host + endpoint + '?api_key=' + api_key + '&' + params;

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

function makeResponse(pelias_host, url, places) {
  var message = makeSearchLink(url);
  message += makeCompareLink(pelias_host, url);
  //message += makeMapLink(places);
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

function makeCompareLink(pelias_host, url) {
  var compareUrl = url.replace(pelias_host, 'http://pelias.github.io/compare/#').replace('?', '%3F');

  return '<' + compareUrl + '| Click to see in compare app>\n';
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

module.exports.isValidRequest = isValidRequest;
module.exports.sendRequest = sendRequest;
module.exports.makeResponse = makeResponse;
