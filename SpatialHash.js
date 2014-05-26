function SpatialHash(cell_size,boundsX,boundsY){
	this.cell_size = cell_size;
	this.bounds = [Math.ceil(boundsX/cell_size),Math.ceil(boundsY/cell_size)];
	this.grid = new Array(Math.ceil(boundsX/cell_size));
	for (var i = this.grid.length - 1; i >= 0; i--) {
		this.grid[i] = new Array(Math.ceil(boundsY/cell_size));
		for (var x = this.grid[i].length - 1; x >= 0; x--) {
			this.grid[i][x]=[];
		};
	};
}	

SpatialHash.prototype.put = function(obj){
	var bucket = getBucket(this.cell_size,obj);
	this.grid[bucket[0]][bucket[1]].push(obj);
}



SpatialHash.prototype.get = function(bucket,index){
	if (this.grid[bucket[0]][bucket[1]]) 
		return ((index)?this.grid[bucket[0]][bucket[1]][index]:this.grid[bucket[0]][bucket[1]]);
	else
		throw "bucket " + bucket +" non-existant"; //if bucket exist then return bucket or bucket index else throw error
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
SpatialHash.prototype.relocate = function(bucket,index){
	var obj = this.grid[bucket[0]][bucket[1]][index],
		currentBucket = getBucket(this.cell_size,obj);
	if (currentBucket[0]!=bucket[0]||currentBucket[1]!=bucket[1]) {
		this.put(obj);
		this.remove(bucket,index);
		
	};
}

SpatialHash.prototype.getSurroundingCellContents = function(bucket){
	return this.get(bucket).concat(this.get([(bucket[0]+1)%this.bounds[0],bucket[1]]), 						//center, right center
								   this.get([bucket[0],(bucket[1]+1)%this.bounds[1]]), 						//bottom center
								   this.get([(bucket[0]+1)%this.bounds[0],(bucket[1]+1)%this.bounds[1]]), 		//corner bottom right
								   this.get([mod(bucket[0]-1,this.bounds[0]),bucket[1]]), 					//left center
								   this.get([bucket[0],mod(bucket[1]-1,this.bounds[1])]), 					//top center
								   this.get([mod(bucket[0]-1,this.bounds[0]),mod(bucket[1]-1,this.bounds[1])]), //corner top left
								   this.get([(bucket[0]+1)%this.bounds[0],mod(bucket[1]-1,this.bounds[1])]), 	//corner top right
								   this.get([mod(bucket[0]-1,this.bounds[0]),(bucket[1]+1)%this.bounds[1]]));	//corner bottom left
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