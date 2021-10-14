var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan("dev"));

app.post('/api/room_notes/:roomId', function (req, res) {
  res.status(501).json()
});

app.put('/api/room_notes/:roomId/:noteId', function (req, res) {
  res.json({})
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
