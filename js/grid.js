function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

Grid.prototype.availableContentCell = function(content) {
	var xarr = [0,1,0,-1];
  	var yarr = [1,0,-1,0];
	for (var x = 0; x < this.size; x++) {
	    for (var y = 0; y < this.size; y++) {
			if(!this.cells[x][y]) {
		      	for(var i=0; i < xarr.length;i++) {
					var tmpx = x+xarr[i];
		  			var tmpy = y+yarr[i];
		  			if (tmpx >= 0 && tmpx < this.size && tmpy >= 0 && tmpy < this.size) {
		  				if (this.cells[tmpx][tmpy] && this.cells[tmpx][tmpy].value === content) {
		  					return {
		  						x:x,
		  						y:y
		  					};
		  				}
		  			}
  				}
			}
	    }
  	}
  	return {x:-1,y:-1};
};
Grid.prototype.sort = function(arr, l , r, comparor) {
	this.quicksort(arr, l, r, comparor);	
};

Grid.prototype.swap=function(arr, i, j) {
	var t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;
};

Grid.prototype.quicksort=function(arr, l, r, comparor) {
	if (!arr || r - l <= 2 || !comparor) {
		return;
	}
	var p = (l + r)>>1;
	var point = arr[p];
	this.swap(arr, p, r-1);
	var i = l+1;
	var j = r-1;
	while( i < j) {
		for(; i < j; i++ ) {
			if (comparor(arr[i], point) > 0) {
				break;
			}
		}
		for(; j > i; j--) {
			if (comparor(arr[j], point) < 0 ) {
				break;
			}
		}
		this.swap(arr, i,j);
	}
	this.swap(arr, i,j);
	this.swap(arr, j, r-1);
	if (i === j) {
		this.quicksort(arr, -1, i, comparor);
		this.quicksort(arr, j, r, comparor);
	} else {
		this.quicksort(arr, -1, i+1, comparor);
		this.quicksort(arr, j, r, comparor);
	}
	
};

Grid.prototype.maxCellMove = function(director) {
	var maxCell = {x:-1,y:-1,value:-1};
	
	for(var x=0; x<this.size; x++) {
		for(var y=0; y < this.size; y++) {
			if (this.cells[x][y] && this.cells[x][y].value > maxCell.value) {
				maxCell = {x:x,y:y,value:this.cells[x][y].value};
			}
		}
	}
	if (maxCell.value < 512) {
		return false;
	}
	var map = {
	    0: { x: 0,  y: -1 }, // Up
	    1: { x: 1,  y: 0 },  // Right
	    2: { x: 0,  y: 1 },  // Down
	    3: { x: -1, y: 0 }   // Left
  	};
  	var directVector = map[director];
  	if(!this.moveLine(maxCell.x, maxCell.y, director)) {
  		return false;
  	}
  	var newMaxCell = {x:maxCell.x+directVector.x, y:maxCell.y+directVector.y, value:maxCell.value};
  	if (this.withinBounds(newMaxCell)) {
  		// will move, move to which position?
  		
  		if(newMaxCell.x == maxCell.x) {
  			if((maxCell.y == 3 && newMaxCell.y <= 2) || (newMaxCell.y >= 1 && maxCell.y == 0)){
  				return true;
  			} 
  		} else {
  			if ((maxCell.x == 3 && newMaxCell.x <= 2) || (newMaxCell.x >= 1 && maxCell.x == 0)) {
  				return true;
  			}
  		}
  	} else {
  		// won't move
  		return false;
  	}
};
Grid.prototype.moveLine = function(x,y, director) {
	var iterStep = 1;
	if (director == 0 || director == 2) {
		iterStep = -1;
	}
	var iterKey = x;
	if (director == 2||director == 3) {
		iterKey = y;
	}
	var lastvalue;
	for (var k = iterKey + iterStep; k >= 0 && k < this.size; k+=iterStep) {
		if(director == 2||director == 3) {
			
			if (!this.cells[x][k]) {
				return true;
			} else {
				if(!lastvalue) {
					lastvalue = this.cells[x][k].value;
				} else {
					if (lastvalue === this.cells[x][k].value) {
						return true;
					}
				}
				
			}
		} else {
			if (!this.cells[k][y]) {
				return true;
			} else {
				if(!lastvalue) {
					lastvalue = this.cells[k][y].value;
				} else {
					if (lastvalue === this.cells[k][y].value) {
						return true;
					}
				}
			
			}
		}
	}
	return false;
}

Grid.prototype.availableMaxSpaceCell = function(content) {
	var cells = [];
	var xarr = [0,1,0,-1];
  	var yarr = [1,0,-1,0];
	for (var x = 0; x < this.size; x++) {
	    for (var y = 0; y < this.size; y++) {
			if(!this.cells[x][y]) {
				var space = 0;
		      	for(var i=0; i < xarr.length;i++) {
					var tmpx = x+xarr[i];
		  			var tmpy = y+yarr[i];
		  			if (tmpx >= 0 && tmpx < this.size && tmpy >= 0 && tmpy < this.size) {
		  				if (!this.cells[tmpx][tmpy]) {
		  					space++;
		  				}
		  			}
  				}
  				cells.push({x:x,y:y,space:space})
			}
	    }
  	}
  	this.sort(cells, -1, cells.length, this.spaceComparor);
  	return cells[cells.length-1];
};

Grid.prototype.spaceComparor = function(i, j) {
	return i.space - j.space;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};
