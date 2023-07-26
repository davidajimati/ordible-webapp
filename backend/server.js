const express = require('express');
const cors = require('cors');
const fs = require('fs');
const pathJS = require('path');
const { exec } = require('youtube-dl-exec');

const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');
const youtubeDl = require('./youtubedl');
const { error } = require('console');
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
  res.setHeader("Content-Disposition", "attachment");
  res.setHeader('Content-Type', 'audio/mpeg');
  try {
    // console.log("download route got a request")
    const link = req.query.link;

    if (req.query.path) {
      // console.log("path present")
      if (req.query.client == "home") {
        var path = req.query.path
      } else {
        var path = (req.query.path).slice(3);
      }

      // console.log("sliced path", path);
      const available = await checkAvailability(`public/${path}`)
      if (available) {
        // console.log("path checked and available")
        res.setHeader("Content-Disposition", "attachment");
        res.setHeader('Content-Type', 'audio/mpeg');
        // console.log("File Present");
        // console.log(__dirname, `../public/${path}`);
        res.download(pathJS.join(__dirname, `../public/${path}`), (err) => {
          if (err) {
            console.log("Error", err);
          }
        });
        // console.log("file has been downloaded");
        return
      }
    }
    else {
      // console.log("download route: no path link only")
      const check = await isValidUrl(link)
      if (!check) {
        // check if url is valid
        res.status(400).end("Invalid URL")
        return
      } else {
        res.setHeader("Content-Disposition", "attachment");
        res.setHeader('Content-Type', 'audio/mpeg');
        // const link = req.query.link
        let outputPath = await youtubeDl(link);
        // res.download(`public/${outputPath.path}`);
        // console.log(`public/${outputPath.path}`)
        res.download(pathJS.join(__dirname, `../public/${outputPath.path}`), (err) => {
          if (err) {
            console.log("Error", err);
          }
        });
      }
    }
  } catch (err) {
    console.log("Download route encountered a problem\n", err)
    res.status(500).end("Something went wrong")
    return
  }
});

app.get('/audio', async (req, res) => {
  try {
    // console.log("Audio route received a request\n")
    const check = await isValidUrl(req.query.link)
    if (!check) {
      //check if url is valid
      res.status(400).end("Invalid URL")
      // console.log("Invalid URL")
      return
    } else {
      // console.log("valid URL")
      const url = req.query.link;
      res.setHeader('Content-Type', 'application/json');
      const output = await youtubeDl(url) // returned path to the converted audio
      res.send(output);
      // console.log("Audio route: audio path sent ")
    }
  } catch (err) {
    console.log("Audio route encountered an error\n", err)
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

function checkAvailability(filePath) {
  // console.log(filePath);
  try {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          // console.error('File does not exist.\n___________________________________');
          resolve(false);
        } else {
          // console.log('File exists.\n___________________________________');
          resolve(true);
        }
      });
    });
  } catch (err) {
    return new Error
  }
}

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
