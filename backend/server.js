const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('youtube-dl-exec');
// const { spawn } = require('child_process');

const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');
const youtubeDl = require('./youtubedl');
const { error } = require('console');

app.use(express.static('public'));
app.use(cors())

let i = 0;
app.get('/search/:text', async (req, res) => {
  console.log("search path received a request")
  i += 1;
  const text = String(req.params.text);
  console.log(`Search ${i}: ${text}`);
  let response = await searchYoutube(text);
  res.set('Content-Type', 'application/json');
  res.json(response);
  console.log(`${response[0].snippet.title}\n-------------------------------`)
})

app.get('/download', async (req, res) => {
  console.log("download path received a request")
  let link = req.query.link;
  let title = req.query.title;
  console.log(link)
  console.log(title)
  res.setHeader("Content-Disposition", "attachment");
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  res.setHeader('Content-Type', 'audio/mpeg');
  let outputPath = await youtubeDl(link, title);
  res.download(outputPath);

})

app.get('/audio', (req, res) => {
  console.log("Audio route received a request\n")

  fs.readFile('/home/david/Desktop/ordible-webapp/convertedAudios/prinx-emmanuel.mp3', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading audio file');
    } else {
      // Convert the audio data to base64
      const base64Audio = data.toString('base64');
      res.json({ audio: base64Audio });
    }
  });
});

// const options = {
//   extractAudio: true,
//   audioFormat: 'mp3',
//   output: '-'
// };
// const fileName = req.query.title;
// const vidUrl = req.query.link;

// exec(vidUrl, options)
//   .then(output => {
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}.mp3`);
//     res.setHeader('Content-Type', 'audio/mpeg');
//     res.send(output);
//   })



// const youtubeDlProcess = spawn(`youtube-dl -x --audio-format mp3 -o - ${vidUrl}`, { stdio: ['ignore', 'pipe', 'ignore'] });
// youtubeDlProcess.stdout.pipe(res);

// youtubeDlProcess.on('error', error => {
//   console.error("Error", error)
//   res.status(500).end("An error Occurred while downloading the audio");
// });


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// console.log(youtubeDl('https://www.youtube.com/watch?v=UBhs7CpKPSs', "Ordible test Audio.mp3"));
