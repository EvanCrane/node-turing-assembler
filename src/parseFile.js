//parseFile.js

const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);



function getFileObjects(inputFilePath) {
    filePath = inputFilePath.trim();
    if (fs.existsSync(filePath) && filePath.slice(-3).toUpperCase() === ".TM") {
        let fileLines = fs.readFileSync(filePath);
        if (fileLines !== null || fileLines.length < 1) {
            let parsedContent = parseFileLines(fileLines);
            let configObj = parseConfigs(parsedContent[0]);
            if (configObj !== null) {
                let cmdObj = parseCommands(parsedContent[1], configObj);
                if (cmdObj !== null) {
                    return (configObj, cmdObj);
                }
                console.log('ERROR: INVALID COMMANDS IN FILE');
            }
            console.log('ERROR: INVALID CONFIGURATIONS IN FILE');
        }
        console.log('ERROR: INVALID FILE CONTENT');
    }
    console.log('ERROR: INVALID FILEPATH');
    return null;
}

function parseFileLines(fileLines) {
    var fileContent = '';
    for (var i = 0; i < fileLines.length; i++) {
        //remove lines that contain comments with '--'
        fileLines[i] = fileLines.replace(/[^:]--.*/g, '');
        //remove whitespace
        fileContent += fileLines[i].replace(/\s/gm, '');
    }
    //get all substrings with matching parens
    let parenMatches = fileContent.match(/\{[^}]*\}/gm);
    let restOfFile = fileContent.split(parenMatches[parenMatches.length - 1])[1];
    let configsObj = parseConfigs(parenMatches);
    let cmdObj = parseCommands(restOfFile, configsObj);

    return (configsObj, cmdObj);
}

function verifyFileContent(fileContent) {
    const fileReqs = ['{states:', '{start:', '{accept:', '{reject:', '{alpha:', '{tape-alpha:'];
    for (var i = 0; i < fileReqs.length; i++) {
        if (fileContent.indexOf(substr) === -1) {
            return false;
        }
    }
    return true;
}

function parseConfigs(parenMatches) {
    var configObj = {};
    for (var i = 0; i < parenMatches.length; i++) {
        //remove matching parens
        parenMatches[i] = parenMatches[i].replace(/\{|\}/gm, '');
        switch (parenMatches[i]) {
            case 'states:':
                var statesStr = parenMatches[i].split('states:')[1];
                configObj.states = statesStr.split(',');
                break;
            case 'start:':
                var startStr = parenMatches[i].split('start:')[1];
                configObj.start = startStr;
                break;
            case 'accept:':
                var acceptStr = parenMatches[i].split('accept:')[1];
                configObj.accept = acceptStr;
                break;
            case 'reject:':
                var rejectStr = parenMatches[i].split('reject:')[1];
                configObj.reject = rejectStr;
                break;
            case 'alpha:':
                var alphaStr = parenMatches[i].split('alpha:')[1];
                configObj.alpha = alphaStr.split(',');
                break;
            case 'tape-alpha:':
                var tapeStr = parenMatches[i].split('tape-alpha:')[1];
                configObj.tapeAlpha = tapeStr.split(',');
                break;
            default:
                return null;
        }
    }
    if (verifyConfigs(configObj)) {
        return configObj;
    }
    return null;
}

function verifyConfigs(configObj) {
    for (var i = 0; i < configObj.states.length; i++) {
        if (!configObj.states[i].match(/[!@#$%^&*(),.?":{}|<>]/g)) {
            return false;
        } else
            console.log('ERROR: CONFIG STATE CONTAINS SPECIAL CHARACTER');
    }
    if (configObj.states.indexOf(configObj.start) > -1 && configObj.states.indexOf(configObj.accept) > -1 &&
        configObj.states.indexOf(configObj.reject) > -1 && configObj.reject !== configObj.start) {
        if (configObj.alpha.every(val => configObj.tapeAlpha.includes(val))) {
            return true;
        }
    }
    return false;
}

function parseCommands(cmdStr, configsObj) {
    splitCmds = cmdStr.split(';');
    for (var i = 0; i<splitCmds.length; i++) {
        
    }
    if (verifyCommands(cmdStr)) {
        return cmdObj;
    }
    return null;
}

function verifyCommands(cmdStr) {

    return isCmdValid;
}

module.exports.getFileObjects = getFileObjects;