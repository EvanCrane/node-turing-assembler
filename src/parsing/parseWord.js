//parseWord.js
const error = require('../models/error.js');

function getParsedWord (inputWord, configs) {
	inputWord = inputWord.trim();
	if (verifyWord(inputWord, configs)) {
		return inputWord;
	}
	throw new error.CustomError('parseWordError', 'INPUT WORD COULD NOT BE PARSED');
}

function verifyWord (inputWord, configs) {
	if (inputWord !== null || inputWord === '') {
		let letters = [...inputWord];
		for (var i = 0; i < letters.length; i++) {
			if (configs.alpha.indexOf(letters[i]) < 0) {
				throw new error.CustomError('verifyWordError', 'INPUT WORD DOES NOT MATCH INITIALIZATION CONFIGURATIONS');
			}
		}
		return true;
	}
	throw new error.CustomError('verifyWordError', 'INPUT WORD COULD NOT BE VERIFIED');
}

module.exports.getParsedWord = getParsedWord;
