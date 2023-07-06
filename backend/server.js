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
  // res.set('Content-Type', 'application/json');
  // res.json(`${response}`);
  res.json({"name": "david"});
  // console.log(JSON.stringify(response));
})

app.listen(3000);
