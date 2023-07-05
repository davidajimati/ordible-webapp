const express = require('express');
const app = express()
app.set('view engine', 'ejs')
const searchYoutube = require('./youtubeQuery');

app.use(express.static('public'));
app.get('/video2', (req, res) => {
  res.render('public/search/index2')
})

app.get('/video', async (req, res) => {
  let response = await searchYoutube("God will make a way");
  res.send(`${response}`);
})

app.listen(3000);
