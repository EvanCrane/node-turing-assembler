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
	let tapeCopy = tape;
	tapeCopy.splice(current.position, 0, '[' + current.state + ']');
	return tapeCopy.join('');
}
