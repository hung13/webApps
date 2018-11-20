var blocks = [];

function Block(id, x, y, w, h) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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

setInterval(heartbeat, 33);

function heartbeat() {
    io.sockets.emit('heartbeat', blocks);
}

io.sockets.on('connection', connectFunc);

function connectFunc(socket) {
    console.log('new connection: ' + socket.id);

    socket.on('start', function(data) {
        var block = new Block(socket.id, data.x, data.y, data.w, data.h);
        blocks.push(block);
    })

    socket.on('update', function(data) {
        var block;
        for (var i = 0; i < blocks.length; i++) {
            if (socket.id == blocks[i].id) {
                block = blocks[i];
            }
        }

        block.x = data.x;
        block.y = data.y;
        block.w = data.w;
        block.h = data.h;
    })

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
    })
}