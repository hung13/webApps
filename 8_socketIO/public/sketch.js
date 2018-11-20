var socket;

var block;
var blocks = [];
var zoom = 1;

function setup(){
	createCanvas(840, 390);
	socket = io.connect('http://localhost:3000');

	block = new Block(25, random(40, 390), 25, 40);

	var data = {
		x: block.pos.x,
		y: block.pos.y,
		w: block.w,
		h: block.h
	};

	socket.emit('start', data);

	socket.on('heartbeat', function(data){
		blocks = data;
	})

	
}

function draw(){
	background(0);
	// translate(width/2, height/2);
	// translate(-block.pos.x, -block.pos.y);

	for (var i = blocks.length - 1; i >= 0; i--){
		// var id = blocks[i].id;
		// console.log(blocks[i].id + ", " + socket.id);
		if (blocks[i].id !== socket.id){
			fill(255, 0, 0);
			stroke(255);
			rect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h);
		}
	}


	block.show();
	// if (mouseIsPressed){
	// 	console.log('in mouseIsPressed');
	// 	block.update();
	// }

	// if (keyIsPressed){
	// 	console.log('in keyIsPressed');
	// 	if (keyCode == RIGHT_ARROW){
	// 		console.log('in keyCode');
	// 		block.update();
	// 	}
	// }

	// block.constrain();


	var data = {
		x: block.pos.x,
		y: block.pos.y,
		w: block.w,
		h: block.h
	};

	socket.emit('update', data);
}

function keyPressed(){
	console.log('in keyPressed');
	if (keyCode === RIGHT_ARROW){
		console.log('in keycode');
		block.update(5);
	}
}