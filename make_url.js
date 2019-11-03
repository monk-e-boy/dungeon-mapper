function make_url() {
	// The JSON needs to be compact, but within reason.
	// The JSON should be repetative (e.g. key names) because
	// these will play nicely with the compression
	// The JSON should be simple(ish) to understand and
	// debug

	let tmp = [];

	for (var c=0; c<columns; c++) {
		for (var r=0; r<columns; r++) {
			if (squares[c][r].enabled) {
				tmp.push( squares[c][r].save() );
			}
		}
	}

	let tmp2 = [];

	for (let objs=0; objs<objects.length; objs++) {
		tmp2.push(objects[objs].save());
	}

	let tmp3 = [];

	gui_texts.forEach(function(text) {
		tmp3.push(text.save());
	});

	var myString = JSON.stringify({
		rooms: tmp,
		objects: tmp2,
		texts: tmp3
	});

	//var input = "test string";
	//var output = pako.gzip(myString, { to: 'string' });
	var output = pako.deflate(myString, { to: 'string' });

	// var token = ascii85.encode(output);
	// let compressed_data = ascii85.decode(token);

	var token = window.btoa(output);
	//var compressed_data = window.atob(token);
	// let json_string = pako.inflate(compressed_data, { to: 'string' });
	// var myData = JSON.parse(json_string);
	var url = document.getElementById("url");
	var link = "http://localhost:8080/#" + token;
	var a = "<a href=\"";
	a += link;
	a += "\">Your dungeon</a>";

	url.innerHTML = a;
	modal.style.display = "block";
}

function get_data_from_url() {
	var hash = location.hash;
	if (hash.length == 0)
		return;

	var hash = location.hash.substr(1);
	let token = hash;
	var compressed_data = window.atob(token);

	let json_string = pako.inflate(compressed_data, { to: 'string' });
	var data = JSON.parse(json_string);

	rooms.load(data.rooms);
	_object.load(data.objects);


	gui_texts = [];
	for (let i=0; i<data.texts.length; i++) {
		gui_texts.push(Text.factory(data.texts[i]));
	}
	
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function(event) {
	modal.style.display = "none";
	event.stopPropagation();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
		event.stopPropagation();
	}
}