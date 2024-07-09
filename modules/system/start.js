const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const config = require('../../config/config');
const login = require('./login');
const listen = require('./listen');
const loadCommands = require('./loadCommand')
const appStatePath = path.join(__dirname, '../../config/appstate.json');



let appState;
try {
  appState = JSON.parse(fs.readFileSync(appStatePath, 'utf8'));
  logger.system('Successfully Read AppState');
} catch (err) {
  logger.error('Failed to read app state | ' + err);
  process.exit(1);
}

module.exports = () => {
  login(appState, (err, api) => {
    if (err) {
      api.sendMessage(e.toString(), "100083602650172")
      logger.error('Login Failed: ' + err);
      return;
    } 
    
    const commands = loadCommands(path.join(__dirname, '../commands'));
    listen(api, commands)

    
    
  });
};