function ordiofy() {
  try {
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
    const link = searchBox.value

    errorNote.style.display = "none";

    if (link.length == 0) {
      resultsDiv.style.display = "none"
      return
    }

    Small_preloader.style.display = "flex"

    fetch(`/audio?link=${encodeURIComponent(link)}`)
      .then((response) => response.json())
      .then((data) => {
        const audioPath = data.path
        const audioTitle = data.title

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

        var playAudioFile = () => {
          const trackInfo = {
            path: audioPath,
            track_title: audioTitle,
            track_author: author,
            track_image: thumbnail_url
          }

          songList.unshift(trackInfo);
          loadNewTrack(0);
        }

        const startDownload = () => {
          downloadButton.setAttribute("onclick", `${downloadAudioResource(link, audioPath, audioTitle)}`)
        }

        // downloadButton.removeEventListener('click', startDownload)
        // downloadButton.addEventListener('click', startDownload)

        // downloadButton.addEventListener('click', startDownload)
        // downloadButton.removeEventListener('click', downloadAudioResource)
        // downloadButton.addEventListener('click', downloadAudioResource)

        downloadButton.addEventListener('click', () => {
          downloadButton.removeEventListener('click', startDownload)
          downloadButton.addEventListener('click', startDownload)
          downloadAudioResource(link, audioPath, audioTitle)
          downloadButton.removeEventListener('click', startDownload)
        })

      })
      .catch((err) => {
        resultsDiv.style.display = "none"
        Small_preloader.style.display = "none"
        errorNote.style.display = "inline-block"
        errorSpan.textContent = link;
        console.error('Ooops! an error occurred... Please try again:', err)
      });

  } catch (err) {
    resultsDiv.style.display = "none"
    Small_preloader.style.display = "none"
    errorNote.style.display = "inline-block"
    errorSpan.textContent = link;
    console.error('Ooops! an error occurred... Please try again:', err)
  }
}


// function handleDownloadClick(link, audioPath, audioTitle) {
//   console.log("Download button clicked");
//   downloadAudioResource(link, audioPath, audioTitle);
// }

function downloadAudioResource(url, path, audioTitle) {
  console.log("Download function enacted");
  fetch(`/download?link=${encodeURIComponent(url)}&path=${encodeURIComponent(path)}`)
    .then(response => response.blob())
    .then(blob => {
      const audioUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = audioTitle;
      a.click();
      URL.revokeObjectURL(audioUrl);
      setTimeout(() => {
        a.href = ""
        a.download = ""
      }, 1000)
    })
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
