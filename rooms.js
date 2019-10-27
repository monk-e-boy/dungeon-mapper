
class Rooms {

	constructor(rows, columns, room_size) {
		this.rows = rows;
		this.columns = columns;
		this.room_size = room_size;
		this.reset();
	}

	reset() {

		// TODO: move GLOABL squares array into this object

		squares = [];
		for (var c=0; c<this.columns; c++) {
			var row = [];
			for (var r=0; r<this.rows; r++) {
				row.push(new Squarex(c, r, this.room_size));
			}
			squares.push(row);
		}

	}

	enable_walls(squares, c, r) {

		// turn borders OFF if the square is enabled
	    var on = ! squares[c][r].enabled;

	    // left
	    if (c>1) {
		    if (squares[c-1][r].enabled) {
		      squares[c][r].left = on;
		      squares[c-1][r].right = on;
		    }	
	    }
	    
	    // right
	    if (c<this.columns-1) {
		    if (squares[c+1][r].enabled) {
		      squares[c][r].right = on;
		      squares[c+1][r].left = on;
		    }	
	    }
	    
	    // row above
	    if (r>0) {
		    if (squares[c][r-1].enabled) {
		      squares[c][r].top = on;
		      squares[c][r-1].bottom = on;
		    }	
	    }
	    
	    // row below
	    if (r < this.rows-1) {
		    if (squares[c][r+1].enabled) {
		      squares[c][r].bottom = on;
		      squares[c][r+1].top = on;
		    }	
	    }
	    
	}

	load(data) {

		this.reset();

		for (let i=0; i<data.length; i++) {
			let room = data[i];
			squares[room.c][room.r].load();
			this.enable_walls(squares, room.c, room.r);
		}
	}
}