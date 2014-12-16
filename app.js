var express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io').listen(server);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

io.sockets.on('connection', function(socket) {
	socket.broadcast.emit('user:connect', 'A user has connected');
	socket.on('msg:send', function(msg) {
		socket.broadcast.emit('user:notTyping');
		socket.broadcast.emit('msg:sent', msg);
		socket.emit('msg:sent', msg);
	});
	socket.on('user:typing', function(data) {
		socket.broadcast.emit('user:typed', data)
	});
	socket.on('user:stoppedTyping', function() {
		socket.broadcast.emit('user:notTyping');
	});
});

server.listen(1337);
