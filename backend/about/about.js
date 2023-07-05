const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send("Flinty Ola - God's own son")
}).get('/name', (req, res) => {
  res.send("David Ajimati")
}).get('/age', (req, res) => {
  res.send("26")
}).get('/married', (req, res) => {
  res.send("false")
})

module.exports = router;
