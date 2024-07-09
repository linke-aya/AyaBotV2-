const fs = require('fs');
const path = require('path');
const logger = require('./logger')
function loadCommands(commandsPath) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        commands.push(command);
    }
   if (commands.length > 0) {
     logger.custom('Load Commands Scssfully', 'COMMANDS', '\x1b[93m')
   }
    return commands;
}

module.exports = loadCommands;
