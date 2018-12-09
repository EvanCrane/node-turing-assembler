//turing.js
const output = require('../src/output');

function startTuring (tape, configs, commands) {
	if (commands === null) {
		//no commands found
		console.log('No commands found in the .TM file. Nothing to do...');
		console.log(tape.join(''));
		return true;
	}
	var currentInit = {
		state: configs.start,
		position: 0,
		read: tape[0]
	};
	try {
		return turingLoop(tape, currentInit, commands, configs.accept, configs.reject, 0);
	} catch (err) {
		console.log('TURING ERROR: ' + err.name + ' | ' + err.message);
		return null;
	}
}

function turingLoop (tape, current, cmds, accept, reject, count) {
	if (current.state === accept) {
		output.accept(tape, current);
		return true;
	}
	if (current.state === reject) {
		output.reject(tape, current);
		return false;
	}
	output.iteration(tape, current);
	var commandFound = false;
	//in state q where head is reading t off of the tape, write t', transition to state q' and move the head left or right
	for (var i = 0; i < cmds.length; i++) {
		//find command that matches current state and tape read
		if (cmds[i].stateCurrent === current.state && cmds[i].tapeRead === current.read) {
			//write t' to the tape
			tape[current.position] = cmds[i].tapeWrite;
			//transition to state q'
			current.state = cmds[i].stateTrans;
			if (cmds[i].moveRight) {
				current.position++;
			} else if (cmds[i].moveRight === false) {
				if (current.position - 1 >= 0) {
					current.position--;
				}
			}
			//move head
			if (current.position === tape.length) {
				tape.push('_');
			}
			current.read = tape[current.position];
			commandFound = true;
			break;
		}
	}
	if (!commandFound) {
		current.state = reject;
	}
	count++;
	setTimeout(turingLoop, 500, tape, current, cmds, accept, reject, count);
}

module.exports.startTuring = startTuring;
