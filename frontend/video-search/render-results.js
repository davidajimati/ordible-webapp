function renderer(array) {
  const wrapper = document.querySelector('.results-wrapper');
  array.forEach((element) => {
    const videoLink = "https://youtube.com/watch?v=" + element.id.videoId;
    const publishDate = element.snippet.publishedAt;
    const vidTitle = element.snippet.title;
    const vidAuthor = element.snippet.channelTitle;
    const thumbnailLink = element.snippet.thumbnails.medium.url;

    // ------------results div--------------------------------------
    const result = document.createElement('div');
    result.classList.add('result');

    // ---------------thumbnail div-----------------------------
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');

    const image = document.createElement('img');
    image.src = thumbnailLink;
    image.style.display = "inline";

    // -----------------video-details div---------------------------
    const symbol = document.createElement('span');
    symbol.innerHTML = " &#x2022; ";

    const symbol2 = document.createElement('span');
    symbol2.innerHTML = " &#x2022; ";

    const vidDetails = document.createElement('div');
    vidDetails.classList.add('video-details');

    const title = document.createElement('h3');
    title.textContent = vidTitle;
    title.classList.add('title');

    const titleLink = document.querySelector("#titleLink");
    titleLink.href = videoLink;

    const author = document.createElement('p');
    author.textContent = vidAuthor;
    author.classList.add('author');

    const duration = document.createElement('span');
    duration.textContent = vidDuration;
    duration.classList.add('duration');

    const extras = document.createElement('div');
    extras.classList.add('extras');

    const views = document.createElement('p');
    views.style.display = "inline";
    views.classList.add('views');
    views.textContent = vidViews;

    const age = document.createElement('p');
    age.style.display = "inline";
    age.classList.add('age');
    age.textContent = vidAge;
    //-------------------------------------------------------------------
    const icons = document.createElement('div');
    icons.classList.add('icons');

    const playIcon = document.createElement('i');
    playIcon.classList.add('fa', 'fa-play-circle');
    playIcon.setAttribute("aria-hidden", "true");

    const heartIcon = document.createElement('i')
    heartIcon.classList.add('fa', 'fa-heart')
    heartIcon.setAttribute("aria-hidden", "true");

    const downloadIcon = document.createElement('i');
    downloadIcon.classList.add('fa', 'fa-download');
    downloadIcon.setAttribute("aria-hidden", "true");

    icons.appendChild(playIcon)
    icons.appendChild(heartIcon)
    icons.appendChild(downloadIcon)
    // -------------append children to extras
    extras.appendChild(views);
    extras.appendChild(symbol2);
    extras.appendChild(age);

    // -------------append children to video-details
    vidDetails.appendChild(title);
    vidDetails.appendChild(author);
    vidDetails.appendChild(symbol);
    vidDetails.appendChild(duration);
    vidDetails.appendChild(extras);
    vidDetails.appendChild(icons);

    // -------------append children to thumbnail
    thumbnail.appendChild(image);

    // -------------append children to result
    result.appendChild(thumbnail);
    result.appendChild(vidDetails);

    // -------------append result to wrapper
    wrapper.appendChild(result);
  })
};
/*
const fs = require('fs');
const fileName = './response.json';
// read response file and store int in a variable
fs.readFile(fileName, (err, data) => {
  if (err) {
    console.log("There's an error", err);
    return;
  }
  else {
    const result = JSON.parse(data);
    // console.log(result);
    // renderer(result)
  }
}); */


function trial(array) {
  array.forEach((element) => {
    const videoLink = "https://youtube.com/watch?v=" + element.id.videoId;
    const publishDate = element.snippet.publishedAt;
    const vidTitle = element.snippet.title;
    const vidAuthor = element.snippet.channelTitle;
    const thumbnail = element.snippet.thumbnails.medium.url;
  });
}
