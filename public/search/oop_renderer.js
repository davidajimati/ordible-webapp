// MUSIC PLAYER CODES

const audioPlayer = document.querySelector('.audioPlayer');
const songListBox = document.querySelector('.songList-box');

const topDiv = document.querySelector('.top');
const header = document.querySelector('#header');
const options = document.querySelector('.options');
const expand = document.querySelector('#expand');
const minimize = document.querySelector('#minimize');
const close = document.querySelector('#close');

const coreArea = document.querySelector('.coreArea');
const audio_info = document.querySelector('.audio_info');
const thumbnail = document.querySelector('.thumbnail');
const artist_info = document.querySelector('#artist_info');
const song_title = document.querySelector('#song_title');
const artist = document.querySelector('#artist');

const audioControls = document.querySelector('.audioControls');
const controls = document.querySelector('.controls');
const prev = document.querySelector('#prev');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const next = document.querySelector('#next');
const playList_icon = document.querySelector("#playList_icon");
const downloadIcon = document.querySelector("#downloadIcon");


const sliderArea = document.querySelector('.sliderArea');
const trackStart = document.querySelector('.trackStart');
const slider = document.querySelector('#slider');
const trackEnd = document.querySelector('.trackEnd');

const reopen_player = document.querySelector('#reopen_player');

// {
//   path: "audio.mp3",
//   track_title: "Mountain of Fire",
//   track_author: "K spirit",
//   track_image: "../public/images/thumbnail1.png"
// }

let songList = []

// console.log(songList[0].track_author);

let musicPlayerActive = false;
let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let current_track = new Audio()
let expanded = false;
let currentIndex;

const loadNewTrack = async (track_index) => {
  resetValues();
  current_track.src = songList[track_index].path;
  current_track.load();

  let songTT = songList[track_index].track_title;

  thumbnail.style.backgroundImage = `url(${songList[track_index].track_image}`;
  song_title.textContent = songTT
  artist.textContent = songList[track_index].track_author;

  if (songTT.length > 25) {
    artist_info.classList.add('scroll_box')
    if (expanded) {
      const scroll_box = document.querySelector(".scroll_box");
      scroll_box.style.width = "200px"
    }

  } else {
    artist_info.classList.remove('scroll_box')
  }

  updateTimer = setInterval(seekUpdate, 1000);
  current_track.addEventListener('ended', nextTrack);
  return (true)
}

function pullToLocal() {
  fetch(`/download?path=${encodeURIComponent(songList[trackIndex].path)}`)
    .then(response => response.blob())
    .then(blob => {
      const audioUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = songList[trackIndex].track_title;
      a.click();
      URL.revokeObjectURL(audioUrl);
    })
}

function resetValues() {
  trackStart.textContent = calcDuration(0);
  trackEnd.textContent = calcDuration(0);
  slider.value = 0;
}

function calcDuration(dur) {
  let min = Math.floor(dur / 60);
  let sec = Math.floor(dur - min * 60)
  if (min < 10)
    min = '0' + min;
  if (sec < 10)
    sec = '0' + sec;
  return (`${min}:${sec}`)
}

const playPauseTrack = () => {
  if (!isPlaying) {
    play.innerHTML = 'pause_circle'
    current_track.play();
    isPlaying = true;
  } else {
    play.innerHTML = 'play_circle'
    current_track.pause();
    isPlaying = false;
  }
}

function startMusicPlayer() {
  // checks if music player is active - play/pause or loads new track
  if (!musicPlayerActive)
    nextTrack()
  else playPauseTrack()
  musicPlayerActive = true;
}

function playTrack() {
  play.innerHTML = 'pause_circle'
  current_track.play();
  isPlaying = true;
}

const nextTrack = async (idx) => {
  if (idx) {
    trackIndex = idx;
  } else {
    if (trackIndex < songList.length - 1)
      trackIndex += 1;
    else trackIndex = 0;
  }

  try {
    await loadNewTrack(trackIndex);
    playTrack();
    currentIndex = trackIndex;
  } catch (error) {
    console.log("error", error);
  }
}

