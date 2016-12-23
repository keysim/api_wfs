// =================================================================
// SHOUME ==========================================================
// =================================================================
'use strict';
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var config		= require('./api/config');
var routes		= require('./api/routes');
var http		= require('http').Server(app);
var io			= require('socket.io')(http);

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});

http.listen(5252, function(){
	console.log('Sockets listen on port 5252');
});

// =================================================================
// configuration ===================================================
// =================================================================

mongoose.connect(config.db.url, function(err) {
	if(!err)
		return console.log("Connected to MongoDB !");
    console.log("Unable to connect MongoDB.", err);
    process.exit();
});

app.set('superSecret', config.db.secret);
app.use("/static", express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));// Debug mode
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});

app.get('/', function(req, res) {
	res.send('API is running at /api');
});

app.use('/api', routes);
app.listen(config.port);