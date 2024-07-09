const login = require('facebook-chat-api');

module.exports = (appState, callback) => {
  login({appState: appState}, callback);
};