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

  //sends player data when new user joins the server
  var playerData = {
    x: player1.pos.x,
    y: player1.pos.y,
    w: player1.w,
    h: player1.h,
  };

  socket.emit('start', playerData);

  //gets all player and obstacle data from server and save to
  //local data to be drawn on screen
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

  //color player, underlying idea to make players
  //different colors as they join the game to differentiation
  player1.show(playerStroke);

  //gather updated player data and send to  server
  var playerData = {
    x: player1.pos.x,
    y: player1.pos.y,
    w: player1.w,
    h: player1.h,
  };

  socket.emit('update', playerData);

  //draw the other players to player1's screen
  for (var i = 0; i < playersArr.length; i++){
    if (playersArr[i].id !== socket.id){
      fill(255);
      stroke(0);
      rect(playersArr[i].x, playersArr[i].y - playersArr[i].h - 1, playersArr[i].w, playersArr[i].h);
    }
  }

  //randomly generate obstacles based on a timer 
  obstacleTimer++;
  if (obstacleTimer > timeBetweenObs + randomAddTime){
    addObstacle();
  }

  //update obstacles 
  moveObstacles();
  showObstacles();
}

//generate obstacles
function addObstacle(){
  var randDistance = random(1000, 2000);

  //set and send obstable data to server to update to other players
  //this is inefficient because every client is generating obstacles
  //so an excess of obstacles can flood the server as new players join
  var obsData = {
    x: player1.pos.x + randDistance,
    y: height,
    w: 15,
    h: 50,
    c: obstableCount,
  };

  socket.emit('newObstacles', obsData);

  //randomizing obstacle generations
  randomAddTime = random(200);
  obstacleTimer = 0;

  //speeds up obstacles as game goes on
  obstacleVel += obstacleAcc;
  obstableCount += 1;
}

function moveObstacles(){
  var playerLeft = player1.pos.x;
  var playerRight = playerLeft + player1.w;

  for (var i = 0; i < obstaclesArr.length; i++){
    //collision logic
    var objLeft = obstaclesArr[i].x;
    var objRight = objLeft + obstaclesArr[i].w;

    if ((playerLeft <= objRight && playerRight >= objLeft) || (objLeft <= playerRight && objRight >= playerLeft)){
      var playerBottom = player1.pos.y;
      var objTop = obstaclesArr[i].y - obstaclesArr[i].h;

      if (playerBottom >= objTop){
        //for now, color player white when player collide. 
        //with implementation of gamerooms, collision will remove player
        //game room and give player option to join another game
        playerStroke = 255;
        socket.emit('playerLost');
      }
    }

    //if object moves past player, remove from array to save memory
    //otherwise, update position
    if (obstaclesArr[i].x + 400 < player1.pos.x){
      obstaclesArr.splice(i, 1);
    } else{
      obstaclesArr[i].x += obstacleVel;
    } 
  }
}

function showObstacles(){
  for (var i = 0; i < obstaclesArr.length; i++){
    //draw obstacles with array
    fill(255, 0, 0);
    rect(obstaclesArr[i].x, obstaclesArr[i].y - obstaclesArr[i].h - 1, obstaclesArr[i].w, obstaclesArr[i].h);

    //send updated data to server to broadcast to other players
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
