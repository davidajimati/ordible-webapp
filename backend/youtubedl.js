#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');

async function masterFunction(url, audioTitle) {
  let extraChars = getRandomChars(12);
  if (!audioTitle) {
    outputTitle = `Ordible ${extraChars}`
  } else {
    outputTitle = cleanupTitle(audioTitle)
  }
  const options = {
    extractAudio: true,
    audioFormat: 'mp3',
    output: `convertedAudios/${outputTitle}.mp3`
  };
  const rawOutput = await downloadAudio(url, options)
  const audioPath = await getPath(String(rawOutput.stdout))
  return (audioPath);
}


async function downloadAudio(url, options) {
  try {
    let stderr = await exec(url, options);
    return stderr
  } catch {
    console.error('Error downloading audio:', error);
    return null;
  } output
}


function getRandomChars(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
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

/*
* This function renames the audio file after it has been converted
async function renameAudioFile(audioPath) {
  const fileName = path.basename(audioPath);
  const validChars = '-_.()abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
  const sanitizedFileName = [...fileName]
    .filter((char) => validChars.includes(char))
    .join('');
  const newAudioPath = path.join(path.dirname(audioPath), sanitizedFileName);
  fs.renameSync(audioPath, newAudioPath);
  return newAudioPath;
}
*/


// This function corrects the title before the conversion begins
function cleanupTitle(rawFile_name) {
  const validChars = '-_.()abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
  const sanitizedFileName = [...rawFile_name]
    .filter((char) => validChars.includes(char))
    .join('');
  return sanitizedFileName;
}
module.exports = masterFunction;
