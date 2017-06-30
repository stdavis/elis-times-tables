var alexa = require('alexa-app');
// var timestables = require('timestables');

var app = new alexa.app('elisburnday');

app.launch((req, res) => {
    res.ask('What level...');
});

exports.handler = app.lambda();
