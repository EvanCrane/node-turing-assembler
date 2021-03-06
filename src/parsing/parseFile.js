//parseFile.js

const Configs = require('../models/config.js');
const Command = require('../models/commands.js');
const error = require('../models/error.js');
const configsList = ['states', 'start', 'accept', 'reject', 'alpha', 'tape-alpha'];
const commands = ['rwRt', 'rwLt', 'rRt', 'rLt', 'rRl', 'rLl'];

function getFileObjects (fileLines) {
	//check for bad file content
	if (fileLines === undefined || fileLines === null || fileLines.length < 1) {
		throwCustomParseError('parseFileObjectsError', 'ERROR: INVALID FILE CONTENT');
	}
	var [configs, commands]  = parseFileLines(fileLines);
	if (configs === undefined || configs === null) {
		throwCustomParseError('parseFileObjectsError', 'ERROR:MISSING OR INVALID INITIALIZATION CONFIGS');
	}
	//let commands = parseCommands(cmdObj, configs);
	//check for bad command parsing
	if (commands === undefined) {
		throwCustomParseError('parseFileObjectsError', 'ERROR: COMMAND PARSING ERROR');
	}
	return [configs, commands];
}

function parseFileLines (fileLines) {
	var fileContent = '';
	for (var i = 0; i < fileLines.length; i++) {
		//remove parts of lines that contain comments with '--'
		fileLines[i] = fileLines[i].replace(/--.*/g, '');
		fileContent += fileLines[i];
	}
	//get all substrings with matching parens
	let parenMatchesWSpace = fileContent.match(/\{[^}]*\}/gm);
	//remove all whitespace from config sections
	let parenMatches = parenMatchesWSpace.map(x => x.replace(/\s/gm, ''));
	//get all substrings with matchings commands
	let cmdMatches = fileContent.match(/\.*?(rwRt|rwLt|rRl|rLl|rRt|rLt)[^;]*/gm);
	let configsObj = parseConfigs(parenMatches);
	if (cmdMatches === null) {
		return [configsObj, null];
	}
	let cmdObj = parseCommands(cmdMatches, configsObj);
	return [configsObj, cmdObj];
}

function parseConfigs (parenMatches) {
	var configs = new Configs();
	for (var i = 0; i < parenMatches.length; i++) {
		//remove matching parens
		parenMatches[i] = parenMatches[i].replace(/\{|\}/gm, '');
		//this feels dirty using switch this way
		switch (true) {
		case /^states:/.test(parenMatches[i]):
			if (configs.states !== undefined) {
				throwCustomParseError('parseConfigsError', 'DUPLICATE INIT CONFIGS DETECTED');
			}
			var statesStr = parenMatches[i].split(configsList[0] + ':')[1];
			configs.states = statesStr.split(',');
			break;
		case /^start:/.test(parenMatches[i]):
			if (configs.start !== undefined) {
				throwCustomParseError('parseConfigsError', 'DUPLICATE INIT CONFIGS DETECTED');
			}
			var startStr = parenMatches[i].split(configsList[1] + ':')[1];
			configs.start = startStr;
			break;
		case /^accept:/.test(parenMatches[i]):
			if (configs.accept !== undefined) {
				throwCustomParseError('parseConfigsError', 'DUPLICATE INIT CONFIGS DETECTED');
			}
			var acceptStr = parenMatches[i].split(configsList[2] + ':')[1];
			configs.accept = acceptStr;
			break;
		case /^reject:/.test(parenMatches[i]):
			if (configs.test !== undefined) {
				throwCustomParseError('parseConfigsError', 'DUPLICATE INIT CONFIGS DETECTED');
			}
			var rejectStr = parenMatches[i].split(configsList[3] + ':')[1];
			configs.reject = rejectStr;
			break;
		case /^alpha:/.test(parenMatches[i]):
			if (configs.alpha !== undefined) {
				throwCustomParseError('parseConfigsError', 'DUPLICATE INIT CONFIGS DETECTED');
			}
			var alphaStr = parenMatches[i].split(configsList[4] + ':')[1];
			configs.alpha = alphaStr.split(',');
			break;
		case /^tape-alpha:/.test(parenMatches[i]):
			if (configs.tapeAlpha !== undefined) {
				throwCustomParseError('parseConfigsError', 'DUPLICATE INIT CONFIGS DETECTED');
			}
			var tapeStr = parenMatches[i].split(configsList[5] + ':')[1];
			configs.tapeAlpha = tapeStr.split(',');
			break;
		default:
			throwCustomParseError('parseConfigsError', 'INVALID INIT CONFIG DETECTED');
		}
	}
	if (verifyConfigs(configs)) {
		return configs;
	}
	throwCustomParseError('parseConfigsError', 'INVALID INITIALIZATION CONFIGURATIONS DETECTED');
}