const prevTrack = async () => {
  if (trackIndex > 0)
    trackIndex -= 1;
  else trackIndex = songList.length - 1;

  try {
    await loadNewTrack(trackIndex)
    playTrack()
    currentIndex = trackIndex
    console.log(currentIndex)
  } catch (error) {
    console.log("error", error)
  }
}

function showPlayList() {
  songListBox.style.display = "flex";
}

function closePlayList() {
  songListBox.style.display = "none";
}

const seekTo = () => {
  seek = Math.round((slider.value / 100) * current_track.duration);
  current_track.currentTime = seek;
  console.log(seek);
}

function seekUpdate() {
  let seek_position = 0;

  if (!isNaN(current_track.duration)) {
    seek_position = Math.floor((current_track.currentTime * 100) / current_track.duration)
    slider.value = seek_position;
  }
  trackStart.textContent = calcDuration(current_track.currentTime);
  trackEnd.textContent = calcDuration(current_track.duration)
}

const minimizePlayer = () => {
  audioPlayer.style.display = 'none';
  reopen_player.style.display = 'inline'
  songListBox.display = "none";
}

const reopenPlayer = () => {
  audioPlayer.style.display = "flex";
  audioPlayer.style.height = "fit-content";
  topDiv.style.display = "flex";
  topDiv.style.justifyContent = "space-between";
  topDiv.style.alignItems = "center";
  topDiv.style.width = "100%";
}

const closePlayer = () => {
  current_track.pause();
  audioPlayer.style.display = 'none';
  reopen_player.style.display = 'none';
  songListBox.display = "none";
}

function expandView() {
  // important metrics
  // resultsDiv.style.display = "grid";
  expanded = true;
  expand.style.display = 'none';
  minimize.style.display = 'inline';
  close.style.display = "inline";
  sliderArea.style.display = "flex";
  prev.style.display = 'inline';
  header.style.display = "inline-block"
  next.style.display = 'inline';
  playList_icon.style.display = 'inline';
  downloadIcon.style.display = 'inline';

  // modify audioPlayer
  audioPlayer.style.height = '80vh';
  audioPlayer.style.display = "grid";
  audioPlayer.style.padding = "10px";
  audioPlayer.style.gridTemplate = 'auto 1fr/ 1fr';


  // modify topDiv
  topDiv.style.alignItems = "flex-start";
  topDiv.style.height = "fit-content";


  // modify coreArea
  coreArea.style.justifyContents = "center";
  coreArea.style.display = "flex"
  coreArea.style.flexDirection = "column";
  coreArea.style.alignItems = "center";
  coreArea.style.justifyContent = "space-around";
  coreArea.style.gap = "50px"

  // modify audio_info
  audio_info.style.justifySelf = "center";
  audio_info.style.flexDirection = "column";
  audio_info.style.gap = "20px"
  audio_info.style.justifyContent = "space-around";
  //modify artist_info
  artist_info.style.textAlign = 'center';

  // /modify thumbnail
  thumbnail.style.height = "180px";
  thumbnail.style.width = "300px";
  thumbnail.style.borderRadius = "10px";

  // modify audioControls
  audioControls.style.margin = '0';
}

////-------------------------------------------------------------------------------------------------------------------------


function checkISO(input) {
  var isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2}))?$/;
  if (isoDatePattern.test(input)) return (findAge(input));
  else return ("");
}

