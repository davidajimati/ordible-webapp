#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');

async function masterFunction(url, audioTitle) {
  let extraChars = getRandomChars(12);
  if (!audioTitle) {
    outputTitle = `Ordible Audio ${extraChars}`
  } else {
    outputTitle = audioTitle
  }
  const options = {
    extractAudio: true,
    audioFormat: 'mp3',
    output: `./audios/${outputTitle}.mp3`
  };

  const rawOutput = await downloadAudio(url, options)
  const path = await getPath(String(rawOutput.stdout))
  // console.log(path);
  cleanedPath = await renameAudioFile(path);
  return (cleanedPath);
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

module.exports = masterFunction;
