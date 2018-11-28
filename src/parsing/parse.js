//parse.js
//file controlling the parsing of program inputs
const fs = require('fs');
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
		let fileLines = fs.readFileSync(inputFilePath);
		return fileLines;
	} else { throw new Error({ name: 'parseFileError', message: 'Bad filepath detected' }); }
}

module.exports.parseFileInputs = parseFileInputs;
module.exports.parseWord = parseWord;
