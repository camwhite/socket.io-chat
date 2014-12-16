var app = angular.module('app', []);

app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

// app.directive('chatBoard', function(socket) {
//
// 	function link(scope, element, attrs) {
// 		socket.on('msg:sent', function(msg) {
// 			console.log('msg:sent ' + msg);
// 			scope.msgs.push(msg);
// 		});
//
// 		scope.send = function() {
// 			socket.emit('msg:send', scope.message);
// 			scope.message = '';
// 		}
// 	}
//
// 	return {
// 		link: link,
// 		template: '<ul><li ng-repeat="msg in msgs">{{ msg }}</li></ul>',
// 		restrict: 'E'
// 	};
// });

app.controller('MainCtrl', function($scope, socket) {
	socket.on('user:connect', function(data) {
		$scope.msgs.push(data);
	});

	$scope.msgs = [];
	$scope.message = '';

	var submitted = false;
	$scope.send = function() {
		socket.emit('msg:send', $scope.message);
		$scope.message = '';
		submitted = true;
		typing = false;
	}
	socket.on('msg:sent', function(msg) {
		console.log(msg);
		$scope.msgs.push(msg);
		console.log($scope.msgs);
	});


	var typing = false;
	$scope.$watch('message', function(newVal, oldVal) {
		console.log(typing, submitted, $scope.message.length)
		if(newVal.length >= 1) {
			submitted = false;
		}
		if(newVal.length > 1 && !typing && !submitted) {
			typing = true;
			socket.emit('user:typing', 'A user is typing');
		}
		if(newVal.length < 1 && typing && !submitted) {
			socket.emit('user:stoppedTyping');
			typing = false;
		}
	});

	socket.on('user:typed', function(data) {
		$scope.msgs.push(data);
	});
	socket.on('user:notTyping', function() {
		$scope.msgs.pop();
	});
});
