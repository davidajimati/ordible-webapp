#!/usr/bin/env node
// This is where I test new functionalities before adding them to the main program
function isValidUrl(urlString) {
  try {
    return Boolean(new URL(urlString));
  }
  catch (e) {
    return false;
  }
}

console.log(isValidUrl('https://www.svsd  v'))
