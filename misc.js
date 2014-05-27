
function onMousedown(e){
	var pos = getMousePos(canvas, e);

	for (var i = 0; i < GAME.ui.buttons.length; i++) {

		if (GAME.ui.buttons[i].isClicked(pos.x,pos.y)&&GAME.state == GAME.ui.buttons[i].state) {
			GAME.ui.buttons[i].callback();
		};
	};	
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function onMousemove(e){
	var pos = getMousePos(canvas, e);
	//console.log(GAME.boids.length)
		for (var i = GAME.ui.buttons.length - 1; i >= 0; i--) {
			if (GAME.ui.buttons[i].isClicked(pos.x,pos.y)) {
				GAME.ui.buttons[i].fillStyle = "rgb(80,80,80)";
			}
			else
				GAME.ui.buttons[i].fillStyle = "rgb(50,50,50)";
		};
	

}

function colorName(color){		//converts boid color to color name
	var colors = [[[["black"],["blue"]],[["green"],["turquoise"]]] , [[["red"],["purple"]],[["yellow"],["white"]]]]
	return colors[color[0]][color[1]][color[2]];
}

function direction_to(boid, target){
	return Math.atan2(target[1]-boid.y,target[0]-boid.x);
}

function average_direction(boids){
	var total = 0;
	for (var i = boids.length - 1; i >= 0; i--) {
		total += boids[i].angle;
	};
	return total/boids.length;
}

function near_boids(dis, boid, boids){
	var near = [];
	for (var i = boids.length - 1; i >= 0; i--) {
		if(distance(boid, boids[i])<dis)
			near.push(boids[i]);

	};
	return near;
}

function average_location(boids){
	var totalX = 0,
		totalY = 0;

	for (var i = boids.length - 1; i >= 0; i--){
		totalX += boids[i].x;
		totalY += boids[i].y;
	}
	
	return [totalX/boids.length, totalY/boids.length];
}



function distance(boid1, boid2) {
	return Math.sqrt(Math.pow(boid1.x-boid2.x,2)+Math.pow(boid1.y-boid2.y,2))
}



function onKeydown(e){
	var k = e.keyCode,
		players = GAME.players.toArray();

	for (var i = players.length - 1; i >= 0; i--) {
		switch (k) {
		
			case (players[i].keys.left[0]): // Left
					players[i].keys.left[1]=true;
				break;
			
			case (players[i].keys.right[0]): // Right
					players[i].keys.right[1]=true;
				break;
		};
	};	
}

function onKeyup(e) {
	var k = e.keyCode,
		players = GAME.players.toArray();

	for (var i = players.length - 1; i >= 0; i--) {
		switch (k) {
		
			case (players[i].keys.left[0]): // Left
					players[i].keys.left[1]=false;
				break;
			
			case (players[i].keys.right[0]): // Right
					players[i].keys.right[1]=false;
				break;
		};
	};
};

function increment_score(){
	for (var x = GAME.players.grid.length-1; x >= 0; x--) {
		for (var y = GAME.players.grid[x].length - 1; y >= 0; y--) {
			for (var i = 0; i < GAME.players.grid[x][y].length; i++) {
				var boid = GAME.players.grid[x][y][i]
				boid.score+=GAME.score[boid.color[0]][boid.color[1]][boid.color[2]];
				if (boid.score>=GAME.max_score&&GAME.state == "game") {
					boid.win();
				}
			};

		}
	};
}

function draw_score(){
	var players = GAME.players.toArray().sort(function(a, b){
		return a.score-b.score;
	})
	for (var i = 0; i <players.length ; i++) {
			var xStart = ((i-1>-1) ? players[i-1].score*canvas.width/GAME.max_score : 0);
			ctx.fillStyle = players[i].rgba_color(.1);
			ctx.fillRect(xStart,0,players[i].score*canvas.width/GAME.max_score-xStart,15)
	}
		GAME.score = [[[0,0],[0,0]] , [[0,0],[0,0]]];

}

function Keys(r,l){
	this.right = [r,false];
	this.left = [l,false];
}

function roundRect (ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function mod(m, n) {
        return (m<0)?n+m:m;
}



var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


/*
multi canvas
*/