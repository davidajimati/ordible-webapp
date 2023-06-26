#!/usr/bin/env node
// This module queries youTube based on title.

const fs = require('fs');
const { google } = require('googleapis');
const youtube = google.youtube('v3');

const filename = "../frontend/video-search/response.json"
const apiKey = "AIzaSyDTposgVakSuuZgQG_Q0igZECJsNqWQnCY";
const text = "We love the lord";

youtube.search.list({
  key: apiKey, // or auth: auth for OAuth 2.0
  "part": [
    "snippet"
  ],
  "maxResults": 50,
  q: text
}, (error, Response) => {
  if (error) {
    console.log("An error occurred", error);
    return;
  } // check if request is successful
  else if (Response.status === 200) {
    const jsonData = JSON.stringify(Response.data.items)

    //write results into a file
    fs.writeFile(filename, jsonData, { flag: 'w+' }, err => {
      if (err) {
        console.log("There's an error", err);
        return;
      }
      else {
        console.log("file written successfully.")
      }
    });
  }
});
