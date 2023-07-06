const express = require('express');
const cors = require('cors');
const app = express()
// app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');

app.use(express.static('public'));
app.use(cors())

app.get('/search/:text', async (req, res) => {
  const text = String(req.params.text);
  let response = await searchYoutube(text);
  res.set('Content-Type', 'application/json');
  res.json(`${response}`);
  // console.log(response)
  console.log(JSON.stringify(response, null, 2));
  console.log(typeof(response));
})

app.listen(3000);
