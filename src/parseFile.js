//parseFile.js

const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const Configs = require('./models/config.js');
const Command = require('./models/commands.js');
const configs = ['states', 'start', 'accept', 'reject', 'alpha', 'tape-alpha'];
const commands = ['rwRt', 'rwLt', 'rRl', 'rLl', 'rRt', 'rLt'];


function getFileObjects(inputFilePath) {
    filePath = inputFilePath.trim();
    if (fs.existsSync(filePath) && filePath.slice(-3).toUpperCase() === ".TM") {
        let fileLines = fs.readFileSync(filePath);
        if (fileLines !== null || fileLines.length < 1) {
            let parsedContent = parseFileLines(fileLines);
            let configs = parseConfigs(parsedContent[0]);
            if (configs !== null) {
                let cmdObj = parseCommands(parsedContent[1], configs);
                if (cmdObj !== null) {
                    return (configs, cmdObj);
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
        //remove parts of lines that contain comments with '--'
        fileLines[i] = fileLines.replace(/[^:]--.*/g, '');
    }
    //get all substrings with matching parens
    let parenMatchesWSpace = fileContent.match(/\{[^}]*\}/gm);
    //remove all whitespace from config sections
    let parenMatches = parenMatchesWSpace.replace(/\s/gm, '');
    //get all substrings with matchings commands
    let cmdMatches = fileContent.match(/\.*?(rwRt|rwLt|rRl|rLl|rRt|rLt)[^;]*\;/gm);
    let configsObj = parseConfigs(parenMatches);
    let cmdObj = parseCommands(cmdMatches, configsObj);

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
    let configs = new Configs();
    for (var i = 0; i < parenMatches.length; i++) {
        //remove matching parens
        parenMatches[i] = parenMatches[i].replace(/\{|\}/gm, '');
        switch (parenMatches[i]) {
            case 'states:':
                var statesStr = parenMatches[i].split(configs[0] + ':')[1];
                configs.states = statesStr.split(',');
                break;
            case 'start:':
                var startStr = parenMatches[i].split(configs[1] + ':')[1];
                configs.start = startStr;
                break;
            case 'accept:':
                var acceptStr = parenMatches[i].split(configs[2] + ':')[1];
                configs.accept = acceptStr;
                break;
            case 'reject:':
                var rejectStr = parenMatches[i].split(configs[3] + ':')[1];
                configs.reject = rejectStr;
                break;
            case 'alpha:':
                var alphaStr = parenMatches[i].split(configs[4] + ':')[1];
                configs.alpha = alphaStr.split(',');
                break;
            case 'tape-alpha:':
                var tapeStr = parenMatches[i].split(configs[5] + ':')[1];
                configs.tapeAlpha = tapeStr.split(',');
                break;
            default:
                return null;
        }
    }
    if (verifyConfigs(configs)) {
        return configs;
    }
    return null;
}

function verifyConfigs(configs) {
    //verify states has no special chars
    for (var i = 0; i < configs.states.length; i++) {
        if (!configs.states[i].match(/[!@#$%^&*(),.?":{}|<>]/g)) {
            return false;
        } else
            console.log('ERROR: CONFIG STATE CONTAINS SPECIAL CHARACTER');
    }
    if (configs.states.indexOf(configs.start) > -1 && configs.states.indexOf(configs.accept) > -1 &&
        configs.states.indexOf(configs.reject) > -1 && configs.reject !== configs.start) {
        if (configs.alpha.every(val => configs.tapeAlpha.includes(val))) {
            return true;
        }
    }
    return false;
}

function parseCommands(cmdMatches, configsObj) {
    cmdObjList = [];
    for (var i = 0; i < cmdMatches.length; i++) {
        cmdObj = {};
        //remove semicolon
        cmdMatches[i] = cmdMatches[i].replace(/;/g, '');
        //replace whitespace in commands with commas
        let newMatch = cmdMatches[i].replace(/\s/gm, ',');
        let mSections = newMatch.split(',');
        if (commands.indexOf(mSections[0]) > -1) {
            switch (mSection) {
                case commands[0]:
                    if (mSections[5] !== undefined || mSections[5] !== '') {
                        console.log("ERROR: PARSE | INVALID ARGUMENTS");
                        return null;
                    }
                    if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], mSections[4])) {
                        let command = new Command();
                        command.cmd = commands[0];
                        command.params = [mSections[1], mSections[2], mSections[3], mSections[4]];
                        cmdObjList.push(command);
                    }
                    break;
                case commands[1]:
                    if (mSections[5] !== undefined || mSections[5] !== '') {
                        console.log("ERROR: PARSE | INVALID ARGUMENTS");
                        return null;
                    }
                    if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], mSections[4])) {
                        let command = new Command();
                        command.cmd = commands[0];
                        command.params = [mSections[1], mSections[2], mSections[3], mSections[4]];
                        cmdObjList.push(command);
                    }
                    break;
                case commands[2]:
                    if (mSections[3] !== undefined || mSections[3] !== '') {
                        console.log("ERROR: PARSE | INVALID ARGUMENTS");
                        return null;
                    }
                    if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, null)) {
                        let command = new Command();
                        command.cmd = commands[0];
                        command.params = [mSections[1], mSections[2]];
                        cmdObjList.push(command);
                    }
                    break;
                case commands[3]:
                    if (mSections[3] !== undefined || mSections[3] !== '') {
                        console.log("ERROR: PARSE | INVALID ARGUMENTS");
                        return null;
                    }
                    if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], null, null)) {
                        let command = new Command();
                        command.cmd = commands[0];
                        command.params = [mSections[1], mSections[2]];
                        cmdObjList.push(command);
                    }
                    break;
                case commands[4]:
                    if (mSections[4] !== undefined || mSections[4] !== '') {
                        console.log("ERROR: PARSE | INVALID ARGUMENTS");
                        return null;
                    }
                    if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], null)) {
                        let command = new Command();
                        command.cmd = commands[0];
                        command.params = [mSections[1], mSections[2], mSections[3]];
                        cmdObjList.push(command);
                    }
                    break;
                case commands[5]:
                    if (mSections[4] !== undefined || mSections[4] !== '') {
                        console.log("ERROR: PARSE | INVALID ARGUMENTS");
                        return null;
                    }
                    if (verifyCommand(configsObj, mSections[0], mSections[1], mSections[2], mSections[3], null)) {
                        let command = new Command();
                        command.cmd = commands[0];
                        command.params = [mSections[1], mSections[2], mSections[3]];
                        cmdObjList.push(command);
                    }
                    break;
                default:
                    console.log("ERROR: PROBLEM PARSING COMMAND");
                    return null;
            }
        } else
            console.log("ERROR: PROBLEM PARSING COMMAND");
        return null;
    }
    return null;
}

function verifyCommand(configsObj, cmd, stateParam1, tapeParam1, tapeParam2, stateParam2) {
    if (configsObj.states.indexOf(stateParam1) > -1 && configsObj.tapeAlpha.indexOf(tapeParam1)) {
        if (cmd === 'rRl' || cmd === 'rLl') {
            return true;
        }
        if (configsObj.tapeAlpha.indexOf(tapeParam2)) {
            if (cmd === 'rRt' || cmd === 'rLt') {
                return true;
            }
            if (configsObj.tapeAlpha.indexOf(stateParam2)) {
                if (cmd === 'rwRt ' || cmd === 'rwLt ') { 
                    return true;
                }
            }
        }
    }
    return false;
}

module.exports.getFileObjects = getFileObjects;