#!/usr/bin/env node
// This module queries youTube based on title.

const fs = require('fs');
const { google } = require('googleapis');
const youtube = google.youtube('v3');
const filename = "../frontend/response.json"


const apiKey = "API_KEY_HERE";

youtube.search.list({
  key: apiKey, // or auth: auth for OAuth 2.0
  part: 'snippet',
  q: "God will make a way - Don Meon",

  "part": [
    "snippet"
  ],
  "maxResults": 1,
  q: "God will make a way - Don Meon"
}, (error, Response) => {
  if (error) {
    console.log("An error occurred", error);
    return;
  } // check if request is successful
  else if (Response.status === 200) {
    console.log(Response.data.items)
    const jsonData = JSON.stringify(Response.data.items)

    //write results into a file
    fs.writeFile(filename, jsonData, (err) => {
      if (err) throw err;
      else {
        console.log("file written successfully.")
      }
    });
  }
});
