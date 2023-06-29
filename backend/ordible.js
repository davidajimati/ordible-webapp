const express = require('express');
const app = express();

app.get('/', (req, res) => {
  console.log(req);
  res.send("hello world")
})
app.listen(3500);
