const audioPlayer = document.querySelector('.audioPlayer');

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


const sliderArea = document.querySelector('.sliderArea');
const trackStart = document.querySelector('.trackStart');
const slider = document.querySelector('#slider');
const trackEnd = document.querySelector('.trackEnd');

const reopen_player = document.querySelector('#reopen_player');

let songList = [
  {
    path: "audio.mp3",
    track_title: "Mountain of Fire",
    track_author: "K spirit",
    track_image: "../public/images/thumbnail1.png"
  },
  {
    path: "highpriest.mp3",
    track_title: "God will make a way - He puts a song scroll_box scroll_box scroll_box scroll_box",
    track_author: "Lanre Awosika",
    track_image: "../public/images/thumbnail3.png"
  }
]

// console.log(songList[0].track_author);

let musicPlayerActive = false;
let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let current_track = new Audio()

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
  } else {
    artist_info.classList.remove('scroll_box')
  }

  updateTimer = setInterval(seekUpdate, 1000);
  current_track.addEventListener('ended', nextTrack);
  return (true)
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

const nextTrack = async () => {
  if (trackIndex < songList.length - 1)
    trackIndex += 1;
  else trackIndex = 0;

  await loadNewTrack(trackIndex);
  playTrack();
}

const prevTrack = async () => {
  if (trackIndex > 0)
    trackIndex -= 1;
  else trackIndex = songList.length - 1;

  await loadNewTrack(trackIndex)
    .then(playTrack())
    .catch(err => {
      console.log("Error: ", err);
    });
}

const seekTo = () => {
  seek = (slider.value / 100) * current_track.duration;
  current_track.currentTime = seek;
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
}

const reopenPlayer = () => {
  audioPlayer.style.display = 'flex';
}

const closePlayer = () => {
  current_track.pause();
  audioPlayer.style.display = 'none';
  reopen_player.style.display = 'none';
}
