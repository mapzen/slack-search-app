'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var search = require('./src/search');
var autocomplete = require('./src/autocomplete');
var merge = require('./src/merge');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/search', function(req, res) {
  search(req, res);
});

app.get('/autocomplete', function(req, res) {
  autocomplete(req, res);
});

app.get('/merge_stage_to_prod', function(req, res) {
  merge(req, res, {
    org: 'pelias',
    head: 'staging',
    base: 'production'
  });
});


app.get('/merge_master_to_stage', function(req, res) {
  merge(req, res, {
    org: 'pelias',
    head: 'master',
    base: 'staging'
  });
});

app.listen(process.env.PORT || 3000);
console.log('listening on localhost:3000');