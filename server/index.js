var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Twit = require('twit');

var twitterKeys = require('./../src/SECRETS.js').twitter;

var T = new Twit({
  consumer_key:         twitterKeys.consumer_key,
  consumer_secret:      twitterKeys.consumer_secret,
  access_token:         twitterKeys.access_token,
  access_token_secret:  twitterKeys.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            false,     // optional - requires SSL certificates to be valid.
});

var twitterStream = T.stream('statuses/filter', { track: 'reactjs'});
twitterStream.on('tweet', function(tweet) {

  const { place, geo, coordinates } = tweet;
  if (!place && !geo && !coordinates) return; // ignore geo-less tweets

  io.emit('tweet', tweet);
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});
http.listen(3001, function(){
  console.log('listening on *:3001');
});
