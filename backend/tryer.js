#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('youtube-dl-exec');

const options = {
  extractAudio: true,
  audioFormat: 'mp3',
  output: '-'
};


async function downloadAudio(url, options) {
  try {
    let result = await exec(url, options);
    return (result.stdout)
  } catch {
    console.error('Error downloading audio:', error);
    // return null;
  }
}

downloadAudio('https://www.youtube.com/watch?v=UBhs7CpKPSs', options)
