#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');

const rgx_new = /\[ExtractAudio\] Destination: (.+)/;
const rgx_existing = /\[download\]\s(.*\.mp3)/;
const outputFolder = '../public/convertedAudios'

async function masterFunction(url) {
  console.log("Master function received a request---------\n")
  try {

    const convertOptions = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `${outputFolder}/%(title)s [${url.slice(-11)}].%(ext)s`,
    };

    const rawConverterOutput = await downloadAudio(url, convertOptions);
    const str_out = String(rawConverterOutput.stdout);

    if (str_out.search("has already been downloaded") != -1) {
      console.log("Has already been downloaded")
      const rawPath = await getPath(str_out, rgx_existing);
      const rawTitle = rawPath.slice(26)
      const cleanedTitle = cleanupTitle(rawTitle)
      var title = cleanedTitle.slice(0, -18) + '.mp3';
      var filePath = `${rawPath.slice(0, 26)}${cleanedTitle}`;

      console.log("Title:", title)
      console.log("File Path:", filePath)

    } else {
      console.log("Not downloaded yet")
      var rawPath = await getPath(str_out, rgx_new);
      var filePath = await renameAudioFile(rawPath);
      const cleanedTitle = filePath.slice(26)
      var title = cleanedTitle.slice(0, -18) + '.mp3';

      console.log("Title:", title)
      console.log("File Path:", filePath)
    }

    const retJson = {
      'path': filePath,
      'title': title
    }
    // return retJson
  } catch (err) {
    console.log("there was an error", err)
    return new Error("An error occurred");
  }
}

// performs the conversion and details download process
async function downloadAudio(url, options) {
  console.log("Download function received a request, processing ----\n")
  try {
    let stdout = await exec(url, options);
    return stdout
  } catch (err) {
    console.log("Error downloading stuff DownloadAudio function ----\n")
    return new Error("An error occurred")
  }
}

// cleans up title
function cleanupTitle(rawFile_name) {
  console.log("CleanupTitle working-\n")
  try {
    const validChars = '-_.()[]abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const sanitizedFileName = [...rawFile_name]
      .filter((char) => validChars.includes(char))
      .join('');
    return sanitizedFileName;
  } catch (err) {
    console.log("CleanupTitle threw an error .....\n")
    return new Error("An error occurred");
  }
}

// This function renames the audio file after it has been converted
async function renameAudioFile(audioPath) {
  console.log("Rename Audio file path function working----\n")
  try {
    const fileName = path.basename(audioPath);
    const validChars = '-_.()[]abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    const sanitizedFileName = [...fileName]
      .filter((char) => validChars.includes(char))
      .join('');
    const newAudioPath = path.join(path.dirname(audioPath), sanitizedFileName);
    fs.renameSync(audioPath, newAudioPath);
    return newAudioPath;
  } catch (err) {
    console.log("Rename Audio file path function error-----\n", err)
    return new Error("an error occurred")
  }
}

async function getPath(rawOutput, pattern) {
  console.log("getPath path function working----\n")
  try {
    const regex = pattern;
    const match = rawOutput.match(regex);

    if (match) {
      const audioPath = match[1];
      console.log('Audio Path:', audioPath);
      return audioPath;
    } else {
      console.log('No match found.');
      return null;
    }
  } catch (err) {
    console.log("getPath path function encountered an error----\n", err, '\n')
    return new Error("An error occurred");;
  }
}

// This function checks for the presence of a file in the filesystem
function checkAvailability(filePath) {
  try {
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
  } catch (err) {
    return new Error
  }
}

// module.exports = masterFunction;
const url = 'https://www.youtube.com/watch?v=2uARo-shs24'
// const url = 'https://www.youtube.com/watch?v=kvyP6jgrM1M'


masterFunction(url)
  // .then(output => {
  //   const str_out = String(output.stdout);
  //   // const path = getPath(String(output));
  //   if (str_out.search("has already been downloaded") != -1) {
  //     console.log("Has already been downloaded")
  //     console.log(getPath(str_out, rgx_existing))
  //   } else {
  //     console.log("Not downloaded yet")
  //     console.log(getPath(str_out, rgx_new))
  //   }
  //   // console.log(output);
  // }).catch(error => {
  //   console.log(error);
  // });
