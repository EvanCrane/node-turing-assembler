//commands.js
//defines classes and models for turing assembler configuration

class Command {
	constructor (name, stateCurrent, tapeRead, tapeWrite, stateTrans) {
		this.name = name;
		this.stateCurrent = stateCurrent;
		this.tapeRead = tapeRead;
		this.tapeWrite = tapeWrite;
		this.stateTrans = stateTrans;
	}
}

module.exports.Command = Command;
