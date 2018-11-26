function mainFunc() {
    console.log("input starting...");
    const inputs = require('./src/input.js');
    let inputFilePath = inputs.getFilePath();
    console.log("parsefile starting...");
    const parseFile = require('./src/parseFile.js');
    let fileObjects = parseFile.getFileObjects(inputFilePath);
    if (fileObjects === null) {
        console.log("Please try again");
        mainFunc();
    }
    let inputWord = inputs.getWord();
    const parseWord = require('./src/parseWord.js');
    let wordContent = parseWord.getParsedWord(inputWord, fileObjects[0]);
    console.log("Ended parsing process");
}

console.log("START: APP STARTING");
mainFunc();