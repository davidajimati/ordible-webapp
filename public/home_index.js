const Small_preloader = document.querySelector('.Small_preloader');
const resultsDiv = document.querySelector('.result')
const searchBox = document.querySelector(".search");

const errorNote = document.querySelector('.errorNote')
const errorSpan = document.querySelector('#errorSpan')

const resultsThumbnail = document.querySelector('.resultsThumbnail')
const resultsTitle = document.querySelector('.title')
const resultsAuthor = document.querySelector('.author')

const downloadButton = document.querySelector('#downloadButton')
const playButton = document.querySelector("#player");

async function ordiofy(string) {
  try {
    var link = searchBox.value
    downloadButton.innerHTML = "";
    downloadButton.textContent = "Download";

    errorNote.style.display = "none";

    if (link.length == 0) {
      resultsDiv.style.display = "none"
      return
    }

    Small_preloader.style.display = "flex"

    fetch(`/audio?link=${encodeURIComponent(link)}`)
      .then((response) => response.json())
      .then((data) => {
        var audioPath = data.path
        var audioTitle = data.title

        // make button visible / hide loader
        resultsDiv.style.display = "flex";
        Small_preloader.style.display = "none"

        const checkDomain = isYouTubeLink(link)
        if (checkDomain) {
          if (extractID(link) != null) {
            var thumbnail_url = `https://i.ytimg.com/vi/${extractID(link)}/mqdefault.jpg`
          }
        } else {
          var thumbnail_url = "/images/default_thumbnail.webp"
        }
        const DomainName = getDomain(link);
        if (DomainName != null) {
          var author = DomainName;
        } else {
          var author = 'Ordible'
        }

        resultsThumbnail.src = thumbnail_url;
        resultsTitle.textContent = audioTitle;
        resultsAuthor.textContent = author;

        function downloadAudioResource() {
          fetch(`/download?link=${encodeURIComponent(link)}&path=${encodeURIComponent(audioPath)}`)
            .then(response => response.blob())
            .then(blob => {
              const audioUrl = URL.createObjectURL(blob);

              const a = document.createElement('a');
              a.href = audioUrl;
              a.download = audioTitle;
              a.click();
              URL.revokeObjectURL(audioUrl);
            })
        }

        function playAudioFile() {
          const trackInfo = {
            path: audioPath,
            track_title: audioTitle,
            track_author: author,
            track_image: thumbnail_url
          }
          songList.unshift(trackInfo);
          loadNewTrack(0);
        }

        if (string == 'download') {
          downloadAudioResource()
        } else if (string == 'play') {
          playAudioFile()
        }

      })
      .catch((err) => {
        resultsDiv.style.display = "none"
        Small_preloader.style.display = "none"
        errorNote.style.display = "inline-block"
        errorSpan.textContent = link;
        console.error('Oops! an error occurred... Please try again:', err)
      });

  } catch (err) {
    resultsDiv.style.display = "none"
    Small_preloader.style.display = "none"
    errorNote.style.display = "inline-block"
    errorSpan.textContent = link;
    console.error('Oops! an error occurred... Please try again:', err)
  }
}

function isYouTubeLink(url) {
  // Regular expression to match YouTube video URLs
  const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
}

function extractID(url) {
  // Regular expression to extract video ID from YouTube video URLs
  const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  if (match) {
    return match[3];
  }
  return null; // Return null if the URL is not a valid YouTube link
}

function getDomain(link) {
  try {
    const parsedURL = new URL(url)
    return parsedURL.hostname
  } catch (err) {
    return null
    console.log("error getting domain");
  }
}
