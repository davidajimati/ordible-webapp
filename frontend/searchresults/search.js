wrapper = document.querySelector('.results-wrapper');

// ------------results div--------------------------------------
const result = document.createElement('div');
result.classList.add('result');

// ---------------thumbnail div-----------------------------
const  thumbnail = document.createElement('div');
thumbnail.classList.add('thumbnail');

const image = document.createElement('img');
image.src = "../images/yt-placeholder.jpg"
image.style.display = inline;

// -----------------video-details div---------------------------
const vidDetails = document.createElement('div')
vidDetails.classList.add('video-details');

const title = document.createElement('h3').textContent = "Lorem Ipsum Heading sample";
title.classList.add('title');

const author = document.createElement('p').textContent = "Morris Morgan ";
author.classList.add('author');

const duration = document.createElement('span').textContent = "06:24";
duration.classList.add('duration');

const extras = document.createElement('div').classList.add('extras');

const views = document.createElement('p').style.display = "inline";
views.classList.new('views');
views.textContent = "25.9M";

const symbol = document.createElement('span').innerHTML = "&#x2022;";

const age = document.createElement('p').style.display = "inline";
age.classList.new('age');
age.textContent = "5 years ago";
//-------------------------------------------------------------------
push
// -------------append children to extras
extras.appendChild(views)
extras.appendChild(symbol)

// -------------append children to video-details
vidDetails.appendChild(title);
vidDetails.appendChild(author);
vidDetails.appendChild(symbol);
vidDetails.appendChild(duration);
vidDetails.appendChild(extras);

// -------------append children to thumbnail
thumbnail.appendChild(image);

// -------------append children to result
result.appendChild(thumbnail)
result.appendChild(vidDetails)

// -------------append result to wrapper
wrapper.appendChild(result);
// ---------------------------------------------------
