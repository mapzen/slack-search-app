var util = require('util');
var child_process = require('child_process');
var request = require('request');

module.exports = function (req, res, ops) {
  var mergeModulePath = 'node_modules/repo-crawler/bin/merge.js';
  var githubAuthToken = process.env.GITHUB_AUTH;

  var responseUrl = req.query.response_url;
  var str = '';

  var proc = child_process.spawn('node', [
    mergeModulePath,
    '--auth', githubAuthToken,
    '--org', ops.org,
    '--head', ops.head,
    '--base', ops.base
  ]);

  proc.stdout.on('data', function (data) {
    console.log(data.toString());
    str += data;
  });
  proc.stderr.on('data', function (err) {
    console.log('error', err.toString());
    str += err;
  });

  proc.on('close', function (code, data) {
    console.log('done', code);

    if (code === 0) {
      postToChannel(
        responseUrl,
        makeResponse('I tried making those pull requests and here is what I found :rocket:', str)
      );
    }
    else {
      postToChannel(
        responseUrl,
        makeResponse('I tried making those pull requests, but something went wrong :crying_cat_face:', str)
      );
    }
  });

  res.send(makeResponse('Ok, I kicked that off, so stay tuned for results. Cheers! :allthethings:',
    'attempting to merge ' + ops.head + ' into ' + ops.base));
};


function makeResponse(message, results) {

  return {
    "response_type": "in_channel",
    "text": message,
    "attachments": [
      {
        "text": results,
        "color": "#F78181"
      }
    ]
  };
}

function postToChannel(responseUrl, payload) {
  request({
      url: responseUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    },
    function (err, res, body) {
      if (err) {
        console.log('sent update', body)
      }
    });
}

