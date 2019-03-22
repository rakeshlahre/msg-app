// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();

app.use(serveStatic(path.join(__dirname, 'dist')));
app.use('/health-check', (req, res) => {
  res.send('ok');
})

var port = process.env.PORT || 8080;
app.listen(port);
console.log('server started '+ port);