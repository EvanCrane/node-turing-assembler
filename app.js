const inputs = require('./src/input.js');
const parse = require('./src/parsing/parse.js');
const turing = require('./src/turing.js');

function main () {
	var inputFilePath = inputs.getFilePath();
	var [configs, commands] = getFileContent(inputFilePath);
	var inputWord = inputs.getWord();
	var word = getWord(inputWord, configs);
	var tape = [...word];
	turing.startTuring(tape, configs, commands);
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
