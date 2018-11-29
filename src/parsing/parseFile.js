//parseFile.js

const Configs = require('../models/config.js');
const command = require('../models/commands.js');
const error = require('../models/error.js');
const configsList = ['states', 'start', 'accept', 'reject', 'alpha', 'tape-alpha'];
const commands = ['rwRt', 'rwLt', 'rRl', 'rLl', 'rRt', 'rLt'];

function getFileObjects (fileLines) {
	//check for bad file content
	if (fileLines === undefined || fileLines === null || fileLines.length < 1) {
		throwCustomParseError('parseFileObjectsError', 'ERROR: INVALID FILE CONTENT');
	}
	let parsedContent = parseFileLines(fileLines);
	let configs = parseConfigs(parsedContent[0]);
	//check for bad or missing configs
	if (configs === undefined || configs === null) {
		throwCustomParseError('parseFileObjectsError', 'ERROR:MISSING OR INVALID INITIALIZATION CONFIGS');
	}
	let commands = parseCommands(parsedContent[1], configs);
	//check for bad or missing commands
	if (commands === undefined || commands === null) {
		throwCustomParseError('parseFileObjectsError', 'ERROR: INVALID COMMAND OBJECTS');
	}
	return (configs, commands);
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
		return (configsObj, null);
	}
	let cmdObj = parseCommands(cmdMatches, configsObj);
	return (configsObj, cmdObj);
}

function parseConfigs (parenMatches) {
	var configs = {};
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
	return null;
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
			case commands[0]:
				if (mSections[5] === undefined || mSections[5] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], mSections[4])) {
						let cmd = new command.Command(commands[0], [mSections[1], mSections[2], mSections[3], mSections[4]);
						command.cmd = commands[0];
						command.params = [mSections[1], mSections[2], mSections[3], mSections[4]];
						cmdObjList.push(command);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			case commands[1]:
				if (mSections[5] === undefined || mSections[5] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], mSections[4])) {
						let command = new Command();
						command.cmd = commands[0];
						command.params = [mSections[1], mSections[2], mSections[3], mSections[4]];
						cmdObjList.push(command);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			case commands[2]:
				if (mSections[3] === undefined || mSections[3] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, null)) {
						let command = new Command();
						command.cmd = commands[0];
						command.params = [mSections[1], mSections[2]];
						cmdObjList.push(command);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			case commands[3]:
				if (mSections[3] === undefined || mSections[3] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, null)) {
						let command = new Command();
						command.cmd = commands[0];
						command.params = [mSections[1], mSections[2]];
						cmdObjList.push(command);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
					return null;
				}
				break;
			case commands[4]:
				if (mSections[4] === undefined || mSections[4] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], null)) {
						let command = new Command();
						command.cmd = commands[0];
						command.params = [mSections[1], mSections[2], mSections[3]];
						cmdObjList.push(command);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			case commands[5]:
				if (mSections[4] === undefined || mSections[4] === '') {
					if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], null)) {
						let command = new Command();
						command.cmd = commands[0];
						command.params = [mSections[1], mSections[2], mSections[3]];
						cmdObjList.push(command);
					}
				} else {
					throwCustomParseError('parseCommandError', 'ERROR: INVALID ARGUMENTS FOR CMD: ' + cmdMatches[i]);
				}
				break;
			default:
				throwCustomParseError('parseCommandError', 'ERROR: INVALID COMMAND: ' + cmdMatches[i]);
				return null;
			}
		}
	}
	return cmdObjList;
}

function verifyCommand (configsObj, cmd, stateParam1, tapeParam1, tapeParam2, stateParam2) {
	if (configsObj.states.indexOf(stateParam1) > -1) {
		if (tapeParam1 === '_' || configsObj.tapeAlpha.indexOf(tapeParam2) > -1) {
			if (cmd === 'rRl' || cmd === 'rLl') {
				return true;
			}
			if (tapeParam2 === '_' || configsObj.tapeAlpha.indexOf(tapeParam2) > -1) {
				if (cmd === 'rRt' || cmd === 'rLt') {
					return true;
				}
				if (configsObj.states.indexOf(stateParam2) > -1) {
					if (cmd === 'rwRt' || cmd === 'rwLt') {
						return true;
					}
				}
			}
		}
	}
	throwCustomParseError('verifyCommandError', 'ERROR: BAD COMMAND ARGUMENTS');
}

function throwCustomParseError (nameStr, messageStr) {
	console.log('***CUSTOM ERROR THROWN***');
	throw new error.CustomError(nameStr, messageStr);
}

module.exports.getFileObjects = getFileObjects;
