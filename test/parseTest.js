const parse = require('../src/parsing/parse.js');

function parseTestMain () {
	try {
		filePathTest();
	} catch (err) {
		console.log('TEST ERROR: ' + err.name + ' | ' + err.message);
	}
}

function filePathTest () {
	//add full filepath to front var fpGood = 'test/testfiles/test.TM';
	//add full filepath to front var fpBad1 = 'ajkdfkl;aj';
	//add full filepath to front var fpBad2 = 'test/testfiles/';
	//add full filepath to front var fpBad3 = 'test/testfiles/test.txt';
	console.log('filePathTest: ' + Array.isArray(parse.parseFilePath(fpGood)));
	console.log('filePathTest: ' + Array.isArray(parse.parseFilePath(fpBad1)));
	console.log('filePathTest: ' + Array.isArray(parse.parseFilePath(fpBad2)));
	console.log('filePathTest: ' + Array.isArray(parse.parseFilePath(fpBad3)));
}

parseTestMain();
