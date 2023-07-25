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

// HOME PAGE CODES
const Small_preloader = document.querySelector('.Small_preloader');
const Small_preloaderText = document.querySelector("#Small_preloaderText")
const resultsDiv = document.querySelector('.result')
const searchBox = document.querySelector(".search");

const errorNote = document.querySelector('.errorNote')
const errorSpan = document.querySelector('#errorSpan')

const resultsThumbnail = document.querySelector('.resultsThumbnail')
const result_thumbnailIMG = document.querySelector('.result_thumbnailIMG');
const resultsTitle = document.querySelector('.title')
const resultsAuthor = document.querySelector('.author')

const downloadButton = document.querySelector('#downloadButton')
const playButton = document.querySelector("#player");

async function ordiofy(string, specifiedURL) {
  try {
    if (specifiedURL) {
      var link = specifiedURL;
    } else {
      var link = searchBox.value
    }
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
        resultsDiv.style.display = "grid";
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

        result_thumbnailIMG.src = thumbnail_url;
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
          nextTrack(0)
        }

        if (string == 'download') {
          downloadAudioResource()
        } else if (string == 'play') {
          playAudioFile()
          audioPlayer.style.display = "flex";
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

modules.export = ordiofy;
