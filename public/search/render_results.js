function checkISO(input) {
  var isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2}))?$/;
  if (isoDatePattern.test(input)) return (findAge(input));
  else return ("");
}

const findAge = (ISOdate) => {
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

const calcTitle = (string) => {
  if (string.length <= 56) {
    return (string)
  }
  return (string.slice(0, 53) + "...")
}

function renderer(items) {
  const wrapper = document.querySelector('.results-wrapper');
  wrapper.innerHTML = ""
  for (let element of items) {
    const videoLink = "https://youtube.com/watch?v=" + element.id.videoId;
    const publishDate = element.snippet.publishedAt;
    const vidAge = checkISO(publishDate)
    const vidTitle = calcTitle(element.snippet.title);
    const vidAuthor = element.snippet.channelTitle;
    const thumbnailLink = element.snippet.thumbnails.medium.url;

    const result = document.createElement('div');
    result.classList.add('result');

    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');

    const image = document.createElement('img');
    image.src = thumbnailLink;
    image.style.display = "inline";

    const symbol = document.createElement('span');
    symbol.innerHTML = " &#x2022; ";
    symbol.style.color = "#da0707";

    const vidDetails = document.createElement('div');
    vidDetails.classList.add('video-details');

    const title = document.createElement('h3');
    title.textContent = vidTitle;
    title.classList.add('title');

    const author = document.createElement('p');
    author.textContent = vidAuthor;
    author.classList.add('author');

    const age = document.createElement('p');
    age.style.display = "inline";
    age.classList.add('age');
    age.textContent = vidAge;

    const agenAuthor = document.createElement('div');
    agenAuthor.classList.add('agenAuthor');

    agenAuthor.appendChild(author);
    agenAuthor.appendChild(symbol);
    agenAuthor.appendChild(age);

    const icons = document.createElement('div');
    icons.classList.add('icons');

    const playLink = document.createElement('a');
    playLink.classList.add("playLink");
    playLink.setAttribute("target", "_blank");

    const playIcon = document.createElement('i');
    playIcon.classList.add('fa', 'fa-play-circle');
    // playIcon.style.color = "#0f0fc5"
    playIcon.setAttribute("aria-hidden", "true");

    playLink.appendChild(playIcon)

    const redirectLink = document.createElement('a');
    redirectLink.classList.add("playLink");
    redirectLink.setAttribute("target", "_blank");

    const redirectIcon = document.createElement('i');
    redirectIcon.classList.add('fa', 'fa-youtube-play');
    redirectIcon.setAttribute("aria-hidden", "true");
    redirectIcon.style.color = "#da0707";

    redirectLink.appendChild(redirectIcon)
    redirectLink.href = videoLink;

    const downloadLink = document.createElement('a');
    downloadLink.classList.add("downloadLink");
    downloadLink.setAttribute("target", "_blank");

    const downloadIcon = document.createElement('i');
    downloadIcon.classList.add('fa', 'fa-download');
    // downloadIcon.style.color = "#0f0fc5"
    downloadIcon.setAttribute("aria-hidden", "true");

    downloadLink.appendChild(downloadIcon)

    icons.appendChild(playLink)
    icons.appendChild(redirectLink)
    icons.appendChild(downloadLink)

    vidDetails.appendChild(title);
    vidDetails.appendChild(agenAuthor);
    vidDetails.appendChild(icons);

    thumbnail.appendChild(image);

    result.appendChild(thumbnail);
    result.appendChild(vidDetails);

    wrapper.appendChild(result);
  }
};

async function handleSearch(searchText) {
  // event.preventDefault()
  // const text = document.querySelector('#searchBox').value;
  const url = `http://localhost:3000/search/${searchText}`;

  await fetch(url)
    .then(response => {
      if (!response.ok) {
        console.log("Network response was not okay")
      }
      return response.json();
    })
    .then(response => {
      renderer(response);
    })
    .catch(error => {
      console.log("there was an error:", error);
    })
}

const textJSON = [
  {
      "kind": "youtube#searchResult",
      "etag": "PloRmuT996utfYNkDwiPzmRVqjI",
      "id": {
          "kind": "youtube#video",
          "videoId": "KUBv7oCL1i8"
      },
      "snippet": {
          "publishedAt": "2021-11-26T18:00:06Z",
          "channelId": "UC2kM2q7Vk8oEGh0nyE28arQ",
          "title": "Blero - HEJ AMAN (Prod.Nurteel)",
          "description": "ONIMA- http://smarturl.it/ONIMA Blero - Hej Aman - prod ( Nurteel ) Muzika: Nurteel & Blero Text: Gulo,Blero,Nurteel Record voice: ...",
          "thumbnails": {
              "default": {
                  "url": "https://i.ytimg.com/vi/KUBv7oCL1i8/default.jpg",
                  "width": 120,
                  "height": 90
              },
              "medium": {
                  "url": "https://i.ytimg.com/vi/KUBv7oCL1i8/mqdefault.jpg",
                  "width": 320,
                  "height": 180
              },
              "high": {
                  "url": "https://i.ytimg.com/vi/KUBv7oCL1i8/hqdefault.jpg",
                  "width": 480,
                  "height": 360
              }
          },
          "channelTitle": "BleroOfficial",
          "liveBroadcastContent": "none",
          "publishTime": "2021-11-26T18:00:06Z"
      }
  }
]

// renderer(textJSON);
