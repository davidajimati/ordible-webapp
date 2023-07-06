const express = require('express');
const cors = require('cors');
const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');

app.use(express.static('public'));
app.use(cors())

let i = 0;
app.get('/search/:text', async (req, res) => {
  i += 1;
  const text = String(req.params.text);
  console.log(`Search ${i}: ${text}`);
  let response = await searchYoutube(text);
  res.set('Content-Type', 'application/json');
  res.json(response);
  console.log(`${response[0].snippet.title}\n-------------------------------`)
})

app.listen(3000);
