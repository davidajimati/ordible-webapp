const express = require('express');
const app = express();
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  // res.send("hello man")
  // res.download('README.md')
  res.render('index', { text342 : "david"})
})
app.listen(3500);
