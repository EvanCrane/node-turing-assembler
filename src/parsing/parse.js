//parse.js
//file controlling the parsing of program inputs
const fs = require('fs');
const error = require('../models/error.js');
const parseFile = require('./parseFile.js');
const getWord = require('./parseWord.js');

function parseFileInputs (inputFilePath) {
	try {
		var fileLines = parseFilePath(inputFilePath);
		var fileObjects = parseFile.getFileObjects(fileLines);
		return fileObjects;
	} catch (err) {
		console.log('PARSEFILE ERROR: ' + err.name + ' | ' + err.message);
		return null;
	}
}

function parseWord (inputWord, configs) {
	try {
		var word = getWord.getParsedWord(inputWord, configs);
		return word;
	} catch (err) {
		console.log('PARSEWORD ERROR: ' + err.name + ' | ' + err.message);
		return null;
	}
}

function parseFilePath (inputFilePath) {
	inputFilePath = inputFilePath.trim();
	var pathInfo = '';
	if (inputFilePath.startsWith('~') || fs.existsSync(inputFilePath)) {
		if (inputFilePath.slice(-3).toUpperCase() === '.TM') {
			let fileLines = fs.readFileSync(inputFilePath).toString().match(/^.+$/gm);
			return fileLines;
		} else {
			pathInfo = 'Incorrect file extension used.';
		}
	} else {
		pathInfo = 'Invalid Filepath Detected. Filepath does not exist or tilde expansion was used';
	}
	throw new error.CustomError('parseFileError', pathInfo);
}

module.exports.parseFileInputs = parseFileInputs;
module.exports.parseWord = parseWord;
//testing module exports
module.exports.parseFilePath = parseFilePath;
