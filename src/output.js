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
	tape.splice(current.position, 0, '[' + current.state + ']');
	return tape.join('');
}
