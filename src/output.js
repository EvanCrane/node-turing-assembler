//output.js

module.exports = {
	accept: function (tape, current) {
		var str = formString(tape, current);
		console.log('Accept: ' + str);
	},
	reject: function (tape, current) {
		var str = formString(tape, current);
		console.log('Reject: ' + str);
	},
	iteration: function (tape, current) {
		var str = formString(tape, current);
		console.log(str);
	}
};

function formString (tape, current) {
	let tapeString = tape.join('');
	tapeString = tapeString.substr(0, current.position) + '[' + current.state + ']' + tapeString.substr(current.position);
	return tapeString;
}
