/**
 * This code searches youtube for videos based on user input
 *
 * the first function loads the client (browser)
 * the second function accepts the query and submits it to YouTube
 * the last part loads the gapi(google api), calling the loadClient function
 *
 * THIS IS THE FRONTEND IMPLEMENTATION OF THE YOUTUBE API... not used in this project.
 * implemented on the backend instead
 */


function loadClient() {
  gapi.client.setApiKey("API_KEY_HERE");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () { console.log("GAPI client loaded for API"); },
      function (err) { console.error("Error loading GAPI client for API", err); });
}

function execute() {
  const input = document.querySelector(".search");
  const text = input.value;
  return gapi.client.youtube.search.list({
    "part": [
      "snippet"
    ],
    "maxResults": 50,
    "q": text
  })
    .then(function (response) {
      console.log(text)
      console.log("Response", response);
    },
      function (err) { console.error("Execute error", err); });
}
gapi.load("client", loadClient)

const run = () => {
  loadClient().then(execute())
}
