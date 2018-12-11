var player1;
var playersArr = [];
var obstaclesArr = [];
var obstacleVel = -6;
var obstacleAcc = -0.1;
var obstableCount = 0;
var timeBetweenObs = 60;
var randomAddTime = 0;
var obstacleTimer = 0;
var playerStroke = 0;
var socket;

function setup() {
  createCanvas(window.innerWidth - 10, 360);
  player1 = new Player();
  socket = io.connect('http://localhost:3000');

  var playerData = {
    x: player1.pos.x,
    y: player1.pos.y,
    w: player1.w,
    h: player1.h,
  };

  socket.emit('start', playerData);

  socket.on('syncPlayers', function(data){
    playersArr = data;
  });

  socket.on('syncObstacles', function(data){
    obstaclesArr = data;
  });
}

function keyPressed(){
  //player cannot double jump
  //but small buffer to help simultaneous jumps
  if (player1.pos.y >= 330){
    if (key == ' '){
      var jump = createVector(0, -11);
      player1.applyForce(jump);
    }
  }
}

function draw() {
  background(255);

  //player pos on screen
  translate(-player1.pos.x + 250, 0);
  
  var gravity = createVector(0, 0.31);
  player1.applyForce(gravity);

  player1.show(playerStroke);

  var playerData = {
    x: player1.pos.x,
    y: player1.pos.y,
    w: player1.w,
    h: player1.h,
  };

  socket.emit('update', playerData);

  for (var i = 0; i < playersArr.length; i++){
    if (playersArr[i].id !== socket.id){
      fill(255);
      stroke(0);
      rect(playersArr[i].x, playersArr[i].y - playersArr[i].h - 1, playersArr[i].w, playersArr[i].h);
    }
  }

  obstacleTimer++;
  if (obstacleTimer > timeBetweenObs + randomAddTime){
    addObstacle();
  }

  moveObstacles();
  showObstacles();
}


function addObstacle(){
  var randDistance = random(1000, 2000);
  var obsData = {
    x: player1.pos.x + randDistance,
    y: height,
    w: 15,
    h: 50,
    c: obstableCount,
  };

  socket.emit('newObstacles', obsData);

  randomAddTime = random(200);
  obstacleTimer = 0;
  obstacleVel += obstacleAcc;
  obstableCount += 1;
}

function moveObstacles(){
  var playerLeft = player1.pos.x;
  var playerRight = playerLeft + player1.w;

  // console.log(playerLeft, playerRight, playerTop, playerBottom);

  for (var i = 0; i < obstaclesArr.length; i++){
    //collision
    var objLeft = obstaclesArr[i].x;
    var objRight = objLeft + obstaclesArr[i].w;

    if ((playerLeft <= objRight && playerRight >= objLeft) || (objLeft <= playerRight && objRight >= playerLeft)){
      var playerBottom = player1.pos.y;
      var objTop = obstaclesArr[i].y - obstaclesArr[i].h;

      if (playerBottom >= objTop){
        playerStroke = 255;
        socket.emit('playerLost');
      }
    }

    if (obstaclesArr[i].x + 400 < player1.pos.x){
      obstaclesArr.splice(i, 1);
    } else{
      obstaclesArr[i].x += obstacleVel;
    } 
  }
}

function showObstacles(){
  for (var i = 0; i < obstaclesArr.length; i++){
    // obstaclesArr[i].show();
    fill(255, 0, 0);
    rect(obstaclesArr[i].x, obstaclesArr[i].y - obstaclesArr[i].h - 1, obstaclesArr[i].w, obstaclesArr[i].h);

    var obstaclesData = {
      x: obstaclesArr[i].x,
      y: obstaclesArr[i].y,
      w: 15,
      h: 50, 
      c: obstaclesArr[i].c,
    }

    socket.emit('updateObstacles', obstaclesData);
  }
}
