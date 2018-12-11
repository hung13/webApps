var playersArr = [];
var obstaclesArr = [];

function Playerblock(id, x, y, w, h) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function Obstacleblock(id, x, y, w, h, c){
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
}

var express = require('express');
var app = express();

var server = app.listen(3000, listenFunc);

function listenFunc() {
    console.log('listening on 3000...');
}

app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);

setInterval(syncPlayers, 33);
setInterval(syncObstacles, 800);

function syncPlayers() {
    io.sockets.emit('syncPlayers', playersArr);
}

function syncObstacles() {
    io.sockets.emit('syncObstacles', obstaclesArr);
}

io.sockets.on('connection', connectFunc);

function connectFunc(socket) {
    console.log('new connection: ' + socket.id);

    socket.on('start', function(data) {
        var player = new Playerblock(socket.id, data.x, data.y, data.w, data.h);
        playersArr.push(player);
    })

    socket.on('newObstacles', function(data) {
        var ob = new Obstacleblock(socket.id, data.x, data.y, data.w, data.h, data.c);
        obstaclesArr.push(ob);
        // console.log(obstaclesArr.length);
    })

    socket.on('update', function(data) {
        var player;
        for (var i = 0; i < playersArr.length; i++) {
            if (socket.id == playersArr[i].id) {
                player = playersArr[i];
            }
        } 

        if (player != undefined){
	        player.x = data.x;
	        player.y = data.y;
	        player.w = data.w;
	        player.h = data.h;
    	}
    })

    socket.on('updateObstacles', function(data) {
        for (var i = 0; i < obstaclesArr.length; i++) {
        	if (obstaclesArr[i].x + 400 < 100){
        		obstaclesArr.splice(i, 1);
        	} else{
	        	if (socket.id == obstaclesArr[i].id && data.c == obstaclesArr[i].c){
			        obstaclesArr[i].x = data.x;
			        obstaclesArr[i].y = data.y;
			        obstaclesArr[i].w = data.w;
			        obstaclesArr[i].h = data.h;
	        	}
      		}
        }        
    })

    socket.on('playerLost', function(){
    	for (var i = 0; i < playersArr.length; i++) {
    	    if (socket.id == playersArr[i].id) {
    	        playersArr.splice(i, 1);
    	    }
    	} 
    })

    socket.on('disconnect', function() {
    	for (var i = 0; i < playersArr.length; i++) {
    	    if (socket.id == playersArr[i].id) {
    	        playersArr.splice(i, 1);
    	    }
    	} 

        console.log(socket.id + ' disconnected');
    })
}