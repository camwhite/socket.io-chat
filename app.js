var express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

io.sockets.on('connection', function(socket) {
	console.log('user connected');
	socket.on('msg:send', function(msg) {
		socket.broadcast.emit('msg:sent', msg);
		socket.emit('msg:sent', msg);
	});
});

server.listen(1337);
