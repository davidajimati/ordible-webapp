#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');
const { exit } = require('process');

async function masterFunction(url, audioTitle) {
  const filePath = `backend/convertedAudios/${audioTitle}.mp3`;
  const fileExists = await checkAvailability(filePath);

  if (fileExists) {
    console.log('File found:', filePath);
    return filePath;
  } else {
    const options = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `backend/convertedAudios/${audioTitle}.mp3`
    };

    const rawOutput = await downloadAudio(url, options)
    if (rawOutput != null) {
      const audioPath = await getPath(String(rawOutput.stdout))
      console.log(audioPath);
      return (audioPath);
    }
  }
}

async function downloadAudio(url, options) {
  try {
    let stdout = await exec(url, options);
    return stdout
  } catch (error) {
    console.error('Error downloading audio:', error);
    return null;
  }
}

async function getPath(rawOutput) {
  const regex = /\[ExtractAudio\] Destination: (.+)/;
  const match = rawOutput.match(regex);

  if (match) {
    const audioPath = match[1];
    console.log('Audio Path:', audioPath);
    return audioPath;
  } else {
    console.log('No match found.');
    return null;
  }
}

function checkAvailability(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File does not exist.\n___________________________________');
        resolve(false);
      } else {
        console.log('File exists.\n___________________________________');
        resolve(true);
      }
    });
  });
}

// masterFunction("https://www.example/879", "Ordible i495ZA76gHJf")
module.exports = masterFunction;
