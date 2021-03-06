
AIBoid.prototype = new Boid(1000,100,100);


function AIBoid(near,color,keys){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.color = color;
	this.keys = keys;
	this.angle =  Math.random()*2*Math.PI;
	this.color_value = 950
	this.speed = 1.45;
	this.size = 3;
	this.score = 0;
	this.draw = Player.prototype.draw;
	this.win = Player.prototype.win;
	this.near_value = near;
}

AIBoid.prototype.act = function(boids){

	var near = near_boids(this.near_value, this, boids),
			too_near = near_boids(40,  this, near),
			average_location_flock = average_location(near);

	if (near.length>0){
		this.rotate_towards(average_direction(near))
	}
	
	if(too_near.length>0) {
		this.rotate_away(average_direction(too_near))
	}

	this.move();
	this.draw();
}
