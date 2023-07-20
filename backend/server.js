const express = require('express');
const cors = require('cors');
const fs = require('fs');
// const path = require('path');
const { exec } = require('youtube-dl-exec');

const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');
const youtubeDl = require('./youtubedl');
// const { error } = require('console');
// const { title } = require('process');

app.use(express.static('public'));
app.use(cors())

let i = 0;
app.get('/search/:text', async (req, res) => {
  try {
    // console.log("search path received a request")
    i += 1;
    const text = String(req.params.text);
    let response = await searchYoutube(text);
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    // console.log(`${response[0].snippet.title}\n-------------------------------`)
  } catch (err) {
    res.status(500).end("An error occurred")
    return
  }
})

app.get('/download', async (req, res) => {
  // console.log("download path received a request")
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
      const link = req.query.link
      let outputPath = await youtubeDl(link);
      res.download(outputPath.path);
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
    // console.log("Audio route received a request\n")
    const check = await isValidUrl(req.query.link)
    if (!check) {
      //check if url is valid
      res.status(400).end("Invalid URL")
      return
    } else {
      const url = req.query.link;
      res.setHeader('Content-Type', 'application/json');
      const output = await youtubeDl(url) // returned path to the converted audio
      res.send(output);
    }
  } catch (err) {
    console.log("Audio route encountered an error\n")
    res.status(400).end("Something went wrong")
    return
  }
});

// ------------ HELPER FUNCTIONS ------------------
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
