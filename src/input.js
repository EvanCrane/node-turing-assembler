const readlineSync = require('readline-sync');

function getFilePath () {
	return readlineSync.question('Please enter a path to the source file: ');
}

function getWord () {
	return readlineSync.question('Please enter a word: ');
}

module.exports.getFilePath = getFilePath;
module.exports.getWord = getWord;
