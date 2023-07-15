const express = require('express');
const cors = require('cors');
const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');
const youtubeDl = require('./youtubedl');

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

app.get('/hey/', (req, res) => {
  res.send(`hello ${req.query.yourName}`)
})
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// console.log(youtubeDl('https://www.youtube.com/watch?v=UBhs7CpKPSs', "Ordible test Audio.mp3"));
