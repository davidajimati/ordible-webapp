#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');

async function masterFunction(url) {
  console.log("Master function received a request---------\n")
  try {
    const outputFolder = '../public/convertedAudios'
    const convertOptions = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `${outputFolder}/%(title)s [${url.slice(-11)}].%(ext)s`,
    };

    const detailsOptions = {
      getFilename: true
    };

    const rawConverterOutput = await downloadAudio(url, convertOptions);
    const rawPath = await getPath(String(rawConverterOutput));
    if (rawPath != false) {
      console.log("rawPath is not false---------\n")
      const cleanPath = await renameAudioFile(rawPath);
      const finalPath = `convertedAudios/${cleanPath}`
      const title = cleanPath.slice(0, -18)

      const retJson = {
        'path': finalPath,
        'title': title
      }
      return retJson
    } else if (rawPath == Error) {
      console.log("rawPath is Error")
      return new Error
    } else {
      console.log("Looks like video has already been downloaded... fetching details----\n")
      const rawDetails = await downloadAudio(url, detailsOptions)
      const audioDetails = (rawDetails.stdout).split('\n')
      const rawPath = audioDetails[0].trim()
      const cleanPath = cleanupTitle(String(rawPath));
      const finalPath = `convertedAudios/${cleanPath}`
      const title = cleanPath.slice(0, -18) + '.mp3';

      const retJson = {
        'path': finalPath,
        'title': title
      }
      return retJson
    }
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
    console.log("Rename Audio file path function encountered an error-----\n")
    return new Error("an error occurred")
  }
}

async function getPath(rawOutput) {
  console.log("getPath path function working----\n")
  try {
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
  } catch (err) {
    console.log("getPath path function encountered an error----\n", err, '\n')
    return new Error("An error occurred");;
  }
}

module.exports = masterFunction;
