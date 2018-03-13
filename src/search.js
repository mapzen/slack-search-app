var isValidRequest = require('./mapzenSearch').isValidRequest;
var sendRequest = require('./mapzenSearch').sendRequest;
var makeResponse = require('./mapzenSearch').makeResponse;

var api_key = process.env.SEARCH_API_KEY;
const pelias_host = process.env.PELIAS_HOST;

module.exports = function (req, res) {
  if (!isValidRequest(req, res)) {
    return;
  }

  sendRequest(pelias_host, 'search', api_key, req.query.text, function (err, url, places) {
    var response = makeResponse(host, url, places);
    res.send(response);
  });
};
