const readlineSync = require('readline-sync');

var filePath = readlineSync.question('Please enter a path to the source file: ');
console.log(filePath);
var word = readlineSync.question('Please enter a word: ');
console.log(word);

module.exports = {
    filePath: filePath, 
    word: word
};