function SpatialHash(cell_size,boundsX,boundsY){
	this.cell_size = cell_size;
	this.bounds = [Math.ceil(boundsX/cell_size),Math.ceil(boundsY/cell_size)];
	this.grid;
	this.clear();
}	

SpatialHash.prototype.clear = function(){
	console.log(this.bounds[1]+1/this.cell_size)
	this.grid = new Array(this.bounds[0]);
	for (var i = this.grid.length - 1; i >= 0; i--) {
		this.grid[i] = new Array(this.bounds[1]);
		for (var x = this.grid[i].length - 1; x >= 0; x--) {
			this.grid[i][x]=[];
		};
	};
}

SpatialHash.prototype.put = function(obj){
	var bucket = getBucket(this.cell_size,obj);
	if (this.grid[bucket[0]]==undefined) {console.log(bucket)}
	else
		this.grid[bucket[0]][bucket[1]].push(obj);
}

SpatialHash.prototype.drawGrid = function(){
	for (var y = 0; y < this.bounds[1]; y++){
		for (var x = 0; x < this.bounds[0]; x++){
			ctx.strokeRect(x*this.cell_size,y*this.cell_size,this.cell_size,this.cell_size);			
		};
	};
}

SpatialHash.prototype.getOccupiedBucket = function(){
	var contents;
	for (var y = 0; y < this.bounds[1]; y++){
		for (var x = 0; x < this.bounds[0]; x++){
			if(this.grid[x][y].length>2)
				contents = ([x,y])
		};
	};
	console.log(this.get(contents,0) )
	console.log(this.grid[contents[0]][contents[1]])
	console.log(contents)
	return contents;
}

SpatialHash.prototype.get = function(bucket,index){

	if (index!=undefined) {
		var copy = this.grid[bucket[0]][bucket[1]].slice();
		copy.splice(index,1)
		return copy;
	}
	else {
		return this.grid[bucket[0]][bucket[1]]
	}
	
 //if bucket exist then return bucket or bucket index else throw error
}

SpatialHash.prototype.set = function(bucket,value,index){
	(index)?this.grid[bucket[0]][bucket[1]][index] = value:this.grid[bucket[0]][bucket[1]] = value;
}

SpatialHash.prototype.remove = function(bucket,index){
	this.grid[bucket[0]][bucket[1]].splice(index,1);	
}

SpatialHash.prototype.getContents = function(){
	var contents = [];
	for (var i = this.grid.length - 1; i >= 0; i--) {
		contents.concat(this.grid[i]);
	};
	return contents;
}
SpatialHash.prototype.relocate = function(){
	for (var x = this.grid.length - 1; x >= 0; x--) {
		for (var y = this.grid[x].length - 1; y >= 0; y--) {
			for (var i = this.grid[x][y].length - 1; i >= 0; i--) {

				var obj = this.grid[x][y][i],
					currentBucket = getBucket(this.cell_size,obj);

				if (currentBucket[0]!=x||currentBucket[1]!=y) {
					this.put(obj);
					this.remove([x,y],i);
		
				};
			
			};
		};
	};
	
}

SpatialHash.prototype.getSurroundingCellContents = function(bucket,index){
	return this.get(bucket,index).concat(this.grid[(bucket[0]+1)%this.bounds[0]][bucket[1]], 						//center, right center
								   this.grid[bucket[0]][(bucket[1]+1)%this.bounds[1]], 						//bottom center
								   this.grid[(bucket[0]+1)%this.bounds[0]][(bucket[1]+1)%this.bounds[1]], 		//corner bottom right
								   this.grid[mod(bucket[0]-1,this.bounds[0])][bucket[1]], 				//left center
								   this.grid[bucket[0]][mod(bucket[1]-1,this.bounds[1])], 					//top center
								   this.grid[mod(bucket[0]-1,this.bounds[0])][mod(bucket[1]-1,this.bounds[1])], //corner top left
								   this.grid[(bucket[0]+1)%this.bounds[0]][mod(bucket[1]-1,this.bounds[1])], 	//corner top right
								   this.grid[mod(bucket[0]-1,this.bounds[0])][(bucket[1]+1)%this.bounds[1]]);	//corner bottom left
}

SpatialHash.prototype.toString = function(){
	for (var y = 0; y < this.bounds[1]; y++){
		for (var x = 0; x < this.bounds[0]; x++){
			if(this.grid[x][y].length>0)
				console.log("Bucket " + y+x +": "+this.grid[x][y])
		};
	};
}

SpatialHash.prototype.toArray = function(){
	var contents = [];
	for (var y = 0; y < this.bounds[1]; y++){
		for (var x = 0; x < this.bounds[0]; x++){
			contents = contents.concat(this.grid[x][y])
		};
	};
	return contents;
}

function getBucket(cell_size,obj){
	return [Math.floor(obj.x/cell_size),Math.floor(obj.y/cell_size)]
}