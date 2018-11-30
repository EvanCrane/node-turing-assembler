//turing.js
const output = require('../src/output');

function startTuring (tape, configs, commands) {
	var currentInit = {
		state: configs.start,
		position: 0,
		read: tape[0]
	};
	try {
		output.iteration(tape, currentInit);
		return turingLoop(tape, currentInit, commands, configs.accept, configs.reject);
	} catch (err) {
		console.log('TURING ERROR: ' + err.name + ' | ' + err.message);
		return null;
	}
}

function turingLoop (tape, current, cmds, accept, reject) {
	if (current.state === accept) {
		output.accept(tape, current);
		return true;
	}
	if (current.state === reject) {
		output.reject(tape, current);
		return false;
	}
	//in state q where head is reading t off of the tape, write t', transition to state q' and move the head left or right
	for (var i = 0; i < cmds.length; i++) {
		//find command that matches current state and tape read
		if (cmds[i].stateCurrent === current.state && cmds[i].tapeRead === current.read) {
			//write t' to the tape
			tape[current.position] = cmds[i].tapeWrite;
			//transition to state q'
			current.state = cmds[i].stateTrans;
			if (cmds[i].moveRight) {
				if (current.position + 1 < tape.length) {
					current.position++;
				}
			} else if (cmds[i] === false) {
				if (current.position - 1 >= 0) {
					current.position--;
				}
			}
			//move head
			current.read = tape[current.position];
			output.iteration(tape, current);
			break;
		}
	}
	return turingLoop(tape, current, cmds, accept, reject);
}

module.exports.startTuring = startTuring;
