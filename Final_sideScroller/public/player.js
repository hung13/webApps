function Player() {
  this.pos = createVector(250, height);
  this.vel = createVector(0, 0);

  //speeds up game over time when added in update() (1)
  this.acc = createVector(0, 0); 
  this.w = 25;
  this.h = 50;

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.update = function() {
    //(1) speeds up game over time
    this.vel.add(this.acc); 
    this.pos.add(this.vel); 
    //update y-acceleration to have better jump mechanics
    this.acc.set(0, 0.2); 
  }


  this.display = function(color) {
    fill(255);
    stroke(color);
    rect(this.pos.x, this.pos.y - this.h - 1, this.w, this.h);
  }

  //prevent player from going below screen
  this.edges = function() {
    if (this.pos.y > height) {
      this.vel.y *= 0;
      this.pos.y = height;
    }
  }
  
  this.show = function(color){
    this.update();
    this.edges();
    this.display(color);
  }
}