const log = require('../global/logger')
const fs = require('fs')
const path = require('path')


function loadCommands(commandsPath) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        commands.push(command);
    }
   if (commands.length > 0) {
     log.aya('Load Commands Scssfully')
   }
    return commands;
}

module.exports = loadCommands;
