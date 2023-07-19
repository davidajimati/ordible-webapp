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
    res.set('Content-Type', 'application/json');
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
      // cleanup title before sending details to the
      let link = req.query.link;
      let title = cleanupTitle(req.query.title);

      res.setHeader("Content-Disposition", "attachment");
      res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
      res.setHeader('Content-Type', 'audio/mpeg');
      let outputPath = await youtubeDl(link, title);
      res.download(outputPath);
    }
    catch (err) {
      res.status(400).end("Something went wrong")
      return
    }
  }
})

app.get('/audio', async (req, res) => {
  console.log("Audio route received a request\n")
  const check = await isValidUrl(req.query.link)
  if (!check) {
    //check if url is valid
    res.status(400).end("Invalid URL")
    return
  } else {
    try {
      // standardize the audio title
      const url = req.query.link;
      let extraChars = getRandomChars(12);
      if (!req.query.title) {
        inputTitle = `Ordible ${extraChars}`
      } else {
        inputTitle = cleanupTitle(req.query.title)
      }
      // returned path to the converted audio
      const newAudioPath = await youtubeDl(url, inputTitle)

      // stream audio to client
      fs.readFile(newAudioPath, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading audio file');
        } else {
          // Convert the audio data to base64
          const base64Audio = data.toString('base64');
          res.json({ audio: base64Audio });
        }
      });
      // handle errors that may arise gracefully
    } catch (err) {
      res.status(400).end("Something went wrong")
      return
    }
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