const preloader = document.querySelector('.preloader');

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
  // stop preloader
  preloader.style.display = 'none';

  /* This appends results to the results-wrapper Div */
  const wrapper = document.querySelector('.results-wrapper');
  wrapper.innerHTML = ""

  //loops through the response json to create the elements
  for (let element of items) {
    // important elements
    const videoLink = "https://youtube.com/watch?v=" + element.id.videoId;
    const publishDate = element.snippet.publishedAt;
    const vidAge = checkISO(publishDate)
    const rawTitle = element.snippet.title;
    const vidTitle = calcTitle(element.snippet.title);
    const vidAuthor = element.snippet.channelTitle;
    const thumbnailLink = element.snippet.thumbnails.medium.url;

    // result div (single result)
    const result = document.createElement('div');
    result.classList.add('result');

    // searchThumbnail
    const searchThumbnail = document.createElement('div');
    searchThumbnail.classList.add('searchThumbnail');

    const image = document.createElement('img');
    image.src = thumbnailLink;
    image.style.display = "inline";
    //---------------

    // symbol
    const symbol = document.createElement('span');
    symbol.innerHTML = " &#x2022; ";
    symbol.style.color = "#da0707";

    // video Details div
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


    // icons Area
    const icons = document.createElement('div');
    icons.classList.add('icons');

    // play Link and Play Icon
    const playLink = document.createElement('a');
    playLink.classList.add("playLink");
    playLink.setAttribute("target", "_blank");

    const playIcon = document.createElement('i');
    playIcon.classList.add('fa', 'fa-play-circle');
    playIcon.setAttribute("aria-hidden", "true");

    playLink.appendChild(playIcon)
    playLink.addEventListener('click', () => {
      ordiofy(videoLink, thumbnailLink, vidAuthor)
    })

    // redirect Link and redirect Icon
    const redirectLink = document.createElement('a');
    redirectLink.classList.add("playLink");
    redirectLink.setAttribute("target", "_blank");

    const redirectIcon = document.createElement('i');
    redirectIcon.classList.add('fa', 'fa-youtube-play');
    redirectIcon.setAttribute("aria-hidden", "true");
    redirectIcon.style.color = "#da0707";

    redirectLink.appendChild(redirectIcon)
    redirectLink.href = videoLink;

    // download Link and download Icon
    const downloadLink = document.createElement('a');
    downloadLink.classList.add("downloadLink");
    // downloadLink.setAttribute("target", "_blank");
    downloadLink.href = `/download?link=${encodeURIComponent(videoLink)}`;

    const downloadIcon = document.createElement('i');
    downloadIcon.classList.add('fa', 'fa-download');
    downloadIcon.setAttribute("aria-hidden", "true");

    downloadLink.appendChild(downloadIcon)

    //  Append all child Items to the Parent Divs
    icons.appendChild(playLink)
    icons.appendChild(redirectLink)
    icons.appendChild(downloadLink)

    vidDetails.appendChild(title);
    vidDetails.appendChild(agenAuthor);
    vidDetails.appendChild(icons);

    searchThumbnail.appendChild(image);

    result.appendChild(searchThumbnail);
    result.appendChild(vidDetails);

    wrapper.appendChild(result);
  }
};

/* handles the search query (bridges the backend and frontend) */
const notice = document.querySelector('#notice');
const string = document.querySelector('#string')
async function handleSearch(searchText) {

  preloader.style.display = 'flex';
  notice.style.display = "none"
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
      string.textContent = searchText;
      notice.style.display = "inline-block"
    })
    .catch(error => {
      preloader.style.display = 'flex';
      preloader.style.display = 'none';

      notice.textContent = "Your request couldn't be completed, Please try again..."
      notice.style.display = "inline-block"
      notice.style.color = "black"
      notice.style.paddingTop = "40px"
      console.log("there was an error:", error);
    })
}


// -----------ORDIOFYER -------------

const Small_preloader = document.querySelector('.Small_preloader');

async function ordiofy(specifiedURL, thumbnailLink, channelName) {
  try {
    if (specifiedURL.length == 0) {
      return
    }

    Small_preloader.style.display = "flex"

    fetch(`/audio?link=${encodeURIComponent(specifiedURL)}`)
      .then((response) => response.json())
      .then((data) => {
        var audioPath = data.path
        var audioTitle = data.title

        Small_preloader.style.display = "none";
        audioPlayer.style.display = "flex";

        const trackInfo = {
          path: `../${audioPath}`,
          track_title: audioTitle,
          track_author: channelName,
          track_image: thumbnailLink
        }
        console.log(trackInfo)
        return (trackInfo)
      })
      .then(trackInfo => {
        songList.unshift(trackInfo);
        nextTrack(0)
      })
  } catch (err) {
    Small_preloader.style.display = "none"
    notice.style.display = "inline-block"
    notice.textContent = "Oops! an error occurred... Please try again"
    string.textContent = ""
    console.error('Oops! an error occurred... Please try again:', err)
  }
}
