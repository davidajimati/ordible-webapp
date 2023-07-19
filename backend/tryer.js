#!/usr/bin/env node
// This is where I test new functionalities before adding them to the main program

const { exec } = require('youtube-dl-exec');
const regex = require('regex');

async function downloadAudio(url) {
  try {
    const outputFolder = '../public/convertedAudios'
    const convertOptions = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `${outputFolder}/%(title)s [${url.slice(-11)}].%(ext)s`,
    };

    const detailsOptions = {
      getThumbnail: true,
      getTitle: true,
      getFilename: true,
      audioFormat: 'mp3'
    };

    // extract video metadata
    const rawDetails = await exec(url, detailsOptions)
    // convert video and get raw output
    const rawPath = await exec(url, convertOptions);
    // pass raw output to getPath to extract file path
    const audioPath = await getPath(String(rawPath));

    // extract details from audioDetails variable
    const audioDetails = (rawDetails.stdout).split('\n')

    const title = audioDetails[0].trim();
    const thumbnail_url = audioDetails[1].trim();


    if (audioPath != false) {
      var finalPath = `convertedAudios/${audioPath}`
    } else {
      var finalPath = `convertedAudios/${title} [${url.slice(-11)}].mp3`
    }

    console.log("title:", title, '\n', "thumbnail url: ", thumbnail_url, '\n', "file Path:", finalPath)

  } catch (err) {
    console.log("There was an error", err);
    return err;
  }
}

// downloadAudio('https://www.youtube.com/watch?v=V3_PPJOWetk')
// .then(output => {
//   console.log(output);
// }).catch(error => {
//   console.log(error);
// });

async function getPath(rawOutput) {
  try {
    const regex = /\[ExtractAudio\] Destination: (.+)/;
    const match = rawOutput.match(regex);

    if (match) {
      const audioPath = match[1];
      // console.log('Audio Path:', audioPath);
      return audioPath;
    } else {
      // console.log('No match found.');
      return false;
    }
  } catch (err) {
    return err
  }
}


// let a = 'Mordecaii zm - Fire 🔥 [Official Music video] [V3_PPJOWetk].mp3'
// let b = a.slice(0, -18) + '.mp3';
// console.log(b);

// const thumbnail_url = `https://i.ytimg.com/vi/${url.slice(-11)}/mqdefault.jpg`
