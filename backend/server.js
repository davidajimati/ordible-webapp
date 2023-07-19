const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('youtube-dl-exec');

const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');
const youtubeDl = require('./youtubedl');
const { error } = require('console');
const { title } = require('process');

app.use(express.static('public'));
app.use(cors())

let i = 0;
app.get('/search/:text', async (req, res) => {
  try {
    console.log("search path received a request")
    i += 1;
    const text = String(req.params.text);
    let response = await searchYoutube(text);
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    console.log(`${response[0].snippet.title}\n-------------------------------`)
  } catch (err) {
    res.status(500).end("An error occurred")
    return
  }
})

app.get('/download', async (req, res) => {
  console.log("download path received a request")

  const check = await isValidUrl(req.query.link)
  if (!check) {
    // check if url is valid
    res.status(400).end("Invalid URL")
    return
  } else {
    try {
      res.setHeader("Content-Disposition", "attachment");
      res.setHeader('Content-Type', 'audio/mpeg');

      // youtubeDl(link, title)
      if (req.query.title) {  // try get resource by title
        let outputPath = await youtubeDl(null, cleanupTitle(req.query.title));
        res.download(outputPath);
      } else if (req.query.link) { // else get it by url
        let outputPath = await youtubeDl(req.query.link, null);
        res.download(outputPath.path);
      } else {
        throw Error("No link or title specified");
      }
    }
    catch (err) {
      console.log("Download route encountered a problem\n")
      res.status(400).end("Something went wrong")
      return
    }
  }
})

app.get('/audio', async (req, res) => {
  try {
    console.log("Audio route received a request\n")
    const check = await isValidUrl(req.query.link)
    if (!check) {
      //check if url is valid
      res.status(400).end("Invalid URL")
      return
    } else {
      try {
        const url = req.query.link;
        res.setHeader('Content-Type', 'application/json');
        const output = await youtubeDl(url, null) // returned path to the converted audio
        res.send(output);
      } catch (err) { // handle errors that may arise gracefully
        console.log("audio route encountered a problem----\n")
        res.status(400).end("Something went wrong")
        return
      }
    }
  } catch (err) {
    console.log("Audio route encountered an error\n")
    res.status(400).end("Something went wrong")
    return
  }
});

// ------------ HELPER FUNCTIONS ------------------

// computes random character to make up an indexing title.
function getRandomChars(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

// This function corrects the title before the conversion begins
function cleanupTitle(rawFile_name) {
  const validChars = '-_.()abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
  const sanitizedFileName = [...rawFile_name]
    .filter((char) => validChars.includes(char))
    .join('');
  return sanitizedFileName;
}

async function isValidUrl(urlString) {
  try {
    return Boolean(new URL(urlString));
  }
  catch (e) {
    return false;
  }
}

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// console.log(youtubeDl('https://www.youtube.com/watch?v=UBhs7CpKPSs', "Ordible test Audio.mp3"));
