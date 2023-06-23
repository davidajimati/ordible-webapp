function renderer(array) {
  const wrapper = document.querySelector('.results-wrapper');
  array.forEach((element) => {
    let vidTitle = element.title;
    let vidAuthor = element.author;
    let vidImage = element.image;
    let vidDuration = element.duration;
    let vidViews = element.views;
    let vidAge = element.age;

    // ------------results div--------------------------------------
    const result = document.createElement('div');
    result.classList.add('result');

    // ---------------thumbnail div-----------------------------
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');

    const image = document.createElement('img');
    image.src = vidImage;
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

    // -------------append children to thumbnail
    thumbnail.appendChild(image);

    // -------------append children to result
    result.appendChild(thumbnail);
    result.appendChild(vidDetails);

    // -------------append result to wrapper
    wrapper.appendChild(result);
  })
};

const resource = [
  // vid1 = {
  //   "title": "The Lord that healeth thee. ft. David Morrison",
  //   "author": "Don Meon",
  //   "image": "../images/yt-placeholder.jpg",
  //   "duration": "02:43",
  //   "views": "900K",
  //   "age": "3 months ago"
  // },

  vid2 = {
    "title": "Blessed Be your name oh Lord!",
    "author": "Pastor Chris Morgan",
    "image": "../images/yt-placeholder.jpg",
    "duration": "09:51",
    "views": "900K",
    "age": "3 years ago"
  },

  vid3 = {
    "title": "The sound of extreme heavenly revival by the waterfalls of heaven ft. David Morrison",
    "author": "Dunsin Oyekan",
    "image": "../images/yt-placeholder.jpg",
    "duration": "13:01",
    "views": "12K",
    "age": "2 Minutes ago"
  },

  vid4 = {
    "title": "Living waters ft. William McDowell",
    "author": "Nathaniel Bassey",
    "image": "../images/yt-placeholder.jpg",
    "duration": "05:43",
    "views": "354K",
    "age": "5 months ago"
  }
]

renderer(resource);
