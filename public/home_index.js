function ordiofy() {

  const searchBox = document.querySelector(".search");

  const downloadButton = document.querySelector('#downloadButton')
  const playButton = document.querySelector("#player");
  const link = searchBox.value


  fetch(`/audio?link=${encodeURIComponent(link)}`)
    .then((response) => response.json())
    .then((data) => {
      const base64Audio = data.audio;
      const audioBlob = base64toBlob(base64Audio);
      const audioUrl = URL.createObjectURL(audioBlob);
      playButton.src = audioUrl;

      const a = document.createElement('a');
      const fileName = "Diana Ross - He lives in you.mp3";

      a.href = audioUrl;
      a.download = fileName;
      downloadButton.addEventListener('click', () => {
        a.click();
      });

    })
    .catch((error) => console.error('Error fetching audio:', error));

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
