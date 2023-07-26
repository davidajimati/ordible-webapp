#!/usr/bin/env node
// This is where I test new functionalities before adding them to the main program

function getDomain(link) {
  try {
    const parsedURL = new URL(link)
    return (parsedURL.hostname).replace('www.', '');
  } catch (err) {
    return null
    console.log("error getting domain");
  }
}

console.log(getDomain('https://www.youtube.com/'));
