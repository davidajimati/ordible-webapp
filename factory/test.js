#!/usr/bin/env node
// '--extract-audio',

const fs = require('fs');
const { exec } = require('youtube-dl-exec');

async function downloadAudio(url) {
  try {
    const options = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: 'vimeoAudio.mp3',
    };

    await exec(url, options);

    console.log('Audio downloaded successfully!');
  } catch (error) {
    console.error('Error downloading audio:', error);
  }
}

const youtubeUrl = 'https://www.youtube.com/watch?v=UBhs7CpKPSs';
downloadAudio(youtubeUrl);
