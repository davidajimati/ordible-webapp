const express = require('express');
const cors = require('cors');
const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');
const youtubeDl = require('./youtubeDl');

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

app.get('/download/:link', async (req, res) => {
  console.log("download path received a request")
  let link = req.params.link;
  // let title = req.params.title;
  res.setHeader(`Content-Disposition', 'attachment`);
  res.setHeader('Content-Type', 'audio/mpeg');
  let outputPath = await youtubeDl(link);
  res.download(outputPath);

})
app.listen(3000);

// console.log(youtubeDl('https://www.youtube.com/watch?v=UBhs7CpKPSs', "Ordible test Audio.mp3"));
