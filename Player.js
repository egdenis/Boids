Player.prototype = new Boid(10,100,100)


function Player(color,keys){
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.keys = keys;
	this.color = color;
	this.angle =  Math.random()*2*Math.PI;
	this.color_value = 400
	this.speed = 1.45;
	this.size = 3;
	this.score = 0;
}



Player.prototype.control = function(){
	if (this.keys.right[1])
		this.angle+=this.rotation_speed*2;
	if (this.keys.left[1]){
		this.angle-=this.rotation_speed*2;
	}

}

Player.prototype.draw = function() {
	ctx.strokeStyle = this.rgba_color();
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.size,0,Math.PI*2,true);
	ctx.closePath();
	ctx.stroke();
};


Player.prototype.draw_score = function(){
	
	ctx.fillStyle = this.rgba_color();
	ctx.fillRect(0,0,this.score*canvas.width/GAME.max_score,15);
}

Player.prototype.act = function(){
	this.control();
	this.move();
	this.draw();
}		

Player.prototype.win = function(){
	GAME.state = "win";
	GAME.ui.boxes[2].strokeStyle = this.rgba_color();
	GAME.ui.boxes[2].text = colorName(this.color) + " wins!"
	GAME.ui.boxes[2].lineWidth = .8
}