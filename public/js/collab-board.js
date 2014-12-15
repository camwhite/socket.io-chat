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
	$scope.msgs = [];
	$scope.message = '';

	$scope.send = function() {
		socket.emit('msg:send', $scope.message);
		$scope.message = '';
	}
	socket.on('msg:sent', function(msg) {
		console.log(msg);
		$scope.msgs.push(msg);
		console.log($scope.msgs);
	});
});
