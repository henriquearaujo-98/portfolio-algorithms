


let sketch = function(p) {

	let startMaze = false;
	let startSolver = false;

	let col_slider = $("#col_slider");			//Number of cols
	let X = col_slider.val();
	let displayX = $("#num_of_col");
	displayX.val(X);
	col_slider.change(()=>{
		if(!startSolver && !startMaze){
			displayX.val(X);
			$("#aStar").empty();
			new p5(sketch, 'aStar');
		}
	});


	$(document).on('click', '#maze_start', ()=>{
		startMaze = !startMaze;
	});

	$(document).on('click', '#solver_start', ()=>{
		startSolver = !startSolver;
	});

	$(document).on('click', '#quick_sort_reset', ()=>{
		$("#aStar").empty();
		new p5(sketch, 'aStar');
	});

	function removeFromArray(arr, el){
		for(let i = arr.length - 1; i >= 0; i--){
			if(arr[i] == el){
				arr.splice(i , 1);
			}
		}
	}

	function heuristic(a,b){
		//var d = p.dist(a.i, a.j, b.i, b.j);
		var d = p.abs(a.i-b.i) + p.abs(a.j-b.j);
		return d;
	}	

	var cols = X;
	var rows = 20;
	var grid = new Array(cols);

	var openSet = [];
	var closeSet = [];
	var start;
	var end;
	var w,h; //width and height of the screen
	var path;
	var noSolution = false;
	var current;

	var mazeCurrent;
	var mazeStack = [];

	var startPathfinding = false;

	function Spot(i,j){
		this.i = i;
		this.j = j;

		this.f = 0;
		this.g = 0;
		this.h = 0;

		this.neighbors = [];
		this.walls = [];

		this.previous;

		this.wall = true;
		this.visited = false;
		/*if(p.random(1) < 0.3)
			this.wall = true;*/

		this.show = function(col){
			p.fill(col);
			if(this.wall)
				p.fill(0);

			if(this == mazeCurrent)
				p.fill(50, 168, 82);


			p.stroke(0);
			p.rect(this.i * w, this.j *h , w, h);
		}

		this.addNeightbors = function(grid){
			let i = this.i;
			let j = this.j;
			if(i < cols -2)
				this.neighbors.push(grid[i+2][j]);
			if(i > 1)
				this.neighbors.push(grid[i-2][j]);
			if(j < rows - 2)
				this.neighbors.push(grid[i][j+2]);
			if(j > 1)
				this.neighbors.push(grid[i][j-2]);
		}

		this.addWalls = function(){
			let i = this.i;
			let j = this.j;
			if(i < cols -1)
				this.walls.push(grid[i+1][j]);
			if(i > 0)
				this.walls.push(grid[i-1][j]);
			if(j < rows - 1)
				this.walls.push(grid[i][j+1]);
			if(j > 0)
				this.walls.push(grid[i][j-1]);
		}

		this.checkNeighbors =  function(){
			let goodNeighbors = [];
			this.addNeightbors(grid);

			for(let i = 0; i < this.neighbors.length; i++){
				if(this.neighbors[i].visited == false){
					goodNeighbors.push(this.neighbors[i]);
				}
			}

			if(goodNeighbors.length > 0){
				let index = Math.ceil(p.random(0, goodNeighbors.length -1));
				
				return goodNeighbors[index];
			}else
				return undefined;
		}
	}
	
	function removeWalls(a,b){
		//(current, next)
		var x = a.i - b.i;
		console.log(x);
		if(x === 0){
			//console.log("x = 0");
			if(a.walls[0])
				a.walls[0].wall = false;
			else if(b.walls[1])
				b.walls[1].wall = false;

		}else if(x === -2){
			//console.log("x = -2");
			if(a.walls[1])
				a.walls[1].wall = false;
			else if(b.walls[0])
				b.walls[0].wall = false;

		}

		//a.walls[1].wall = false; //left
		//a.walls[0].wall = false; //right
		//a.walls[2].wall = false; //bottom
		//a.walls[3].wall = false; //top

		var y = a.j - b.j;
		if(y === 0){
			//console.log("y = 0");
			if(a.walls[2])
				a.walls[2].wall = false;
			else if(b.walls[3])
				b.walls[3].wall = false;

		}else if(y === -2){
			//console.log("y = -2");
			if(a.walls[3])
				a.walls[3].wall = false;
			else if(b.walls[2])
				b.walls[2].wall = false;

		}
	}
	

	//Start Function
    p.setup = function(){

		$("#col_slider").attr({
			"min" : rows         // values (or variables) here
		});

		p.createCanvas(20*cols, 20*rows);
    	p.frameRate(120);
    	w = p.width / cols;
    	h = p.height / rows;


    	//Making a 2D array
    	for(let i = 0; i < cols; i++){
    		grid[i] = new Array(rows);
    	}

    	//Display grid
    	for(let i = 0; i < cols; i++){
    		for(let j = 0; j < cols; j++){
    			grid[i][j] = new Spot(i,j);
    		}
    	}

    	//Get neighbours from each spot
    	for(let i = 0; i < cols; i++){
    		for(let j = 0; j < cols; j++){
    			grid[i][j].addNeightbors(grid);
    			grid[i][j].addWalls(grid);
    		}
    	}

    	start = grid[1][1];
    	mazeCurrent = start;
    	end = grid[cols - 2][rows - 2];
    	start.wall = false;
    	end.wall = false;

    	openSet.push(start);
		p.background(0);
		for(let i = 0; i < cols; i++){
			for(let j = 0; j < rows; j++){
				grid[i][j].show(p.color(255));
			}
		}

		for(let i = 0; i < closeSet.length; i++){
			closeSet[i].show(p.color(255,0,0));
		}

		for(let i = 0; i < openSet.length; i++){
			openSet[i].show(p.color(0,255,0));
		}
    }

    //Update
    p.draw = function(){
		//Maze gen
    	if(!startPathfinding && startMaze){	//Maze gen
    		p.background(0);
    		for(let i = 0; i < cols; i++){
	    		for(let j = 0; j < rows; j++){
	    			grid[i][j].show(p.color(255));
	    		}
	    	}

	    	for(let i = 0; i < closeSet.length; i++){
	    		closeSet[i].show(p.color(255,0,0));
	    	}

	    	for(let i = 0; i < openSet.length; i++){
	    		openSet[i].show(p.color(0,255,0));
	    	}
	    	let next = mazeCurrent.checkNeighbors();
	    	if(next){
	    		next.visited = true;
	    		next.wall = false;
	    		removeWalls(mazeCurrent,next);
	    		mazeCurrent = next;
	    		mazeStack.push(mazeCurrent);
	    	}else if(mazeStack.length > 0){
	    		mazeCurrent = mazeStack.pop();
	    		//console.log('pop');
	    	}else if (mazeStack.length === 0){
	    		startPathfinding = true;
	    		startMaze = false;
	    	}

    	}
    	
		//Path find
    	if(startPathfinding && startSolver){
    		if(openSet.length > 0){

	    		let lowestIndex = 0;
	    		for (let i = 0; i < openSet.length;i++){
	    			if(openSet[i].f < openSet[lowestIndex].f){
	    				lowestIndex = i;
	    			}
	    		}

	    		current = openSet[lowestIndex];

	    		if(openSet[lowestIndex] === end){
	    			console.log('DONE!');
	    			p.noLoop();
	    			
	    		}

	    		removeFromArray(openSet, current);
	    		closeSet.push(current);

	    		let neighbors = current.walls;

	    		//Checking each neighbor
	    		for(let i = 0; i < neighbors.length; i++){
	    			let neighbor = neighbors[i];

	    			if(!closeSet.includes(neighbor) && !neighbor.wall){
	    				let tempG = current.g + 1;

	    				if(openSet.includes(neighbor)){
	    					if(tempG < neighbor.g){
	    						neighbor.g = tempG;
	    					}
	    				}else{
	    					neighbor.g = tempG;
	    					openSet.push(neighbor);
	    				}

	    				neighbor.h = heuristic(neighbor, end); //educated guess
	    				neighbor.f = neighbor.g + neighbor.h;
	    				neighbor.previous = current;
	    			}
	    		}

    		}else{	
	    		console.log('no solution');
	    		noSolution = true;
	    		p.noLoop();
    		}



	    	for(let i = 0; i < cols; i++){
	    		for(let j = 0; j < rows; j++){
	    			grid[i][j].show(p.color(255));
	    		}
	    	}

	    	for(let i = 0; i < closeSet.length; i++){
	    		closeSet[i].show(p.color(255,0,0));
	    	}

	    	for(let i = 0; i < openSet.length; i++){
	    		openSet[i].show(p.color(0,255,0));
	    	}

	    	if(!noSolution){
	    		path = [];
		    	var temp = current;
				path.push(temp);
				while(temp.previous){
					path.push(temp.previous);
					temp = temp.previous;
				}
	    	}
	    	console.log(path);
	    	for(let i = 0; i < path.length; i++){
	    		path[i].show(p.color(0,0,255));
	    	}
    	}

    	

    	
    	
    }

  };
 //Display within the element with id 'aStar'
 new p5(sketch, 'aStar');