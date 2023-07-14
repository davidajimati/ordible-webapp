#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('youtube-dl-exec');

async function downloadAudio(url, title) {
  if (!title) {
    let title = "Ordible Audio download"
  }

  try {
    const options = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `./converted-audios/${title}.mp3`
    };

    await exec(url, options);
    // console.log(output)
    return (`./converted-audios/${title}.mp3`);
  } catch (error) {
    console.log('Error downloading audio\n:', error);
  }
}

// Usage example:
// const youtubeUrl = 'https://vimeo.com/819250296';
// downloadAudio(youtubeUrl);
// https://web.facebook.com/reel/951700565941472
// 'https://www.youtube.com/watch?v=UBhs7CpKPSs'

module.exports = downloadAudio;
