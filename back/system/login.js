
const log = require('../global/logger')
const fs = require('fs')
const path = require('path')
const login = require('facebook-chat-api')
const listen = require('./listen')

const appStatePath = path.join(__dirname, '../appstate.json');
const loadCommands = require('./loadcommands')

const cmdPath = path.resolve(path.join(__dirname, '../', 'commands'));
let appState;
try {
  appState = JSON.parse(fs.readFileSync(appStatePath, 'utf8'));
  log.aya('Successfully Read AppState.');
} catch (err) {
  log.error('Failed to read app state | ' + err);
  process.exit(1);
}

module.exports = function startBot() {
  login({appState: appState}, (err, api) => {
    if (err) {
      log.error('Login Failed: ' + err);
      return;
    } 
    const commands = loadCommands(cmdPath)
    listen(api, commands)
  });
}