function verifyConfigs (configs) {
	//verify that there are states
	if (configs.states === undefined || configs.states === null || configs.states.length < 1) {
		throwCustomParseError('verifyConfigsError', 'INIT CONFIG STATE DOES NOT HAVE A SUFFICIENT AMOUNT OF STATES');
	}
	//verify states has no special chars
	for (var i = 0; i < configs.states.length; i++) {
		if (configs.states[i].match(/[_!@#$%^&*(),.?":{}|<>]/g)) {
			throwCustomParseError('verifyConfigsError', 'DETECTED NON ALPHANUMERIC SYMBOL IN STATES');
		}
	}
	//verify start, accept, and reject contain just one state
	if (configs.start === undefined || configs.start === null || Array.isArray(configs.start)) {
		throwCustomParseError('verifyConfigsError', 'INIT CONFIG START HAS INCORRECT AMOUNT OF STATES');
	}
	if (configs.accept === undefined || configs.accept === null || Array.isArray(configs.accept)) {
		throwCustomParseError('verifyConfigsError', 'INIT CONFIG START HAS INCORRECT AMOUNT OF STATES');
	}
	if (configs.reject === undefined || configs.reject === null || Array.isArray(configs.reject)) {
		throwCustomParseError('verifyConfigsError', 'INIT CONFIG START HAS INCORRECT AMOUNT OF STATES');
	}
	//start, accept, reject must be in the set of states and reject !== accept
	if (configs.states.indexOf(configs.start) > -1 && configs.states.indexOf(configs.accept) > -1 &&
		configs.states.indexOf(configs.reject) > -1 && configs.reject !== configs.start) {
		//input alpha and tape alpha can be empty
		if (configs.alpha === null || configs.tapeAlpha === null) {
			return true;
		}
		var isSubset = configs.alpha.every(val => configs.tapeAlpha.includes(val));
		return isSubset;
	}
}

function parseCommands (cmdMatches, configsObj) {
	cmdList = [];
	for (var i = 0; i < cmdMatches.length; i++) {
		cmdObj = {};
		//replace whitespace in commands with commas
		let newMatch = cmdMatches[i].replace(/\s/gm, ',');
		let mSections = newMatch.split(',');
		if (commands.indexOf(mSections[0]) > -1) {
			switch (mSections[0]) {
			//rwRt
			case commands[0]:
				if (mSections[5] === undefined || mSections[5] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], mSections[4])) {
						//(rwRt, q, t, t', q')
						//in state q where the head is reading t off of the tape, write t', transition to state q' and move the head right.
						let cmd = new Command(commands[0], mSections[1], mSections[2], mSections[3], mSections[4], true);
						cmdList.push(cmd);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			//rwLt
			case commands[1]:
				if (mSections[5] === undefined || mSections[5] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], mSections[4])) {
						//(rwLt, q, t, t', q')
						//in state q where the head is reading t off of the tape, write t', transition to state q' and move the head left.
						let cmd = new Command(commands[1], mSections[1], mSections[2], mSections[3], mSections[4], false);
						cmdList.push(cmd);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			//rRt
			case commands[2]:
				if (mSections[4] === undefined || mSections[4] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, mSections[3])) {
						//(rRt, q, t, t, q')
						//in state q where the head is reading t off of the tape, write t, transition to state q'and move the head right.
						let cmd = new Command(commands[2], mSections[1], mSections[2], mSections[2], mSections[3], true);
						cmdList.push(cmd);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			//rLt
			case commands[3]:
				if (mSections[4] === undefined || mSections[4] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, mSections[3])) {
						//(rLt, q, t, t, q')
						//in state q where the head is reading t off of the tape, write t, transition to state q'and move the head left.
						let cmd = new Command(commands[3], mSections[1], mSections[2], mSections[2], mSections[3], false);
						cmdList.push(cmd);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			//rRl
			case commands[4]:
				if (mSections[3] === undefined || mSections[3] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, null)) {
						//(rRl, q, t, t, q)
						//in state q where the head is reading t off of the tape, write t, transition to state q and move the head right.
						let cmd = new Command(commands[4], mSections[1], mSections[2], mSections[2], mSections[1], true);
						cmdList.push(cmd);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			//rLl
			case commands[5]:
				if (mSections[3] === undefined || mSections[3] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, null)) {
						//(rLl, q, t, t, q)
						//in state q where the head is reading t off of the tape, write t, transition to state q and move the head left.
						let cmd = new Command(commands[5], mSections[1], mSections[2], mSections[2], mSections[1], false);
						cmdList.push(cmd);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
					return null;
				}
				break;
			default:
				throwCustomParseError('parseCommandError', 'ERROR: INVALID COMMAND: ' + cmdMatches[i]);
				return null;
			}
		}
	}
	return cmdList;
}

function verifyCommand (configsObj, cmd, stateParam1, tapeParam1, tapeParam2, stateParam2) {
	if (configsObj.states.indexOf(stateParam1) > -1) {
		if (tapeParam1 === '_' || configsObj.tapeAlpha.indexOf(tapeParam1) > -1) {
			if (cmd === 'rRl' || cmd === 'rLl') {
				return true;
			}
			if (configsObj.states.indexOf(stateParam2) > -1) {
				if (cmd === 'rRt' || cmd === 'rLt') {
					return true;
				}
				if (tapeParam2 === '_' || configsObj.tapeAlpha.indexOf(tapeParam2) > -1) {
					if (cmd === 'rwRt' || cmd === 'rwLt') {
						return true;
					}
				}
			}
		}
	}
	let fullCmd = cmd.toString() + ' ' + String(stateParam1) + ' ' + String(tapeParam1) + ' ' + String(tapeParam2) + ' ' + String(stateParam2);
	throwCustomParseError('verifyCommandError', 'ERROR: BAD COMMAND ARGUMENTS: CMD: ' + fullCmd);
}

function throwCustomParseError (nameStr, messageStr) {
	console.log('***CUSTOM ERROR THROWN***');
	throw new error.CustomError(nameStr, messageStr);
}

module.exports.getFileObjects = getFileObjects;
