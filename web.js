var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('HELLO WORD 2<br />THE REVENGENING');});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});