const clc = require('cli-color');

const logger = console.log;

const log = {
  warn: (text = '') => {
    logger(clc.yellow('╭─────╮\n│ WARN \n╰─────╯    ' + text));
  },
  error: (text = '') => {
    logger(clc.red('╭─────╮\n│ ERROR \n╰─────╯    ' + clc.white(text)));
  },
  info: (text) => {
    logger(clc.green('╭─────╮\n│ INFO \n╰─────╯    ' + clc.white(text)));
  },
  system: (text = '') => {
    logger(clc.blue('╭─────╮\n│ SYSTEM \n╰─────╯     ' + clc.white(text)));
  },
  rainbow: (text = '') => {
    // Create a simple rainbow effect using cli-color
    const rainbowColors = [clc.red, clc.yellow, clc.green, clc.cyan, clc.blue, clc.magenta];
    const rainbowText = text.split('').map((char, i) => rainbowColors[i % rainbowColors.length](char)).join('');
    logger(rainbowText);
  },
  custom: (text, option) => {
    if (option && option.color && clc[option.color]) {
      logger(clc[option.color](text));
    } else {
      logger(text);
    }
  },
 on: () => {
   log.rainbow(`█▀ █ █▀█ 
▄█ █ █▀▄`)
 },
 aya: (text) => {
  logger(clc.blue('╭─────╮\n│ AYA \n╰─────╯    ' + clc.white(text)));
 }
};

module.exports = log;
