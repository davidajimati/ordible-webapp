function ordiofy() {
  const Small_preloader = document.querySelector('.Small_preloader');
  const optionsButton = document.querySelector('.audio_options')
  const searchBox = document.querySelector(".search");

  const errorNote = document.querySelector('.errorNote')
  const errorSpan = document.querySelector('#errorSpan')

  const downloadButton = document.querySelector('#downloadButton')
  const playButton = document.querySelector("#player");
  const link = searchBox.value

  errorNote.style.display = "none";

  if (link.length == 0) {
    optionsButton.style.display = "none"
    return
  }
  Small_preloader.style.display = "flex"

  fetch(`/audio?link=${encodeURIComponent(link)}&title=${encodeURIComponent('test Audio')}`)
    .then((response) => response.json())
    .then((data) => {
      const base64Audio = data.audio;
      const audioBlob = base64toBlob(base64Audio);
      const audioUrl = URL.createObjectURL(audioBlob);
      playButton.src = audioUrl;

      // make button visible / hide loader
      Small_preloader.style.display = "none"
      optionsButton.style.display = "inline";

      const a = document.createElement('a');
      const fileName = "Diana Ross - He lives in you.mp3";

      a.href = audioUrl;
      a.download = fileName;
      downloadButton.addEventListener('click', () => {
        a.click();
      });

    })
    .catch((error) => {
      Small_preloader.style.display = "none"
      errorNote.style.display = "inline-block"
      errorSpan.textContent = link;
      console.error('Error fetching audio:', error)
    });

  function base64toBlob(base64Data) {
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: 'audio/mpeg' });
  }
}
