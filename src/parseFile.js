//parseFile.js

function getFileObjects(inputFilePath) {
    if (verifyFilePath(inputFilePath)){
        if (readFile(inputFilePath) !== null) {
            let parsedContent = parseFileContent(fileContent);
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

function verifyFilePath(inputFilePath) {
    
    return isValidFilePath;
}

function readFile(inputFilePath) {
    if (verifyFileContent(fileContent)){
        return fileContent;
    }
    return null;
}

function verifyFileContent(fileContent) {

    return isValidFileContent;
}

function parseFileContent(fileContent) {
    return (configStr, cmdStr);
}

function parseConfigs(configStr) {
    if (verifyConfigs(configStr)){
        return configObj;
    }
    return null;
}

function verifyConfigs(configStr) {

    return isConfigValid;
}

function parseCommands(cmdStr) {
    if (verifyCommands(cmdStr))
    {
        return cmdObj;
    }
    return null;
}

function verifyCommands(cmdStr) {

    return isCmdValid;
}

module.exports.getFileObjects = getFileObjects;