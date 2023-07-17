#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');

async function masterFunction(url, audioTitle) {
  const options = {
    extractAudio: true,
    audioFormat: 'mp3',
    output: `backend/convertedAudios/${audioTitle}.mp3`
  };

  const rawOutput = await downloadAudio(url, options)
  console.log("raw output:",  )
  const audioPath = await getPath(String(rawOutput.stdout))
  console.log(audioPath);
  return (audioPath);
}

async function downloadAudio(url, options) {
  try {
    let stdout = await exec(url, options);
    console.log(stdout)
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

module.exports = masterFunction;
