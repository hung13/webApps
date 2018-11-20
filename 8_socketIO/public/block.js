function Block(x, y, w, h){
	this.pos = createVector(x, y);
	// this.r = r;
	this.w = w;
	this.h = h;
	this.vel = createVector(0, 0);

	this.update = function(dis){
		this.pos.add(dis, 0);
	}

	this.show = function(){
		fill(255); 
		rect(this.pos.x, this.pos.y, this.w, this.h);
	}
}