const inputs = require('./src/input.js');
const parse = require('./src/parsing/parse.js');
var savedPath;

function main () {
	var inputFilePath = inputs.getFilePath();
	var inputWord = inputs.getWord();
	var [configs, commands] = getFileContent(inputFilePath);
	var word = getWord(inputWord, configs);
	console.log('Ended parsing process');
}

function getFileContent (inputFilePath) {
	let fileContent = parse.parseFileInputs(inputFilePath);
	if (fileContent === null) {
		console.log('Please try again...');
		fileContent = getFileContent(inputs.getFilePath());
	}
	return fileContent;
}

function getWord (inputWord, configs) {
	let word = parse.parseWord(inputWord, configs);
	if (word === null) {
		console.log('Please enter word again...');
		word = getWord(inputs.getWord(), configs);
	}
	return word;
}

console.log('START: APP STARTING');
main();
