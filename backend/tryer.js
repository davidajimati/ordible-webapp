#!/usr/bin/env node
// This is where I test new functionalities before adding them to the main program
const songList = [1, 2, 3, 4, 5, 6]
let trackIndex = 0;

function trier(idx) {
  if (idx > -1) {
    console.log("idx is present");
    trackIndex = idx;
  } else {
    if (trackIndex < songList.length - 1)
      trackIndex += 1;
    else trackIndex = 0;
  }
  return trackIndex
}

console.log(trier(0))
