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

	var myString = JSON.stringify(tmp);

	//var input = "test string";
//var output = pako.gzip(myString, { to: 'string' });
var output = pako.deflate(myString, { to: 'string' });

// var token = ascii85.encode(output);
// let compressed_data = ascii85.decode(token);

var token = window.btoa(output);
var compressed_data = window.atob(token);

let json_string = pako.inflate(compressed_data, { to: 'string' });
var myData = JSON.parse(json_string);

}

function get_data_from_url() {
	var hash = location.hash;
	if (hash.length == 0)
		return;

	var hash = location.hash.substr(1);
	let token = hash;
	var compressed_data = window.atob(token);

	let json_string = pako.inflate(compressed_data, { to: 'string' });
	var myData = JSON.parse(json_string);

	rooms.load(myData);
}