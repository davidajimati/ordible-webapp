const { google } = require('googleapis');
const youtube = google.youtube('v3');

const apiKey = "AIzaSyDTposgVakSuuZgQG_Q0igZECJsNqWQnCY";

youtube.search.list({
  key: apiKey, // or auth: auth for OAuth 2.0
  part: 'snippet',
  q: "God will make a way - Don Meon"
}, (error, Response) => {
  if (error) {
    console.log("An error occurred", error);
    return;
  }
  console.log(Response);
});
