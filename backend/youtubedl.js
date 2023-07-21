#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('youtube-dl-exec');
const regex = require('regex');
const path = require('path');

const rgx_new = /\[ExtractAudio\] Destination: (.+)/;
const rgx_existing = /\[download\]\s(.*\.mp3)/;
const outputFolder = './public/convertedAudios'

async function masterFunction(url) {
  // console.log("Master function received a request---------\n")
  try {

    const convertOptions = {
      extractAudio: true,
      audioFormat: 'mp3',
      output: `${outputFolder}/%(title)s [${url.slice(-11)}].%(ext)s`,
    };

    const rawConverterOutput = await downloadAudio(url, convertOptions);
    const str_out = String(rawConverterOutput.stdout);

    if (str_out.search("has already been downloaded") != -1) {
      // console.log("Has already been downloaded")
      const rawPath = await getPath(str_out, rgx_existing);
      var finalPath = rawPath.slice(9)
      const rawTitle = rawPath.slice(25, -18) + '.mp3'
      var title = cleanupTitle(rawTitle)

    } else {
      // console.log("Not downloaded yet")
      const rawPath = await getPath(str_out, rgx_new);
      var finalPath = rawPath.slice(9)
      const rawTitle = rawPath.slice(25, -18) + '.mp3'
      var title = cleanupTitle(rawTitle)
    }

    const retJson = {
      'path': finalPath,
      'title': title
    }
    // console.log(retJson)
    return retJson
  } catch (err) {
    console.log("Boss, there was an error:", err)
    return new Error("An error occurred: ", err);
  }
}

// performs the conversion and details download process
async function downloadAudio(url, options) {
  console.log("Download function received a request, processing ----\n")
  try {
    let stdout = await exec(url, options);
    // console.log(stdout);
    return stdout
  } catch (err) {
    console.log("Error downloading stuff -> DownloadAudio function ----\n", err)
    return new Error("An error occurred")
  }
}

// cleans up title
function cleanupTitle(rawFile_name) {
  // console.log("CleanupTitle working-\n")
  try {
    const validChars = "-_.()[]'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
    const sanitizedFileName = [...rawFile_name]
      .filter((char) => validChars.includes(char))
      .join('');
    return sanitizedFileName.replace(/\s+/g, ' ').trim();
  } catch (err) {
    // console.log("CleanupTitle threw an error .....\n")
    return new Error("An error occurred");
  }
}

async function getPath(rawOutput, pattern) {
  // console.log("getPath path function working----\n")
  try {
    const regex = pattern;
    const match = rawOutput.match(regex);

    if (match) {
      const audioPath = match[1];
      return audioPath;
    } else {
      // console.log('No match found.');
      return null;
    }
  } catch (err) {
    console.log("getPath path function encountered an error----\n", err, '\n')
    return new Error("An error occurred:", err);;
  }
}

module.exports = masterFunction

// const url = 'https://www.youtube.com/watch?v=V3_PPJOWetk'
// masterFunction(url)
//   .then(output => {
//     console.log(output.title);
//   }).catch(error => {
//     console.log(error);
//   });
