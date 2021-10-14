var express = require('express');
var morgan = require('morgan');

var app = express();

app.use(morgan("dev"));

const success = false;

app.post('/api/room_notes/:roomId', function (req, res) {
  if (success) {
    res.json({
      roomNote: {
        application : "attendant",
        attendant_status : "",
        date_ts : 1479408862,
        hotel_id : "55d06bb499295b3a5a000000",
        id : null,
        image : "",
        is_archived : "0",
        last_room_update : 1479408862,
        note : "Nnnnnnnnnn",
        room_housekeeping : "55d06bb499295b3a5a000006",
        room_id : "55d06bb499295b3a5a000027",
        room_name : "102",
        room_status : "55d06bb499295b3a5a000003",
        task_uuid : "",
        user_first_name : "System",
        user_id : "5630fab5ff2c919d6400042c",
        user_last_name : "System",
        user_username : "rcadmin"
      }
    });
  } else {
    res.status(500).json();
  }
});

app.get('/api/room_notes', function (req, res) {
  if (success) {
    res.json({
      results: [{
        application : "attendant",
        attendant_status : "",
        date_ts : 1479408862,
        hotel_id : "55d06bb499295b3a5a000000",
        id : null,
        image : "",
        is_archived : "0",
        last_room_update : 1479408862,
        note : "Nnnnnnnnnn",
        room_housekeeping : "55d06bb499295b3a5a000006",
        room_id : "55d06bb499295b3a5a000027",
        room_name : "102",
        room_status : "55d06bb499295b3a5a000003",
        task_uuid : "",
        user_first_name : "System",
        user_id : "5630fab5ff2c919d6400042c",
        user_last_name : "System",
        user_username : "rcadmin"
      }]
    })
  } else {
    res.status(500).json();
  }
});

app.put('/api/room_notes/:roomId/:noteId', function (req, res) {
  res.json({})
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
