#!/usr/bin/env node
const axios = require('axios');
const apiUrl = "https://www.googleapis.com/youtube/v3/search"
const apiKey = "AIzaSyDTposgVakSuuZgQG_Q0igZECJsNqWQnCY";
const params = {
  key: apiKey, // or auth: auth for OAuth 2.0
  "part": [
    "snippet"
  ],
  "maxResults": 1,
  q: "God is here"
}
async function searchVideos(apiUrl, params) {
  const response = await axios.get(apiUrl, params);
  console.log(response);
}

searchVideos();
