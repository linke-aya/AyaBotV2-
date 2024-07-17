

module.exports = () => {
const log = require('../back/global/logger')
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  log.aya(`The Bot Working In Port : ${port}`);
});
}