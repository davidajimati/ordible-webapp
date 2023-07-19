#!/usr/bin/env node

function isValidUrl(urlString) {
  try {
    return Boolean(new URL(urlString));
  }
  catch (e) {
    return false;
  }
}

console.log(isValidUrl('https://www.svsd  v'))
