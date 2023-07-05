#!/usr/bin/env node
// This module queries youTube based on title.
const fs = require('fs');
const { google } = require('googleapis');
const apiKey = "AIzaSyDTposgVakSuuZgQG_Q0igZECJsNqWQnCY";

const youtubeQuery = (titleString) => {
  const youtube = google.youtube('v3');
  const filename = "../public/results.json";

  return new Promise((resolve, reject) => {
    youtube.search.list({
      key: apiKey, // or auth: auth for OAuth 2.0
      "part": [
        "snippet"
      ],
      "maxResults": 50,
      q: titleString
    }, (error, Response) => {
      if (error) {
        console.log("An error occurred", error);
        reject(error);
      } // check if request is successful
      else if (Response.status === 200) {
        const jsonData = JSON.stringify(Response.data.items)
        resolve(jsonData);

        //write results into a file
        /*fs.writeFile(filename, jsonData, { flag: 'w+' }, err => {
          if (err) {
            console.log("There's an error", err);
            reject(err);
          }
          else {
            console.log("file written successfully.")
            resolve(jsonData);
          }
        }); */
      }
    });
  })
}

module.exports = youtubeQuery
