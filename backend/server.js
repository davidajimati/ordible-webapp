const express = require('express');
const app = express();
app.set('view engine', 'ejs')
const aboutRouter = require('./about/about')
const userRouter = require('./about/users')

app.use('/about', aboutRouter);
app.use('/users', userRouter);
app.use(logger);
// app.use(express.render('frontend/video-search'))

app.get('/', (req, res) => {
  res.render('frontend/homepage')
})

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}
app.listen(3500);
