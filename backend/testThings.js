#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const audioTitle = "test Audio.mp3"
const filePath = `backend/convertedAudios/${audioTitle}`;
function checkAvailability(filePath) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist.\n___________________________________');
      return (false);
    } else {
      console.log('File exists.\n___________________________________');
      return (true);
    }
  });
}

checkAvailability(filePath)

"backend/convertedAudios/test Audio.mp3"
