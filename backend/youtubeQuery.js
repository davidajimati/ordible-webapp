#!/usr/bin/env node
/* This module queries youTube based on title. */

const fs = require('fs');
const { google } = require('googleapis');
const apiKey = "AIzaSyC9G4MWeKT2OYeNlaZ6VXG-iHrpt9j_aU8";

const youtubeQuery = (titleString) => {
  const youtube = google.youtube('v3');
  const filename = "public/search/results.json";
  try {
    return new Promise((resolve, reject) => {
      youtube.search.list({
        key: apiKey,
        "part": [
          "snippet"
        ],
        "maxResults": 50,
        q: titleString
      }, (error, Response) => {
        if (error) {
          console.log("An error occurred", error);
          reject(error);
        }
        // check if request is successful
        else if (Response.status === 200) {
          resolve(Response.data.items);
        }
      });
    })
  } catch (err) {
    return new Error("an error occured");
  }
}

module.exports = youtubeQuery
