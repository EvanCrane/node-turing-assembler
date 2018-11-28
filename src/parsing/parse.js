//parse.js
//file controlling the parsing of program inputs
const fs = require('fs');
const error = require('../models/error.js');
const parseFile = require('./parseFile.js');

function parseFileInputs (inputFilePath) {
	try {
		var fileLines = parseFilePath(inputFilePath);
		var fileObjects = parseFile.getFileObjects(fileLines);
		return fileObjects;
	} catch (err) {
		console.log('ERROR: ' + err.name + ' | ' + err.message);
		return null;
	}
}

function parseWord (inputWord) {
}

function parseFilePath (inputFilePath) {
	inputFilePath = inputFilePath.trim();
	if (fs.existsSync(inputFilePath) && inputFilePath.slice(-3).toUpperCase() === '.TM') {
		let fileLines = fs.readFileSync(inputFilePath).toString().match(/^.+$/gm);
		return fileLines;
	} else { throw new error.CustomError('parseFileError', 'Bad filepath detected or incorrect file extension'); }
}

module.exports.parseFileInputs = parseFileInputs;
module.exports.parseWord = parseWord;
//testing module exports
module.exports.parseFilePath = parseFilePath;
