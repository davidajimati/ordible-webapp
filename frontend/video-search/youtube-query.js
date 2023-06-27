/**
 * This code searches youtube for videos based on user input
 *
 * the first function loads the client (browser)
 * the second function accepts the query and submits it to YouTube
 * the last part loads the gapi(google api), calling the loadClient function
 *
 * THIS IS THE FRONTEND IMPLEMENTATION OF THE YOUTUBE API... not used in this project.
 */
gapi.load("client", loadClient);

// var tokenForNextPage = String(updateToken()) ---------> ADVANCED FEATURE

/*    --------------> ADVANCED FEATURE
var queryObject2 = {
  "part": [
    "snippet"
  ],
  "maxResults": 50,
  "order": "viewCount",
  "pageToken": tokenForNextPage,
  "q": searchText
} */

/* --------------> ADVANCED FEATURE
function NextPage(queryObject2) {
execute(queryObject2)
} */

/*  ----------------------> ADVANCED FEATURE
function updateToken(queryObject) {
  return gapi.client.youtube.search.list(queryObject)
    .then(function (response) {
      if (response.status === 200) {
        return (response.result.nextPageToken);
      }
    },
      function (err) { console.error("Execute error", err); });
} */

function start() {
  execute();
}

function loadClient() {
  gapi.client.setApiKey("AIzaSyDTposgVakSuuZgQG_Q0igZECJsNqWQnCY");
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () {
      console.log("GAPI client loaded for API");
    },
      function (err) { console.error("Error loading GAPI client for API", err); });
}

function execute() {
  const input = document.querySelector(".search");
  var searchText = input.value;
  return gapi.client.youtube.search.list({
    "part": [
      "snippet"
    ],
    "maxResults": 50,
    "order": "viewCount",
    "q": searchText
  })
    .then(function (response) {
      console.log("searchText: ", searchText);
      if (response.status === 200) {
        // const jsonData = JSON.stringify(response.data.items)
        // console.log(response.result.items)
        const one = response.result.items[1];
        renderer(one);
      } else {
        console.log("Search cannot be fulfilled, please try later.");
      }
    },
      function (err) { console.error("Execute error", err); });
}

function renderer(object) {
  const wrapper = document.querySelector('.results-wrapper');
  for (const element in object) {
    const videoLink = "https://youtube.com/watch?v=" + element.id.videoId;
    const publishDate = element.snippet.publishedAt;
    const vidTitle = element.snippet.title;
    const vidAuthor = element.snippet.channelTitle;
    const thumbnailLink = element.snippet.thumbnails.medium.url;
    const vidAge = checkISO(publishDate)

    console.log(videoLink)
    console.log(publishDate)
    console.log(vidTitle)
    console.log(vidAuthor)
    console.log(thumbnailLink)
    console.log(vidAge)
    /*
        // ------------results div--------------------------------------
        const result = document.createElement('div');
        result.classList.add('result');

        // ---------------thumbnail div-----------------------------
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');

        const image = document.createElement('img');
        image.src = thumbnailLink;
        image.style.display = "inline";

        // -----------------video-details div---------------------------
        const symbol = document.createElement('span');
        symbol.innerHTML = " &#x2022; ";

        const symbol2 = document.createElement('span');
        symbol2.innerHTML = " &#x2022; ";

        const vidDetails = document.createElement('div');
        vidDetails.classList.add('video-details');

        const title = document.createElement('h3');
        title.textContent = vidTitle;
        title.classList.add('title');

        const titleLink = document.querySelector("#titleLink");
        titleLink.href = videoLink;

        const author = document.createElement('p');
        author.textContent = vidAuthor;
        author.classList.add('author');

        const duration = document.createElement('span');
        duration.textContent = vidDuration;
        duration.classList.add('duration');

        const extras = document.createElement('div');
        extras.classList.add('extras');

        const views = document.createElement('p');
        views.style.display = "inline";
        views.classList.add('views');
        views.textContent = vidViews;

        const age = document.createElement('p');
        age.style.display = "inline";
        age.classList.add('age');
        age.textContent = vidAge;
        //-------------------------------------------------------------------
        const icons = document.createElement('div');
        icons.classList.add('icons');

        const playIcon = document.createElement('i');
        playIcon.classList.add('fa', 'fa-play-circle');
        playIcon.setAttribute("aria-hidden", "true");

        const heartIcon = document.createElement('i')
        heartIcon.classList.add('fa', 'fa-heart')
        heartIcon.setAttribute("aria-hidden", "true");

        const downloadIcon = document.createElement('i');
        downloadIcon.classList.add('fa', 'fa-download');
        downloadIcon.setAttribute("aria-hidden", "true");

        icons.appendChild(playIcon)
        icons.appendChild(heartIcon)
        icons.appendChild(downloadIcon)
        // -------------append children to extras
        extras.appendChild(views);
        extras.appendChild(symbol2);
        extras.appendChild(age);

        // -------------append children to video-details
        vidDetails.appendChild(title);
        vidDetails.appendChild(author);
        vidDetails.appendChild(symbol);
        vidDetails.appendChild(duration);
        vidDetails.appendChild(extras);
        vidDetails.appendChild(icons);

        // -------------append children to thumbnail
        thumbnail.appendChild(image);

        // -------------append children to result
        result.appendChild(thumbnail);
        result.appendChild(vidDetails);

        // -------------append result to wrapper
        wrapper.appendChild(result); */
  }
};

function checkISO(input) {
  // Test if the string matches the ISO date pattern
  var isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2}))?$/;
  if (isoDatePattern.test(input)) return (findAge(input));
  else return ("");
}

const findAge = (ISOdate) => {
  // check if there is an input
  if (!ISOdate | ISOdate === "") return "";

  const now = new Date();
  const then = new Date(ISOdate);
  const milliSeconds = now - then;
  const seconds = Math.floor(milliSeconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.436875);
  const years = Math.floor(months / 12);

  if (years != 0) {
    return (years === 1) ? "1 year ago" : `${years} years ago`;
  } else if (months != 0) {
    return (months === 1) ? "1 month ago" : `${months} months ago`;
  } else if (weeks != 0) {
    return (weeks === 1) ? "1 week ago" : `${weeks} weeks ago`;
  } else if (days != 0) {
    return (days === 1) ? "1 day ago" : `${days} days ago`;
  } else if (hours != 0) {
    return (hours === 1) ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes != 0) {
    return (minutes === 1) ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return (seconds === 1) ? "1 second ago" : `${seconds} seconds ago`;
  }
}
