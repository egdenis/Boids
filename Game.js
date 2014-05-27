
var canvas,
	ctx,
	GAME;

window.onload = function(){
	canvas = document.getElementById("canvas");
	
	if(canvas.getContext)
		ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


	GAME = new Game()
	GAME_loop();
	window.addEventListener("mousedown", onMousedown, false);
	window.addEventListener("mousemove", onMousemove, false);

	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

}

GAME_loop = function(){
	
	if (GAME.initilized&&!GAME.pause) {
		ctx.fillStyle = "rgba(256,256,256,.2)"
		ctx.fillRect(0,0,canvas.width,canvas.height)
		ctx.fillStyle = "black"
		
		// /GAME.players.drawGrid();

		for (var x = GAME.boids.grid.length-1; x >= 0; x--) {
			for (var y = GAME.boids.grid[x].length - 1; y >= 0; y--) {
				for (var i = 0; i < GAME.boids.grid[x][y].length; i++) {
					var boid = GAME.boids.grid[x][y][i],
						bucket = getBucket(GAME.near_value,boid);
					boid.act(GAME.boids.getSurroundingCellContents(bucket,i).concat(GAME.players.getSurroundingCellContents(bucket))) //TO-DO remove self from near
					
				};
			}
		}
		
		GAME.boids.relocate([x,y],i);

		for (var x = GAME.players.grid.length-1; x >= 0; x--) {
			for (var y = GAME.players.grid[x].length - 1; y >= 0; y--) {
				for (var i = 0; i < GAME.players.grid[x][y].length; i++) {
					var boid = GAME.players.grid[x][y][i],
						bucket = getBucket(GAME.near_value,boid);
					boid.act(GAME.boids.getSurroundingCellContents(bucket).concat(GAME.players.getSurroundingCellContents(bucket,i))) //TO-DO remove self from near
				};
			}
		}
		
		GAME.players.relocate([x,y],i);

		increment_score();
		draw_score();
	}

		GAME.ui.drawUI(GAME.state);

		requestAnimFrame(GAME_loop);

}




function Game(){
	this.score =  [[[0,0],[0,0]] , [[0,0],[0,0]]];
	this.pause = false;
	this.near_value = 60;
	this.max_score = 1000;
	this.state = "menu";
	this.keys = [new Keys(39,37),new Keys(68,65),new Keys(74,71)];
	this.players = new SpatialHash(this.near_value,canvas.width,canvas.height);
	this.boids = new SpatialHash(this.near_value,canvas.width,canvas.height);
	this.ui = new UI([new Button(canvas.width/2-120,canvas.height/2,100,50,"1-Player","menu",(this.init.bind(this,1,100,4))),
					new Button(canvas.width/2,canvas.height/2,100,50,"2-Player","menu",(this.init.bind(this,2,100,3))),
					new Button(canvas.width/2+120,canvas.height/2,100,50,"3-Player","menu",(this.init.bind(this,3,100,2))),
					new Button(canvas.width/2,canvas.height/2+10,170,50,"Back to Menu","win",(function(){this.state = "menu"; this.players.clear();this.boids.clear;}.bind(this)))],
					[new Box(canvas.width/2,canvas.height/2-60,0,0,"rgb(50,50,50)","rgb(50,50,50)","sharpCorners","menu","Influenza",1.3,"bold 63px Verdana"),
					new Box(canvas.width/2,canvas.height/2,canvas.width,canvas.height,"rgb(240,240,240)","rgb(240,240,240)","sharpCorners","menu"),
					new Box(canvas.width/2,canvas.height/2-60,0,0,"rgb(50,50,50)","rgb(50,50,50)","sharpCorners","win","win",1.3,"bold 63px Verdana")]);		// Box(x,y,width,height,fillStyle,strokeStyle,boxStyle,text,state)
	}

Game.prototype.init = function(number_of_players, number_of_boids,cpu){
	this.state = "game";
	var colors =   [[0,0,1],[0,1,0],[1,0,0],[1,0,1],[0,1,1]];
	for (var i = number_of_players-1; i >= 0; i--) {
		this.players.put(new Player(colors[i],this.keys[i]))
	};
	for (var i = cpu-1; i >= 0; i--) {
		this.players.put(new AIBoid(this.near_value,colors[i+number_of_players],new Keys(-1,-1)))

	};

	for (var i = number_of_boids; i > 0; i--) {
		this.boids.put(new Boid(this.near_value));
	};

	this.initilized = true;
}

function UI(buttons,boxes){
	this.buttons = buttons||[];
	this.boxes = boxes||[];
}

UI.prototype.drawUI = function(state){

		for (var i = this.boxes.length - 1; i >= 0; i--) {

			if (state == this.boxes[i].state)
				this.boxes[i].draw();
		};

		for (var i = this.buttons.length - 1; i >= 0; i--) {
			if (state == this.buttons[i].state)
				this.buttons[i].draw();
		};
}

/*TODOS
boid trails,
pause menu,
ranking results,
spatial hash,
code review
*/