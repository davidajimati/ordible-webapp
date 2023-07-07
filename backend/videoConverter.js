#!/usr/bin/env node
// test fluent-ffmpeg
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const ytdl = require('ytdl-core')

async function convert() {
  const vidUrl = "https://www.youtube.com/watch?v=UBhs7CpKPSs";
  // const vidTitle = "Hallelujah- praise the lord - Nathaniel_bassey ft. Willam_McDowell";

  ffmpeg(ytdl(vidUrl, { filter: 'audioonly' }))
    .output(`mountain2.mp3`)
    .on('end', () => {
      console.log("Conversion completed");
    })
    .on('error', (err) => {
      if (typeof (err.message)) {
        console.log("Error: ", err.message);
      } else {
        console.log("Error: ", err);
      }
    })
    .run()
}

function ytdlCheck() {
  const audioStream = ytdl("https://www.youtube.com/watch?v=UBhs7CpKPSs", { filter: 'audioonly' });
  audioStream.pipe(fs.createWriteStream('./mountain1.mp3'));
}


// https://web.facebook.com/reel/951700565941472
