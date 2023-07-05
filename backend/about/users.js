const express = require('express');
const router = express.Router();

const users = ["sally", "Michael", "Ronke"];
router.get('/', (req, res) => {
  res.send("enter a user Id");
})

router.route('/:id').get((req, res) => {
  res.send(`The user with ID ${req.params.id} is ${req.user}`);
}).put((req, res) => {
  res.send(`Added new user with ID: ${req.params.id}`);
}).delete((req, res) => {
  res.send(`Deleted user with ID: ${req.params.id}`);
})

router.param("id", (req, res, next, id) => {
  req.user = users[id];
  console.log(req.user);
  next()
})
module.exports = router;
