const express = require('express');
const cors = require('cors');
const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');

app.use(express.static('public'));
app.use(cors())

app.get('/search/:text', async (req, res) => {
  const text = String(req.params.text);
  console.log(text);
  let response = await searchYoutube(text);
  res.json(`${response}`);
  console.log(response);
})

app.listen(3000);
